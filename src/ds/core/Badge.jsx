import React from 'react';

const TONES = {
  neutral: { text: 'var(--color-text-2)', tint: 'var(--color-hover)', solid: 'var(--color-neutral-400)', dot: 'var(--color-text-3)' },
  accent:  { text: 'var(--color-accent-text)', tint: 'var(--color-accent-tint)', solid: 'var(--color-accent)', dot: 'var(--color-accent)' },
  success: { text: 'var(--color-success-text)', tint: 'var(--color-success-tint)', solid: 'var(--color-success)', dot: 'var(--color-success)' },
  warning: { text: 'var(--color-warning-text)', tint: 'var(--color-warning-tint)', solid: 'var(--color-warning)', dot: 'var(--color-warning)' },
  danger:  { text: 'var(--color-danger-text)', tint: 'var(--color-danger-tint)', solid: 'var(--color-danger)', dot: 'var(--color-danger)' },
};

export function Badge({ tone = 'neutral', variant = 'tint', dot = false, size = 'md', children, style }) {
  const t = TONES[tone] || TONES.neutral;
  const solid = variant === 'solid';
  const outline = variant === 'outline';
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, flex: 'none',
        height: size === 'sm' ? 18 : 22,
        padding: dot ? '0 8px 0 7px' : '0 8px',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: 1,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        color: solid ? 'var(--color-on-status)' : t.text,
        background: solid ? t.solid : outline ? 'transparent' : t.tint,
        border: outline ? '1px solid ' + t.text : '1px solid transparent',
        borderRadius: 'var(--radius-sm)',
        ...style,
      }}
    >
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: solid ? 'var(--color-on-status)' : t.dot }} /> : null}
      {children}
    </span>
  );
}
