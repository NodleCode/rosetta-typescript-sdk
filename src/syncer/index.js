import * as Client from 'rosetta-node-sdk-client';
import RosettaFetcher from '../fetcher';
import EventEmitter from 'events';
import { SyncerError } from '../errors';
import { Hash } from '../utils';
import SyncEvents, { BLOCK_REMOVED, BLOCK_ADDED, SYNC_CANCELLED } from './events';
import sleep from '../utils/sleep';

const { PartialBlockIdentifier } = Client
/**
 * RosettaSyncer
 * Emits blockAdded and blockRemoved Events during sync.
 * Emits cancel if sync was cancelled.
 */
class RosettaSyncer extends EventEmitter {
  constructor({ networkIdentifier, fetcher, pastBlocks = [],
    maxSync = 999, pastBlockSize = 40, defaultSyncSleep = 5000, genesisBlock = null }) {
    super();

    this.networkIdentifier = networkIdentifier;
    this.fetcher = fetcher;
    this.pastBlocks = pastBlocks;
    this.genesisBlock = genesisBlock;

    this.nextIndex = null;

    this.maxSync = maxSync;
    this.pastBlockSize = pastBlockSize;
    this.defaultSyncSleep = defaultSyncSleep;

    // ToDo: Type checks
  }

  async setStart(startIndex = -1) {
    const networkStatus = await this.fetcher.networkStatusRetry(this.networkIdentifier);

    if (startIndex != -1) {
      this.nextIndex = startIndex;
      return;
    }

    this.gensesisBlock = networkStatus.genesis_block_identifier;
    this.nextIndex = networkStatus.genesis_block_identifier.index;
    return;
  }

  async nextSyncableRange(endIndexIn) {
    let endIndex = endIndexIn;

    if (this.nextIndex == -1) {
      throw new SyncerError('Unable to determine current head');
    }

    let networkStatus

    try {
      networkStatus = await this.fetcher.networkStatusRetry(this.networkIdentifier);

      if (endIndex == -1 || endIndex > networkStatus.current_block_identifier.index) {
        endIndex = networkStatus.current_block_identifier.index;
      }

    } catch (e) {
      throw new SyncerError(`Unable to get network status: ${e.message}`);
    }

    if (this.nextIndex > endIndex) {
      return {
        halt: true,
        rangeEnd: -1,
      };
    }

    if (endIndex - this.nextIndex > this.maxSync) {
      endIndex = this.nextIndex + this.maxSync;
    }

    return {
      halt: false,
      rangeEnd: endIndex,
    };
  }

  async checkRemove(block) {
    // ToDo: Type check block

    if (this.pastBlocks.length == 0) {
      return {
        shouldRemove: false,
        lastBlock: null,
      };
    }

    // Ensure processing correct index
    if (block.block_identifier.index != this.nextIndex) {
      throw new SyncerError(
        `Get block ${block.block_identifier.index} instead of ${this.nextIndex}`
      );
    }

    // Check if block parent is head
    const lastBlock = this.pastBlocks[this.pastBlocks.length - 1];

    if (Hash(block.parent_block_identifier) != Hash(lastBlock)) {
      if (Hash(this.genesisBlock) == Hash(lastBlock)) {
        throw new SyncerError('Cannot remove genesis block');
      }

      // Block can be removed.
      return {
        shouldRemove: true,
        lastBlock,
      };
    }

    return {
      shouldRemove: false,
      lastBlock: lastBlock,
    };
  }

  async processBlock(blockIn) {
    // ToDo: Type check block
    const block = Object.assign({}, blockIn); // clone

    const { shouldRemove, lastBlock } = await this.checkRemove(block);

    if (shouldRemove) {
      // Notify observers that a block was removed
      this.emit(BLOCK_REMOVED, lastBlock);

      // Remove the block internally
      this.pastBlocks.pop();
      this.nextIndex = lastBlock.index;
      return;
    }

    // Notify observers that a block was added
    this.emit(BLOCK_ADDED, block);

    // Add the block internally
    this.pastBlocks.push(block.block_identifier);
    if (this.pastBlocks.length > this.pastBlockSize) {
      this.pastBlocks.shift();
    }

    this.nextIndex = block.block_identifier.index + 1;
  }

  blockArrayToMap(blockArray) {
    return blockArray.reduce((a, c) => {
      a[c.block_identifier.index] = c;
      return a;
    }, {});
  }

  async syncRange(endIndex) {
    const nextIndex = this.nextIndex;

    const blockArray = await this.fetcher.blockRange(
      this.networkIdentifier,
      nextIndex,
      endIndex
    );

    const blockMap = this.blockArrayToMap(blockArray);

    while (this.nextIndex <= endIndex) {
      // ToDo: Map?
      let block = blockMap[this.nextIndex];

      if (!block) {
        // Re-org happened. Refetch the next block.
        const partialBlockIdentifier = PartialBlockIdentifier.constructFromObject({
          index: this.nextIndex,
        });

        block = await this.fetcher.blockRetry(
          this.networkIdentifier,
          partialBlockIdentifier,
        );

      } else {
        // We are going to refetch the block.
        // Delete the current version of it.
        delete blockMap[this.nextIndex];
      }

      await this.processBlock(block);
    }
  }

  /** Syncs the blockchain in the requested range.
   *  Endless cycle unless an error happens or the requested range was synced successfully.
   * @param {number} startIndex - Index to start sync from
   * @param {number} endIndex - Index to end sync at (inclusive).
   */
  async sync(startIndex, endIndex) {
    if (startIndex == null || endIndex == null ||
      isNaN(startIndex) || isNaN(endIndex)) {
      throw new SyncerError(`Arguments startIndex and endIndex must be a valid number`);
    }

    this.emit(SYNC_CANCELLED);

    try {
      await this.setStart(startIndex);
    } catch (e) {
      throw new SyncerError(`Unable to set sync start index: ${e.message}`);
    }

    while (true) {
      let rangeEnd;
      let halt;

      try {
        const result = await this.nextSyncableRange(endIndex);
        rangeEnd = result.rangeEnd;
        halt = result.halt;
      } catch (e) {
        throw new SyncerError(`Unable to get next syncable range: ${e.message}`);
      }

      if (halt) {
        if (this.nextIndex > endIndex && endIndex != -1) {
          // Quit Sync.
          break;
        }

        await sleep(this.defaultSyncSleep);
        continue;
      }

      if (this.nextIndex != rangeEnd) {
        logger.verbose(`Syncing ${this.nextIndex}-${rangeEnd}`);
      } else {
        logger.verbose(`Syncing ${this.nextIndex}`);
      }

      try {
        await this.syncRange(rangeEnd);
      } catch (e) {
        console.error(e);

        throw new SyncerError(`Unable to sync to ${rangeEnd}: ${e.message}`);
      }
    }

    if (startIndex == -1) {
      startIndex = this.genesisBlock.index;
    }

    logger.info(`Finished Syncing ${startIndex}-${endIndex}`);
  }
}

RosettaSyncer.Events = SyncEvents;

export default RosettaSyncer;