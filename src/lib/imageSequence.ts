/**
 * Ordre de téléchargement des images d'une séquence : une image sur `step` d'abord, pour qu'un
 * scroll rapide trouve toujours une image proche à afficher, puis toutes les autres dans l'ordre.
 */
export function getFrameLoadOrder(count: number, step: number) {
  const indices = Array.from({ length: count }, (_, index) => index);
  const isCoarse = (index: number) => index % step === 0;

  return [...indices.filter(isCoarse), ...indices.filter((index) => !isCoarse(index))];
}

/**
 * Index le plus proche de `target` pour lequel `isReady` est vrai, ou `null` si aucun ne l'est.
 */
export function findNearestIndex(
  count: number,
  target: number,
  isReady: (index: number) => boolean,
) {
  for (let distance = 0; distance < count; distance += 1) {
    if (target - distance >= 0 && isReady(target - distance)) return target - distance;
    if (target + distance < count && isReady(target + distance)) return target + distance;
  }

  return null;
}
