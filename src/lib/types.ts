import type { FieldTypeId, Validation } from './fieldTypes'

export interface OwnerType {
  id: string
  key: string
  label: string
  icon: string
  description: string | null
  created_at: string
}

export interface RecordRow {
  id: string
  owner_type_id: string
  title: string
  external_ref: string | null
  created_at: string
}

export interface MetafieldDefinition {
  id: string
  owner_type_id: string
  namespace: string
  key: string
  name: string
  description: string | null
  type: FieldTypeId
  is_list: boolean
  required: boolean
  validation: Validation
  created_at: string
  updated_at: string
}

export interface MetafieldValue {
  id: string
  definition_id: string
  record_id: string
  value: unknown
  created_at: string
  updated_at: string
}

export interface ValueWithDefinition extends MetafieldDefinition {
  value_id: string | null
  value: unknown
}
