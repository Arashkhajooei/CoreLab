// The CoreLab metafield type system — the domain model behind every definition.

export type FieldTypeId =
  | 'single_line_text'
  | 'multi_line_text'
  | 'integer'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'date_time'
  | 'url'
  | 'json'
  | 'color'
  | 'rating'
  | 'money'
  | 'reference'

export interface Validation {
  min?: number
  max?: number
  step?: number
  minLength?: number
  maxLength?: number
  options?: string[] // allowed choices for single_line_text -> renders a dropdown
  regex?: string
  currency?: string // default currency for money
  ratingMax?: number // max stars for rating (default 5)
  referenceOwnerTypeId?: string // target owner type for reference
}

export interface FieldType {
  id: FieldTypeId
  label: string
  icon: string // lucide-react icon name
  description: string
  group: 'Text' | 'Number' | 'Date & time' | 'Choice' | 'Advanced'
  supportsList: boolean
  // which validation controls the definition editor should show
  validators: Array<keyof Validation>
}

export const FIELD_TYPES: FieldType[] = [
  {
    id: 'single_line_text',
    label: 'Single line text',
    icon: 'type',
    description: 'Short text, or a fixed set of choices',
    group: 'Text',
    supportsList: true,
    validators: ['minLength', 'maxLength', 'options', 'regex'],
  },
  {
    id: 'multi_line_text',
    label: 'Multi-line text',
    icon: 'align-left',
    description: 'Paragraphs of text',
    group: 'Text',
    supportsList: false,
    validators: ['minLength', 'maxLength'],
  },
  {
    id: 'url',
    label: 'URL',
    icon: 'link',
    description: 'A web address',
    group: 'Text',
    supportsList: true,
    validators: [],
  },
  {
    id: 'integer',
    label: 'Integer',
    icon: 'hash',
    description: 'Whole numbers',
    group: 'Number',
    supportsList: true,
    validators: ['min', 'max'],
  },
  {
    id: 'decimal',
    label: 'Decimal',
    icon: 'percent',
    description: 'Numbers with decimals',
    group: 'Number',
    supportsList: true,
    validators: ['min', 'max', 'step'],
  },
  {
    id: 'money',
    label: 'Money',
    icon: 'banknote',
    description: 'An amount with a currency',
    group: 'Number',
    supportsList: false,
    validators: ['currency', 'min', 'max'],
  },
  {
    id: 'rating',
    label: 'Rating',
    icon: 'star',
    description: 'A score out of a maximum',
    group: 'Number',
    supportsList: false,
    validators: ['ratingMax'],
  },
  {
    id: 'boolean',
    label: 'True / false',
    icon: 'toggle-left',
    description: 'A yes or no value',
    group: 'Choice',
    supportsList: false,
    validators: [],
  },
  {
    id: 'date',
    label: 'Date',
    icon: 'calendar',
    description: 'A calendar date',
    group: 'Date & time',
    supportsList: true,
    validators: [],
  },
  {
    id: 'date_time',
    label: 'Date and time',
    icon: 'clock',
    description: 'A date with a time',
    group: 'Date & time',
    supportsList: false,
    validators: [],
  },
  {
    id: 'color',
    label: 'Color',
    icon: 'palette',
    description: 'A hex color value',
    group: 'Advanced',
    supportsList: true,
    validators: [],
  },
  {
    id: 'json',
    label: 'JSON',
    icon: 'braces',
    description: 'Arbitrary structured data',
    group: 'Advanced',
    supportsList: false,
    validators: [],
  },
  {
    id: 'reference',
    label: 'Reference',
    icon: 'git-branch',
    description: 'A link to another record',
    group: 'Advanced',
    supportsList: true,
    validators: ['referenceOwnerTypeId'],
  },
]

export function fieldType(id: string): FieldType | undefined {
  return FIELD_TYPES.find((t) => t.id === id)
}

export const FIELD_TYPE_GROUPS = ['Text', 'Number', 'Choice', 'Date & time', 'Advanced'] as const

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateScalar(
  type: FieldTypeId,
  v: Validation,
  value: unknown,
): string | null {
  switch (type) {
    case 'single_line_text':
    case 'multi_line_text': {
      const s = String(value ?? '')
      if (v.minLength != null && s.length < v.minLength) return `Must be at least ${v.minLength} characters`
      if (v.maxLength != null && s.length > v.maxLength) return `Must be at most ${v.maxLength} characters`
      if (v.options?.length && !v.options.includes(s)) return `Must be one of: ${v.options.join(', ')}`
      if (v.regex) {
        try {
          if (!new RegExp(v.regex).test(s)) return 'Does not match the required format'
        } catch {
          /* invalid regex in definition — ignore at value time */
        }
      }
      return null
    }
    case 'url': {
      const s = String(value ?? '')
      try {
        new URL(s)
        return null
      } catch {
        return 'Must be a valid URL (include https://)'
      }
    }
    case 'integer':
    case 'decimal': {
      const n = Number(value)
      if (Number.isNaN(n)) return 'Must be a number'
      if (type === 'integer' && !Number.isInteger(n)) return 'Must be a whole number'
      if (v.min != null && n < v.min) return `Must be ≥ ${v.min}`
      if (v.max != null && n > v.max) return `Must be ≤ ${v.max}`
      return null
    }
    case 'rating': {
      const n = Number(value)
      const max = v.ratingMax ?? 5
      if (Number.isNaN(n) || n < 0 || n > max) return `Must be between 0 and ${max}`
      return null
    }
    case 'money': {
      const amt = (value as { amount?: unknown })?.amount
      const n = Number(amt)
      if (Number.isNaN(n)) return 'Amount must be a number'
      if (v.min != null && n < v.min) return `Amount must be ≥ ${v.min}`
      if (v.max != null && n > v.max) return `Amount must be ≤ ${v.max}`
      return null
    }
    case 'color': {
      const s = String(value ?? '')
      if (!/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(s)) return 'Must be a hex color like #3366ff'
      return null
    }
    case 'json': {
      if (typeof value === 'object') return null
      try {
        JSON.parse(String(value))
        return null
      } catch {
        return 'Must be valid JSON'
      }
    }
    case 'boolean':
    case 'date':
    case 'date_time':
    case 'reference':
      return null
    default:
      return null
  }
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') {
    const amt = (value as { amount?: unknown }).amount
    if (amt !== undefined) return amt === '' || amt == null
  }
  return false
}

export function validateValue(
  type: FieldTypeId,
  isList: boolean,
  required: boolean,
  validation: Validation,
  value: unknown,
): string | null {
  if (isEmpty(value)) {
    return required ? 'This field is required' : null
  }
  if (isList) {
    if (!Array.isArray(value)) return 'Must be a list'
    for (let i = 0; i < value.length; i++) {
      const err = validateScalar(type, validation, value[i])
      if (err) return `Item ${i + 1}: ${err}`
    }
    return null
  }
  return validateScalar(type, validation, value)
}

// Default empty value for an editor of the given type.
export function emptyValue(type: FieldTypeId, isList: boolean, v: Validation): unknown {
  if (isList) return []
  switch (type) {
    case 'boolean':
      return false
    case 'rating':
      return 0
    case 'money':
      return { amount: '', currency: v.currency || 'USD' }
    default:
      return ''
  }
}
