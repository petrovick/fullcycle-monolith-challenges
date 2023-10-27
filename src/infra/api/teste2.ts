export function getNonRepeatedPaymentAccordingToTxid(arr: any[], n: number) {
    const visitedTxids = new Map();
    const indexToBeRemoved: number[] = []
    // Count the occurrences of each object by its 'id', ignoring null values
    arr.forEach((obj, index) => {
        if(visitedTxids.size === n) return;

        const txid = obj.txid !== null ? obj.txid : null;
        if (!txid || !visitedTxids.has(txid)) {
            visitedTxids.set(obj.txid, index);
            indexToBeRemoved.push(index);
        }
    });

    const arrToBeReturned: any[] = [];
    indexToBeRemoved.forEach(index => arrToBeReturned.push(arr[index]));
    indexToBeRemoved.map(index => delete arr[index]);
    return arrToBeReturned;
}

export function testar() {

    // Example usage
    let arr = [
        { id: 1, value: 'A' },
        { id: 2, value: 'B' },
        { id: null, value: 'C' },
        { id: 1, value: 'D' },
        { id: 4, value: 'E' },
        { id: null, value: 'F' }, 
        { id: 2, value: 'G' }
    ];
    const N = 4;

    // First call without slicing
    let arrToBeReturned = getNonRepeatedPaymentAccordingToTxid(arr, N);
    console.log(`The first ${N} non-repeated objects are:`, arrToBeReturned);

    // Second call with slicing
    arrToBeReturned = getNonRepeatedPaymentAccordingToTxid(arr, N);
    console.log(`The first ${N} non-repeated objects are:`, arrToBeReturned);

}
