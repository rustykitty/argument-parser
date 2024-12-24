"use strict";
class InvalidSyntaxError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidSyntaxError';
    }
}
/**
 * split string but spaces in quotes are not split
 * @param str the string to split
 * @returns an array of tokens
 */
function splitWithQuotes(str) {
    let quote = false;
    let quote_char = '';
    let start = 0;
    let end = 0;
    let arr = [];
    for (let i = 0; i < str.length; ++i) {
        if (str[i] === ' ') {
            if (!quote) {
                arr.push(str.substring(start, end).replace(/['"]/g, ''));
                start = end + 1;
                i = start;
                end = start;
            }
        }
        if (str[i] === '"' || str[i] === "'") {
            if (quote) {
                if (str[i] === quote_char) {
                    quote = false;
                }
            }
            else {
                quote = true;
                quote_char = str[i];
            }
        }
        ++end;
    }
    if (start != end)
        arr.push(str.substring(start, end).replace(/['"]/g, ''));
    if (quote) {
        throw new InvalidSyntaxError('Invalid syntax: missing closing quote');
    }
    return arr;
}
let res = splitWithQuotes('hello "world" "this is a test"');
console.log(res);
for (const token of res) {
    console.assert(token.indexOf('"') === -1);
}
