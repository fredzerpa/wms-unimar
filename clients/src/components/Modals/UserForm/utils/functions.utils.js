export const formatPrivilegesToMongoSchema = privileges => Object.fromEntries(Object.entries(privileges).map(([privilege, { access }]) => {
  const accessTypesAndValue = Object.fromEntries(Object.entries(access).map(([accessKey, { value }]) => [accessKey, value]))
  return [privilege, accessTypesAndValue];
}))

export const formatPrivilegesToModalSchema = privileges => Object.fromEntries(Object.entries(privileges).map(([privilege, accesses]) => {
  const accessTypesAndValue = Object.fromEntries(Object.entries(accesses).map(([accessKey, value]) => [accessKey, { value }]))
  return [privilege, { access: accessTypesAndValue }]
}))