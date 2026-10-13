# WhatsApp ChatGPT — historical Baileys bot

A community example connecting a WhatsApp client to OpenAI through Node.js and the older Baileys package.

> **Legacy status (2026):** This sample was written against earlier WhatsApp/Baileys and OpenAI SDK interfaces. A green syntax/configuration workflow does not mean the integration has been validated against current WhatsApp or current model APIs. Review dependencies and service policies before considering a live deployment.

## Configuration without committing secrets

The original instructions told users to edit a tracked JSON file with an API key. **Do not do that.**

The bot now loads its OpenAI key from the environment variable `OPENAI_API_KEY`. For older setups, it can also read an optional local `accesser.json` file, which is gitignored. The tracked repository includes only an `accesser.example.json` template.

```bash
git clone https://github.com/harshitethic/whatsapp-chatgpt.git
cd whatsapp-chatgpt
cp .env.example .env
# Edit .env locally with your key, then load the variables.
set -a; . ./.env; set +a
npm install
npm start
```

Variables:

| Name | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | API key; overrides any local JSON key |
| `BOT_NAME` | Display name for bot replies |
| `AUTO_AI` | true/false (or 1/0); overrides the local JSON setting |
| `BOT_DIAGNOSTICS` | Optional true for redacted activity metadata, disabled by default |

If you choose the local legacy JSON format, copy `accesser.example.json` to `accesser.json` and edit **only your local, ignored copy**. Never commit credentials, WhatsApp session credentials, QR data, or chat logs.

## Code overview

- `index.js`: WhatsApp/Baileys session entry point.
- `sansekai.js`: message and OpenAI integration handlers (legacy SDK).
- `config.js`: safe configuration resolution, with environment precedence.
- `privacy.js`: safe error replies, status-only error logs, opt-in privacy-preserving diagnostics.
- `tests/*.test.js`: standard-library tests for config and privacy boundaries.

## Quality checks

```bash
node --check index.js
node --check sansekai.js
node --check config.js
node --check privacy.js
node --test tests/*.test.js
```

These checks do not install dependencies, contact WhatsApp, make OpenAI calls, or start a session. The original Baileys integration needs a separate compatibility migration and integration tests before use in production.

## Security and maintenance

Read [SECURITY.md](SECURITY.md). For a more current, tested Telegram example with the OpenAI Responses API, see [chatgpt-bot-telegram](https://github.com/harshitethic/chatgpt-bot-telegram). Please open issues with minimal steps, version details and redacted logs.
