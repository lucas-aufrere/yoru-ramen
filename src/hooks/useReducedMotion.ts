'use client';

import { useSyncExternalStore } from 'react';

import { MOTION_QUERY } from '@/animations/config';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY.reduced);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(MOTION_QUERY.reduced).matches;
}

// Côté serveur la préférence est inconnue : on suppose le mouvement réduit,
// pour ne rien lancer (vidéo, animation) avant de connaître le vrai réglage.
function getServerSnapshot() {
  return true;
}

/**
 * Indique si l'utilisateur a demandé à réduire les animations, et suit les changements du réglage.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
