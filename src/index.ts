import { mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

export default function privateDirective(directiveName: string = 'private') {
  return {
    privateDirectiveTypeDefs: `directive @${directiveName} on OBJECT | FIELD_DEFINITION`,
    privateDirectiveTransform: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const typeDirective: any = getDirectives(schema, type)?.[0]
          if (typeDirective?.name === directiveName) {
            return null
          } else {
            return type
          }
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const fieldDirective: any = getDirectives(schema, fieldConfig)?.[0]
          if (fieldDirective?.name === directiveName) {
            return null
          } else {
            return fieldConfig
          }
        },
      }),
  }
}
