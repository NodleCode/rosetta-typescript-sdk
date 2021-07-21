/// <reference types="node" />
export default RosettaSyncer;
/**
 * RosettaSyncer
 * Emits blockAdded and blockRemoved Events during sync.
 * Emits cancel if sync was cancelled.
 */
declare class RosettaSyncer extends EventEmitter {
    constructor({ networkIdentifier, fetcher, pastBlocks, maxSync, pastBlockSize, defaultSyncSleep, genesisBlock }: {
        networkIdentifier: any;
        fetcher: any;
        pastBlocks?: any[];
        maxSync?: number;
        pastBlockSize?: number;
        defaultSyncSleep?: number;
        genesisBlock?: any;
    });
    networkIdentifier: any;
    fetcher: any;
    pastBlocks: any[];
    genesisBlock: any;
    nextIndex: any;
    maxSync: number;
    pastBlockSize: number;
    defaultSyncSleep: number;
    setStart(startIndex?: number): Promise<void>;
    gensesisBlock: any;
    nextSyncableRange(endIndexIn: any): Promise<{
        halt: boolean;
        rangeEnd: any;
    }>;
    checkRemove(block: any): Promise<{
        shouldRemove: boolean;
        lastBlock: any;
    }>;
    processBlock(blockIn: any): Promise<void>;
    blockArrayToMap(blockArray: any): any;
    syncRange(endIndex: any): Promise<void>;
    /** Syncs the blockchain in the requested range.
     *  Endless cycle unless an error happens or the requested range was synced successfully.
     * @param {number} startIndex - Index to start sync from
     * @param {number} endIndex - Index to end sync at (inclusive).
     */
    sync(startIndex: number, endIndex: number): Promise<void>;
}
declare namespace RosettaSyncer {
    export { SyncEvents as Events };
}
import EventEmitter from "events";
import SyncEvents from "./events";
