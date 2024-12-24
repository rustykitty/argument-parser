class InvalidSyntaxError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidSyntaxError';
    }
}

/**
 * split string but spaces in quotes are not split
 * @param str the string to split
 * @returns an array of tokens
 */
function splitWithQuotes(str: string) : Array<string> {
    let quote: boolean = false;
    let quote_char: string = '';
    let start = 0;
    let end = 0;
    let arr: Array<string> = [];
    for (let i: number = 0; i < str.length; ++i) {
        if (str[i] === ' ') {
            if (!quote) {
                arr.push(stripQuotes(str.substring(start, end).replace(/\\(['"])/g, '$1')));
                start = end + 1;
                i = start;
                end = start;
            }
        }
        if ((i == 0 || str[i - 1] != '\\') && (str[i] === '"' || str[i] === "'")) {
            if (quote) {
                if (str[i] === quote_char) {
                    quote = false;
                }
            } else {
                quote = true;
                quote_char = str[i];
            }
        }
        ++end;
    }
    if (str.substring(start, end)) arr.push(stripQuotes(str.substring(start, end)));
    if (quote) {
        throw new InvalidSyntaxError(`expected \`${quote_char}\`, got EOL instead`);
    }
    return arr;
}

function stripQuotes(str: string) : string {
    let newString: string = "";
    let quote: boolean = false;
    let quoteChar: string = '';
    for (let i: number = 0; i < str.length; ++i) {
        if (str[i] === '"' || str[i] === "'") {
            if (quote && str[i] === quoteChar) {
                quote = false;
                continue;
            } else if (!quote) {
                quote = true;
                quoteChar = str[i];
                continue;
            }
        }
        newString += str[i];
    }
    return newString;
}

let res: Array<string> = splitWithQuotes('hello "world" "this is a test"');

console.log(res);

for (const token of res) {
    console.assert(token.indexOf('"') === -1);
}

try {
    splitWithQuotes('I need to cause a "syntax error');
} catch (e) {
    console.log(`syntax error on string '${'I need to cause a "syntax error'}'`);
}

console.log(splitWithQuotes('"You can" also escape \\"chars\\" if "you want" to.'))

console.log(splitWithQuotes('Quotations don"\'"t even have to be right before or after a space! '))
