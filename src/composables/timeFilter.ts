import type { TimeSeries } from "@/types";

export function filtered(ts: TimeSeries, tf: string): TimeSeries {
    const keys = Object.keys(ts).sort((a, b) => new Date(a + '-01').getTime() - new Date(b + '-01').getTime());
    let numToTake: number;
    switch (tf) {
        case 'month':
            numToTake = 1;
            break;
        case 'quarter':
            numToTake = 3;
            break;
        case 'year':
        default:
            numToTake = keys.length;
            break;
    }
    const filteredKeys = keys.slice(-numToTake);
    const filteredTs: TimeSeries = {};
    filteredKeys.forEach(key => {
        filteredTs[key] = ts[key];
    });
    console.log('filteredKeys: ', filteredKeys)
    return filteredTs;
}

