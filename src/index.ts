import { mapSchema, getDirectives, MapperKind } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'

export default function privateDirective(directiveName: string) {
  return {
    privateDirectiveTypeDefs: `directive @${directiveName} on OBJECT | FIELD_DEFINITION`,
    privateDirectiveTransform: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const typeDirectives = getDirectives(schema, type)
          if (typeDirectives.private) {
            return null
          } else {
            return type
          }
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const fieldDirectives = getDirectives(schema, fieldConfig)
          if (fieldDirectives.private) {
            return null
          } else {
            return fieldConfig
          }
        },
      }),
  }
}
