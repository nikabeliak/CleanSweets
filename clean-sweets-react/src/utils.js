import { useEffect } from 'react';

export function assetUrl(src) {
  if (!src) return '';
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return src;
  return `/${src}`;
}

export function headingLike(text) {
  if (!text) return false;
  if (text.endsWith(':') && text.length < 40) return true;
  return ['מתכון', 'מרכיבים', 'הוראות הכנה', 'הערות'].includes(text);
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Clean Sweets` : 'קינוחים בריאים | Clean Sweets';
    return () => {
      document.title = 'קינוחים בריאים | Clean Sweets';
    };
  }, [title]);
}
