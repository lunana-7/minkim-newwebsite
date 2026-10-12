// The receiving account is supplied by Min; never guess a payment destination.
export function supportDestination(value) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    const providers = {
      'buymeacoffee.com': 'Buy Me a Coffee',
      'www.buymeacoffee.com': 'Buy Me a Coffee',
      'ko-fi.com': 'Ko-fi',
      'www.ko-fi.com': 'Ko-fi',
      'paypal.me': 'PayPal',
      'www.paypal.me': 'PayPal',
    };
    const provider = providers[url.hostname];
    if (!provider || url.pathname === '/') return null;
    return { url: url.href, provider };
  } catch { return null; }
}
