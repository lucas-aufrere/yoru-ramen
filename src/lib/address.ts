export type PostalAddress = {
  street: string;
  postalCode: string;
  city: string;
};

/** Adresse sur une ligne (ex. « 12 rue de l’Exemple, 75000 Paris »). */
export function formatAddress({ street, postalCode, city }: PostalAddress) {
  return `${street}, ${postalCode} ${city}`;
}

/** Lien Google Maps qui cherche l'adresse : itinéraire et horaires de la fiche du lieu. */
export function getDirectionsUrl(address: PostalAddress) {
  const query = encodeURIComponent(formatAddress(address));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
