const fs = require('fs');
const assert = require('assert');
const config = JSON.parse(fs.readFileSync('./accesser.json', 'utf8'));
assert.strictEqual(config.keyopenai, 'ISI_APIKEY_OPENAI_DISINI');
console.log('placeholder check passed');
