const ID_TYPE_LABELS: Record<string, string> = {
  aadhaar: 'Aadhaar',
  pan: 'PAN Card',
  passport: 'Passport',
  emirates_id: 'Emirates ID',
  national_id: 'National ID',
}

export function idTypeLabel(docKey: string): string {
  return ID_TYPE_LABELS[docKey] ?? docKey.toUpperCase()
}
