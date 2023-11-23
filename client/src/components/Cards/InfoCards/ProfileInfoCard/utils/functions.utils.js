export const formatUserEntryData = info => Object.fromEntries(Object.entries(info).map(([key, value]) => {
  if (typeof value !== 'object') return [key, { value }]

  const serializedObject = Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, { value: childValue }]))
  return [key, { value: serializedObject }]

}))

export const formatUserSubmitData = info => Object.fromEntries(Object.entries(info).map(([key, { value }]) => {
  if (typeof value !== 'object') return [key, value]

  const deserializedObject = Object.fromEntries(Object.entries(value).map(([childKey, { value }]) => {
    return [childKey, value]
  }))
  return [key, deserializedObject]
}))