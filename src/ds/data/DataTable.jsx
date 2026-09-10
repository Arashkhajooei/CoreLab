import React, { useState } from 'react';
import { Checkbox } from '../forms/Checkbox.jsx';

export function DataTable({ columns = [], rows = [], rowKey = 'id', selectable = false, selected = [], onSelect, onRowClick, activeKey, dense = false, stickyHeader = false, maxHeight, emptyText = 'No records', style }) {
  const [hoverRow, setHoverRow] = useState(null);
  const h = dense ? 'var(--row-h-dense)' : 'var(--row-h)';
  const ids = rows.map(r => r[rowKey]);
  const allSelected = rows.length > 0 && ids.every(id => selected.includes(id));
  const someSelected = ids.some(id => selected.includes(id));
  const toggleAll = () => onSelect && onSelect(allSelected ? [] : ids);
  const toggle = (id) => onSelect && onSelect(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  const th = {
    height: 36, padding: '0 var(--cell-px)', textAlign: 'left', whiteSpace: 'nowrap', verticalAlign: 'middle',
    fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--color-text-2)',
    borderBottom: '2px solid var(--color-divider)', background: 'var(--color-surface)',
    position: stickyHeader ? 'sticky' : undefined, top: stickyHeader ? 0 : undefined, zIndex: stickyHeader ? 1 : undefined,
  };
  const td = { height: h, padding: '0 var(--cell-px)', borderBottom: '1px solid var(--color-hairline)', verticalAlign: 'middle', whiteSpace: 'nowrap', fontSize: 'var(--text-sm)' };
  const span = columns.length + (selectable ? 1 : 0);
  return (
    <div style={{ overflow: 'auto', maxHeight, minWidth: 0, ...style }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {selectable ? <th style={{ ...th, width: 40, paddingRight: 0 }}><Checkbox checked={allSelected} indeterminate={someSelected && !allSelected} onChange={toggleAll} /></th> : null}
            {columns.map(c => <th key={c.key} style={{ ...th, textAlign: c.align || 'left', width: c.width }}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={span} style={{ ...td, height: 'auto', padding: '24px var(--cell-px)', textAlign: 'center', color: 'var(--color-text-3)', whiteSpace: 'normal' }}>{emptyText}</td></tr>
          ) : rows.map(r => {
            const id = r[rowKey];
            const isSel = selected.includes(id) || activeKey === id;
            return (
              <tr
                key={id}
                onClick={() => onRowClick && onRowClick(r)}
                onMouseEnter={() => setHoverRow(id)}
                onMouseLeave={() => setHoverRow(null)}
                style={{ background: isSel ? 'var(--color-selected)' : hoverRow === id ? 'var(--color-hover)' : 'transparent', cursor: onRowClick ? 'pointer' : 'default', transition: 'background var(--duration-fast) var(--ease-standard)' }}
              >
                {selectable ? <td style={{ ...td, width: 40, paddingRight: 0 }} onClick={(e) => e.stopPropagation()}><Checkbox checked={selected.includes(id)} onChange={() => toggle(id)} /></td> : null}
                {columns.map(c => (
                  <td key={c.key} style={{ ...td, textAlign: c.align || 'left', whiteSpace: c.wrap ? 'normal' : 'nowrap', maxWidth: c.ellipsis ? (c.width || 240) : undefined, overflow: c.ellipsis ? 'hidden' : undefined, textOverflow: c.ellipsis ? 'ellipsis' : undefined, fontFamily: c.mono ? 'var(--font-mono)' : undefined, fontFeatureSettings: c.mono || c.numeric ? 'var(--font-numeric)' : undefined, color: c.muted ? 'var(--color-text-2)' : undefined, fontWeight: c.strong ? 'var(--font-weight-medium)' : undefined }}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
