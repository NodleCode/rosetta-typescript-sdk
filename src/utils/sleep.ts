export default function (timeoutMs: number) {
    return new Promise((fulfill, _) => {
        setTimeout(fulfill, timeoutMs);
    });
}
