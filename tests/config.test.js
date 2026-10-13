'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { loadConfig } = require('../config');

test('accepts an environment API key without needing a committed config', () => {
  const cfg = loadConfig({ OPENAI_API_KEY: ' sk-example ', AUTO_AI: 'true' },
                         '/no/such/file.json');
  assert.equal(cfg.keyopenai, 'sk-example');
  assert.equal(cfg.autoAI, true);
});

test('environment settings override a private local configuration', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wa-config-'));
  try {
    const file = path.join(dir, 'accesser.json');
    fs.writeFileSync(file, JSON.stringify({ keyopenai: 'local-key', autoAI: true }));
    const cfg = loadConfig({ OPENAI_API_KEY: 'override', AUTO_AI: 'false' }, file);
    assert.equal(cfg.keyopenai, 'override');
    assert.equal(cfg.autoAI, false);
    const inherited = loadConfig({}, file);
    assert.equal(inherited.keyopenai, 'local-key');
    assert.equal(inherited.autoAI, true);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('invalid boolean config fails closed', () => {
  assert.throws(() => loadConfig({ AUTO_AI: 'surprise' }, '/no/such/file'),
                /AUTO_AI/);
});

test('no key returns existing legacy placeholder for user-facing guidance', () => {
  assert.equal(loadConfig({}, '/no/such/file').keyopenai,
               'ISI_APIKEY_OPENAI_DISINI');
});
