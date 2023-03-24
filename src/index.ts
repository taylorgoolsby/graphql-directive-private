import { mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

export default function privateDirective(directiveName: string) {
  return {
    privateDirectiveTypeDefs: `directive @${directiveName} on OBJECT | FIELD_DEFINITION`,
    privateDirectiveTransform: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const typeDirectives: any = getDirectives(schema, type)?.[0]
          if (typeDirectives?.name === 'private') {
            return null
          } else {
            return type
          }
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const fieldDirectives: any = getDirectives(schema, fieldConfig)?.[0]
          if (fieldDirectives?.name === 'private') {
            return null
          } else {
            return fieldConfig
          }
        },
      }),
  }
}
