import React from 'react';

const SIZES = { xs: 20, sm: 24, md: 28, lg: 36 };

function initials(name) {
  return String(name || '').trim().split(/\s+/).slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('');
}

export function Avatar({ name, size = 'md', src, tone = 'neutral', style }) {
  const px = SIZES[size] || SIZES.md;
  const accent = tone === 'accent';
  return (
    <span
      title={name}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        width: px, height: px, borderRadius: 'var(--radius-full)', overflow: 'hidden',
        background: accent ? 'var(--color-accent-tint-strong)' : 'var(--color-surface-3)',
        color: accent ? 'var(--color-accent-text)' : 'var(--color-text)',
        fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-semibold)',
        fontSize: Math.round(px * 0.38), letterSpacing: '0.02em', lineHeight: 1,
        boxShadow: '0 0 0 1px var(--color-hairline)',
        ...style,
      }}
    >
      {src ? <img src={src} alt={name} className="grayscale" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(name)}
    </span>
  );
}
