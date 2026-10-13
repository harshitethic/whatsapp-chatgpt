'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Read credentials from the environment first. A local untracked JSON config
// remains supported for compatibility with older deployments.
function loadConfig(env = process.env, privateFile = path.join(__dirname, 'accesser.json')) {
  let fallback = {};
  if (fs.existsSync(privateFile)) {
    fallback = JSON.parse(fs.readFileSync(privateFile, 'utf8'));
  }

  const key = String(env.OPENAI_API_KEY || fallback.keyopenai || '').trim();
  const legacyDefault = Boolean(fallback.autoAI);
  let autoAI = legacyDefault;
  if (env.AUTO_AI !== undefined) {
    const flag = String(env.AUTO_AI).trim().toLowerCase();
    if (!['true', 'false', '1', '0'].includes(flag)) {
      throw new Error('AUTO_AI must be true/false or 1/0');
    }
    autoAI = flag === 'true' || flag === '1';
  }
  return {
    keyopenai: key || 'ISI_APIKEY_OPENAI_DISINI',
    autoAI,
  };
}

module.exports = loadConfig();
module.exports.loadConfig = loadConfig;
