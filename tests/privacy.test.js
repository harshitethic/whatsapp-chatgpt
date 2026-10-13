'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { AI_ERROR_EN, AI_ERROR_ID, safeStatus, replyAiError, logBotActivity } = require('../privacy');

function logs() {
  const events = [];
  return { events, logger: {
    warn: (...items) => events.push(items.join(' ')),
    info: (...items) => events.push(items.join(' '))
  }};
}

test('provider errors never reveal tokens, body or stack in logs and replies', () => {
  const secret = 'CONFIDENTIAL_TOKEN_DO_NOT_ECHO';
  const privateChat = 'a private customer discussion';
  const { events, logger } = logs();
  const messages = [];
  const error = new Error('provider rejected ' + secret + ' and ' + privateChat);
  error.status = 429;
  error.response = { headers: { authorization: secret }, data: privateChat };
  replyAiError(message => messages.push(message), error, { logger });
  assert.deepEqual(messages, [AI_ERROR_EN]);
  assert.deepEqual(events, ['[WhatsApp AI] request failed; status=429']);
  assert.doesNotMatch(events.join(' ') + messages.join(' '), /CONFIDENTIAL_TOKEN|private customer/);
});

test('status whitelist excludes arbitrary provider messages and untrusted values', () => {
  assert.equal(safeStatus({ status: 401 }), '401');
  assert.equal(safeStatus({ response: { status: 503 } }), '503');
  for (const status of ['TOKEN_SECRET', 302, 1000, NaN, undefined, '401']) {
    assert.equal(safeStatus({ status }), 'unknown');
  }
});

test('Indonesian error retains legacy message without stack traces', () => {
  const messages = [];
  const { events, logger } = logs();
  replyAiError(x => messages.push(x), new Error('private failure'), { language: 'id', logger });
  assert.deepEqual(messages, [AI_ERROR_ID]);
  assert.equal(events.length, 1);
});

test('activity logging defaults disabled for sensitive WhatsApp payloads', () => {
  const { events, logger } = logs();
  logBotActivity({ command: 'ai', isGroup: true,
    phone: '+1234567890', message: 'PRIVATE CHAT' }, logger, {});
  assert.deepEqual(events, []);
});

test('opt-in activity logging includes only approved command and group state', () => {
  const { events, logger } = logs();
  logBotActivity({ command: 'PRIVATE_CHAT_BODY', isGroup: true }, logger,
    { BOT_DIAGNOSTICS: 'true' });
  logBotActivity({ command: 'ai', isGroup: false }, logger,
    { BOT_DIAGNOSTICS: 'true' });
  logBotActivity({ command: 'ai', isGroup: true, autoAI: true }, logger,
    { BOT_DIAGNOSTICS: 'true' });
  assert.deepEqual(events, [
    '[WhatsApp AI] activity=other group=true',
    '[WhatsApp AI] activity=ai group=false',
    '[WhatsApp AI] activity=automatic group=true'
  ]);
});

test('legacy handler has no raw error, message logging or exception-as-reply', () => {
  const source = fs.readFileSync(path.join(__dirname, '../sansekai.js'), 'utf8');
  assert.doesNotMatch(source, /console\.log\(m\)|console\.log\(err\)|m\.reply\(util\.format\(err\)\)/);
  assert.match(source, /replyAiError\(m\.reply, err\)/);
});
