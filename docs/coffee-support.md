# Coffee support page

`/support` is linked from the sidebar, shared footer and About. It uses the shared Mini coffee animation and existing café art. All page text is English.

Set `PUBLIC_SUPPORT_URL` to Min’s actual HTTPS receiving profile on Buy Me a Coffee, Ko-fi or PayPal.me. The page identifies the provider and opens its hosted contribution page in a new tab. Amount, currency and payment collection are handled there. The site does not collect card information or claim that a visitor has paid.

Until a valid owner-supplied link is configured, the page clearly says the coffee jar is opening soon and offers an email thank-you instead. No guessed account, fake payment button or local-only checkout is used. Unsupported or malformed destinations remain unavailable.

Restart the local development server after changing `.env`. Set the same public environment variable in the deployment settings and rebuild for a live release. This feature does not create a payment provider account or deploy the website.
