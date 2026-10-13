'use strict';

// Do not log user chat text, phone numbers, Telegram/WhatsApp payloads,
// raw API exceptions, authorization headers or provider-supplied responses.
// This module has no third-party dependencies for offline regression testing.

const AI_ERROR_EN = 'I am getting API Update right now. Please hold on and check back in a while.';
const AI_ERROR_ID = 'Maaf, sepertinya ada yang error';

function safeStatus(error) {
  const status = error?.status ?? error?.response?.status;
  return Number.isInteger(status) && status >= 400 && status <= 599
    ? String(status) : 'unknown';
}

function logAiError(error, logger = console) {
  logger.warn?.('[WhatsApp AI] request failed; status=' + safeStatus(error));
}

function replyAiError(reply, error, options = {}) {
  const { logger = console, language = 'en' } = options;
  logAiError(error, logger);
  return reply(language === 'id' ? AI_ERROR_ID : AI_ERROR_EN);
}

function logBotActivity({ command = '', isGroup = false, autoAI = false }, logger = console, env = process.env) {
  if (env.BOT_DIAGNOSTICS !== 'true') return;
  // Only an explicit allowlist is logged. Unknown user-supplied strings
  // are omitted rather than sanitizing chat content into an event.
  const knownCommands = new Set(['ai']);
  const label = !autoAI && knownCommands.has(command) ? command : (autoAI ? 'automatic' : 'other');
  logger.info?.('[WhatsApp AI] activity=' + label + ' group=' + Boolean(isGroup));
}

module.exports = { AI_ERROR_EN, AI_ERROR_ID, safeStatus, logAiError, replyAiError, logBotActivity };
