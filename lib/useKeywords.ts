"use client";

import { useState, useEffect } from "react";
import { QUICK_TERMS } from "./keywords";

const STORAGE_CUSTOM = "rnrpc-custom-terms";
const STORAGE_REMOVED = "rnrpc-removed-terms";

export function useKeywords() {
  const [customTerms, setCustomTerms] = useState<string[]>([]);
  const [removedTerms, setRemovedTerms] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const custom: string[] = JSON.parse(localStorage.getItem(STORAGE_CUSTOM) ?? "[]");
    const removed: string[] = JSON.parse(localStorage.getItem(STORAGE_REMOVED) ?? "[]");
    setCustomTerms(custom);
    setRemovedTerms(new Set(removed));
    setReady(true);
  }, []);

  const visibleTerms = ready
    ? [...QUICK_TERMS.filter((t) => !removedTerms.has(t)), ...customTerms]
    : QUICK_TERMS;

  function addTerm(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    if (visibleTerms.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
    const next = [...customTerms, trimmed];
    setCustomTerms(next);
    localStorage.setItem(STORAGE_CUSTOM, JSON.stringify(next));
  }

  function removeTerm(term: string) {
    if (QUICK_TERMS.includes(term)) {
      const next = new Set(removedTerms).add(term);
      setRemovedTerms(next);
      localStorage.setItem(STORAGE_REMOVED, JSON.stringify([...next]));
    } else {
      const next = customTerms.filter((t) => t !== term);
      setCustomTerms(next);
      localStorage.setItem(STORAGE_CUSTOM, JSON.stringify(next));
    }
  }

  function resetToDefaults() {
    setCustomTerms([]);
    setRemovedTerms(new Set());
    localStorage.removeItem(STORAGE_CUSTOM);
    localStorage.removeItem(STORAGE_REMOVED);
  }

  const isModified = customTerms.length > 0 || removedTerms.size > 0;

  return { visibleTerms, addTerm, removeTerm, resetToDefaults, isModified };
}
