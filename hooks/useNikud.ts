import { useCallback } from 'react';
import { useUserStore } from '../stores/useUserStore';

// Hebrew nikud (vowel points) unicode range: U+05B0–U+05BD, U+05BF, U+05C1–U+05C2, U+05C4–U+05C5, U+05C7
const NIKUD_REGEX = /[ְ-ׇֽֿׁׂׅׄ]/g;

export function stripNikud(text: string): string {
  return text.replace(NIKUD_REGEX, '');
}

export function useNikud() {
  const showNikud = useUserStore((s) => s.showNikud);

  const applyNikud = useCallback(
    (text: string) => (showNikud ? text : stripNikud(text)),
    [showNikud]
  );

  return { showNikud, applyNikud };
}
