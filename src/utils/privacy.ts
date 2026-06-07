export const privacyEventName = 'crypto-gem-privacy-change';
export const privacyStorageKey = 'crypto_gem_hide_balances';

export const readPrivacyPreference = () => {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage.getItem(privacyStorageKey);
  return stored === null ? true : stored === 'true';
};

export const writePrivacyPreference = (value: boolean) => {
  window.localStorage.setItem(privacyStorageKey, String(value));
  window.dispatchEvent(new CustomEvent(privacyEventName, { detail: value }));
};
