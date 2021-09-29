
/**
 * Parameters to be spread into `JSON.stringify` to match the KLE JSON format.
 * ```js
 * JSON.stringify(keyboardJSON, ...jsonStringifyOpts)
 * ```
 */
export const jsonStringifyOpts: [null, string] = [
  null,
  '  ',
];