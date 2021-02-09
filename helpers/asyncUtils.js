
/**
 * @template T, RT
 * @param {T[]} array
 * @param {(item?: T, index?: number, array?: T[] ) => Promise<RT> | RT} asyncMapFunc
 */
export const mapAsync = (array, asyncMapFunc) => Promise.all(array.map(asyncMapFunc));

/**
 * @param {number} ms
 * @returns {void}
 */
export const timeout = (ms = 0) => new Promise((res) => setTimeout(res, ms));

