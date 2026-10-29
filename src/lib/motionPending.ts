/**
 * Attribut posé sur <html> avant le premier affichage : le CSS masque alors les éléments qui
 * apparaissent en animation (voir styles/base/_motion-pending.scss). Chaque animation rend
 * ensuite son élément visible en posant son état de départ (autoAlpha), quel que soit le moment
 * où sa section démarre : Next.js n'hydrate pas toute la page d'un coup.
 */
export const MOTION_PENDING_ATTRIBUTE = 'data-motion-pending';

// Délai après le chargement complet de la page (scripts compris) au bout duquel l'attribut est
// retiré. Les animations ont alors pris la main ; si le JS a échoué, le contenu réapparaît.
// Large, car React peut encore mettre plusieurs secondes à démarrer sur un téléphone lent.
const FALLBACK_DELAY_MS = 6000;

/**
 * Script en ligne, exécuté avant le premier affichage. Sans lui, le contenu rendu par le serveur
 * s'affiche, disparaît quand GSAP pose ses états de départ, puis réapparaît en animation : un
 * clignotement visible surtout à la première visite, quand le JS met plus longtemps à arriver.
 * Rien n'est masqué si l'utilisateur demande moins d'animations.
 */
export const MOTION_PENDING_SCRIPT = `(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  root.setAttribute('${MOTION_PENDING_ATTRIBUTE}', '');
  addEventListener('load', function () {
    setTimeout(function () { root.removeAttribute('${MOTION_PENDING_ATTRIBUTE}'); }, ${FALLBACK_DELAY_MS});
  });
})();`;
