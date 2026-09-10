import React from 'react';

let lowerIndex = null;
function lookup(name) {
  const lib = typeof window !== 'undefined' && window.lucide && window.lucide.icons;
  if (!lib || !name) return null;
  const pascal = String(name).split(/[-_ ]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  if (lib[pascal]) return lib[pascal];
  if (lib[name]) return lib[name];
  if (!lowerIndex) { lowerIndex = {}; Object.keys(lib).forEach(k => { lowerIndex[k.toLowerCase()] = lib[k]; }); }
  return lowerIndex[pascal.toLowerCase()] || null;
}

// Lucide ships two node shapes: [[tag, attrs], ...] (lucide-react) or ['svg', attrs, [[tag, attrs], ...]] (lucide UMD).
function children(node) {
  if (!node) return null;
  if (node[0] === 'svg' && Array.isArray(node[2])) return node[2];
  return node;
}

export function Icon({ name, size = 16, strokeWidth = 1.75, color = 'currentColor', title, style }) {
  const node = children(lookup(name));
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      data-icon={name}
      style={{ flex: 'none', display: 'block', ...style }}
    >
      {title ? <title>{title}</title> : null}
      {node
        ? node.map(([tag, attrs], i) => React.createElement(tag, { ...attrs, key: i }))
        : <rect x="4" y="4" width="16" height="16" strokeDasharray="2 2" />}
    </svg>
  );
}
