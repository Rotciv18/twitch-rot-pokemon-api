export default (items, prop) => items.reduce((a, b) => a + b[prop], 0);
