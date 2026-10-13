# Security guidance

This repository is a **legacy reference implementation**. Its Baileys and OpenAI integrations have not been proven compatible with current provider APIs. Do not expose it as a public service without a full dependency review, explicit permissions, rate limiting and operational safeguards.

## Historical credential exposure — 14 October 2026

A review of historical public pull requests found proposed changes that included credential-like API key values in `accesser.json`. The affected unmerged PRs were closed with notices to their contributors. **Closing a PR does not erase its original commits or diff**. The keyholder should treat any genuine token that appeared there as compromised.

1. **OpenAI:** Revoke the exposed key in the provider's API-key dashboard and create a replacement. Monitor account usage for unexpected charges.
2. **WhatsApp session data:** If you shared a pairing/QR session or authentication material, unlink or terminate the exposed WhatsApp linked-device session using the official app, then pair again with freshly stored credentials.
3. Store replacements in an ignored local file or environment variable (`OPENAI_API_KEY`). Never put credentials in issues, PRs, screenshots, terminal logs, or commits.
4. Review the entire public history of your own fork. Deleting a secret in a newer commit does not invalidate the older leak. Ask GitHub Support about sensitive-data removal when necessary; **rotation comes first**.

## Diagnostic privacy

The current handler defaults to no raw message logging. It avoids printing provider error bodies and uses only generic user-facing failures. Optional `BOT_DIAGNOSTICS=true` emits limited command metadata, **not** chat text or phone numbers. See [privacy regression tests](tests/privacy.test.js).

## Reporting

Report vulnerabilities privately to `contact@harshitethic.com` with sanitized reproduction steps. Never paste functioning keys, private messages, WhatsApp session files or screenshots with personal details.

For a more modern, separately tested Telegram OpenAI example, see [chatgpt-bot-telegram](https://github.com/harshitethic/chatgpt-bot-telegram).
