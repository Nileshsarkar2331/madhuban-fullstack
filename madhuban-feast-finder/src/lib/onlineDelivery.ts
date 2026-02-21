const normalize = (value: string) => value.trim().toLowerCase();

const restrictedItemNames = new Set(
  ['Mint Mojito', 'Blue Lagoon', 'Sweet & Salty Lemonade'].map(normalize)
);

const rotiAllowedNames = new Set(['Tawa Roti', 'Butter Roti'].map(normalize));

const rotiRestrictedNames = new Set(
  [
    'Tandoori Roti',
    'Plain Naan',
    'Butter Naan',
    'Garlic Naan',
    'Lachha Paratha',
    'Rumali Roti',
    'Rumali Paratha',
  ].map(normalize)
);

export const ONLINE_DELIVERY_BLOCK_MESSAGE = "Can't be delivered online";

export const isOnlineDeliverable = (name: string, categoryId?: string) => {
  const normalizedName = normalize(name);

  if (restrictedItemNames.has(normalizedName)) return false;

  if (categoryId === 'roti') {
    return rotiAllowedNames.has(normalizedName);
  }

  if (rotiRestrictedNames.has(normalizedName)) return false;

  return true;
};
