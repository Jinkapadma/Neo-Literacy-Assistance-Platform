import React, { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage.js';
import { bhashiniApi } from '../../api/bhashiniApi.js';

// Elements that must never have their text nodes translated
const IGNORED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'SVG',
  'CODE',
  'PRE',
  'INPUT',
  'TEXTAREA',
  'NOSCRIPT',
]);

export const GlobalAutoTranslator = () => {
  const { interfaceLanguage, uiBundle } = useLanguage();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // In-memory cache per language
  const cacheRef = useRef({});
  const pendingBatchRef = useRef(new Set());
  const batchTimerRef = useRef(null);
  const isTranslatingRef = useRef(false);

  // Load language cache from localStorage
  useEffect(() => {
    if (!interfaceLanguage || interfaceLanguage === 'en') return;
    try {
      const saved = localStorage.getItem(`neoread_translations_${interfaceLanguage}`);
      cacheRef.current = saved ? JSON.parse(saved) : {};
    } catch {
      cacheRef.current = {};
    }
  }, [interfaceLanguage]);

  // Save language cache to localStorage
  const saveCache = useCallback(() => {
    if (!interfaceLanguage || interfaceLanguage === 'en') return;
    try {
      localStorage.setItem(
        `neoread_translations_${interfaceLanguage}`,
        JSON.stringify(cacheRef.current)
      );
    } catch {
      // Ignore quota exceeded
    }
  }, [interfaceLanguage]);

  // Helper to check if element is marked not to be translated (e.g. learning content or landing page)
  const isExcludedNode = (node) => {
    if (!node) return true;
    if (isLandingPage) return true; // Rule: Landing page content must always remain in English only
    const parent = node.parentElement;
    if (!parent) return true;

    if (IGNORED_TAGS.has(parent.tagName)) return true;
    if (
      parent.closest('[data-no-translate="true"]') ||
      parent.closest('[translate="no"]') ||
      parent.closest('.notranslate') ||
      parent.closest('.landing-page-root')
    ) {
      return true;
    }
    return false;
  };

  // Process batch of untranslated strings via Bhashini API
  const flushBatchQueue = useCallback(async () => {
    if (
      pendingBatchRef.current.size === 0 ||
      interfaceLanguage === 'en' ||
      isLandingPage ||
      isTranslatingRef.current
    ) {
      return;
    }

    const stringsToTranslate = Array.from(pendingBatchRef.current).slice(0, 35);
    stringsToTranslate.forEach(s => pendingBatchRef.current.delete(s));

    try {
      isTranslatingRef.current = true;
      const res = await bhashiniApi.translateBatch(stringsToTranslate, 'en', interfaceLanguage);
      const translations = res?.data?.translations || res?.translations || {};

      let hasNew = false;
      for (const [orig, trans] of Object.entries(translations)) {
        if (trans && trans !== orig) {
          cacheRef.current[orig] = trans;
          hasNew = true;
        }
      }

      if (hasNew) {
        saveCache();
        // Re-walk to apply newly arrived translations
        translateVisibleDOM();
      }
    } catch {
      // Ignore batch error
    } finally {
      isTranslatingRef.current = false;
      if (pendingBatchRef.current.size > 0 && !isLandingPage) {
        batchTimerRef.current = setTimeout(flushBatchQueue, 200);
      }
    }
  }, [interfaceLanguage, isLandingPage, saveCache]);

  // Schedule a translation batch request
  const scheduleBatch = useCallback(() => {
    if (isLandingPage) return;
    if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
    batchTimerRef.current = setTimeout(flushBatchQueue, 80);
  }, [flushBatchQueue, isLandingPage]);

  // Translate visible text nodes in the DOM
  const translateVisibleDOM = useCallback(() => {
    const rootEl = document.getElementById('root');
    if (!rootEl) return;

    // If English OR currently on the Landing Page, restore original English text for all nodes
    if (interfaceLanguage === 'en' || isLandingPage) {
      const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
      let currentNode = walker.nextNode();
      while (currentNode) {
        if (currentNode._neoreadOrigText !== undefined && currentNode.nodeValue !== currentNode._neoreadOrigText) {
          currentNode.nodeValue = currentNode._neoreadOrigText;
        }
        currentNode = walker.nextNode();
      }
      return;
    }

    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
    let currentNode = walker.nextNode();
    let hasQueuedNew = false;

    while (currentNode) {
      if (!isExcludedNode(currentNode)) {
        const rawText = currentNode.nodeValue;
        if (currentNode._neoreadOrigText === undefined) {
          currentNode._neoreadOrigText = rawText;
        }

        const original = currentNode._neoreadOrigText;
        const trimmed = original ? original.trim() : '';

        // Ignore empty, purely numeric, or single symbol strings
        if (trimmed && trimmed.length > 1 && !/^\d+([\.,]\d+)?%?$/.test(trimmed)) {
          // Check UI bundle first, then cache
          const match =
            uiBundle?.[trimmed] ||
            cacheRef.current[trimmed] ||
            cacheRef.current[trimmed.toLowerCase()];

          if (match && match !== trimmed) {
            // Preserve leading/trailing whitespace
            const leadingSpaces = original.match(/^\s*/)[0];
            const trailingSpaces = original.match(/\s*$/)[0];
            const localized = leadingSpaces + match + trailingSpaces;
            if (currentNode.nodeValue !== localized) {
              currentNode.nodeValue = localized;
            }
          } else if (!cacheRef.current[trimmed]) {
            // Queue for Bhashini batch translation
            pendingBatchRef.current.add(trimmed);
            hasQueuedNew = true;
          }
        }
      }
      currentNode = walker.nextNode();
    }

    if (hasQueuedNew && !isLandingPage) {
      scheduleBatch();
    }
  }, [interfaceLanguage, isLandingPage, uiBundle, scheduleBatch]);

  // Translate on mount, interface language change, or route change
  useEffect(() => {
    translateVisibleDOM();

    // Re-run after brief delay for dynamic components
    const timer = setTimeout(translateVisibleDOM, 150);
    return () => clearTimeout(timer);
  }, [interfaceLanguage, location.pathname, uiBundle, translateVisibleDOM]);

  // Observe DOM mutations to auto-translate new elements (dialogs, tabs, lazy lists)
  useEffect(() => {
    const rootEl = document.getElementById('root');
    if (!rootEl) return;

    let mutationDebounce = null;
    const observer = new MutationObserver(() => {
      if (mutationDebounce) clearTimeout(mutationDebounce);
      mutationDebounce = setTimeout(translateVisibleDOM, 90);
    });

    observer.observe(rootEl, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (mutationDebounce) clearTimeout(mutationDebounce);
      if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
    };
  }, [translateVisibleDOM]);

  return null;
};

