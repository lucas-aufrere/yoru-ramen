// Formateur créé une seule fois : sa construction est coûteuse.
const euroFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

/** Formate un prix en euros, à la française (ex. 14,50 €). */
export function formatPrice(price: number) {
  return euroFormatter.format(price);
}
