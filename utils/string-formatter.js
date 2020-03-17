/**
 * function to sanitize string to generate a regular expression
 * @param {string} string string to be escaped for generating regular expression
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * function to format strings
 * @param {string} stringToFormat String to be formatted
 * @param  {...any} values values to be inserted in the string
 */

const format = function (stringToFormat, ...values) {
    const length = values.length;
    let formattedString = null;

    if (!values || length < 1) {
        return stringToFormat;
    }

    for (let i = 0; i < length; i++) {
        const strToReplace = '{' + i + '}';
        formattedString = stringToFormat.replace(new RegExp(escapeRegExp(strToReplace), 'g'), values[i]);
    }

    return formattedString;
}

module.exports = { format };