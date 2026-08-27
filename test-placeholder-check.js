const fs = require('fs');
const assert = require('assert');

const config = JSON.parse(fs.readFileSync('./accesser.json', 'utf8'));

assert.strictEqual(
  config.keyopenai,
  'ISI_APIKEY_OPENAI_DISINI',
  'accesser.json must use the placeholder checked by sansekai.js'
);

console.log('OpenAI placeholder configuration check passed.');
