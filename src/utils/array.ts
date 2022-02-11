/**
 * sample from array
 * @param {Array<T>} array
 * @return {T}
 */
export function sample<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}