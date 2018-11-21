// export * from './applyPrivateTransform'
export * from './PrivateDirective'
export * from './privateTransform'
export function customDirectiveDeclaration(
  customDirectiveName: string
): string {
  return `directive @${customDirectiveName} on OBJECT | FIELD_DEFINITION`
}
export const privateDirectiveDeclaration = customDirectiveDeclaration('private')
