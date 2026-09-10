import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

const TONES = {
  neutral: { icon: 'info', color: 'var(--color-text-2)', rule: 'var(--color-divider)' },
  accent:  { icon: 'info', color: 'var(--color-accent-text)', rule: 'var(--color-accent)' },
  success: { icon: 'check-circle-2', color: 'var(--color-success-text)', rule: 'var(--color-success)' },
  warning: { icon: 'alert-triangle', color: 'var(--color-warning-text)', rule: 'var(--color-warning)' },
  danger:  { icon: 'alert-circle', color: 'var(--color-danger-text)', rule: 'var(--color-danger)' },
};

export function Toast({ tone = 'neutral', title, description, action, onDismiss, icon, width = 360, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', width, maxWidth: '100%', padding: '12px 12px 12px 14px', background: 'var(--color-surface-2)', boxShadow: 'var(--shadow-md)', borderTop: '2px solid ' + t.rule, borderRadius: 'var(--radius-md)', ...style }}>
      <Icon name={icon || t.icon} size={16} color={t.color} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>{title}</div>
        {description ? <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-2)', marginTop: 2, lineHeight: 1.4 }}>{description}</div> : null}
        {action ? <div style={{ marginTop: 'var(--space-2)' }}>{action}</div> : null}
      </div>
      {onDismiss ? <IconButton icon="x" label="Dismiss" size="sm" onClick={onDismiss} style={{ margin: '-4px -4px 0 0' }} /> : null}
    </div>
  );
}
