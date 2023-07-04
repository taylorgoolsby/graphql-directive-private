import { mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

export default function privateDirective(directiveName: string = 'private') {
  return {
    privateDirectiveTypeDefs: `directive @${directiveName} on OBJECT | FIELD_DEFINITION`,
    privateDirectiveTransform: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const directives = getDirectives(schema, type)
          const directive = directives?.find((d) => d.name === directiveName)

          if (directive) {
            return null
          } else {
            return type
          }
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const directives = getDirectives(schema, fieldConfig)
          const directive = directives?.find((d) => d.name === directiveName)

          if (directive) {
            return null
          } else {
            return fieldConfig
          }
        },
      }),
  }
}
