export function convertStringList(name, token) {
    const result = [];
    for (const item of token) {
        result.push(item.assertString(`${name} item`).value);
    }
    return result;
}
//# sourceMappingURL=string-list.js.map