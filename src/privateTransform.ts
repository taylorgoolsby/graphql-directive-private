import { Transform } from 'graphql-tools'
import {
  visitSchema,
  VisitSchemaKind,
} from 'graphql-tools/dist/transforms/visitSchema'
import { GraphQLNamedType, GraphQLSchema } from 'graphql'

const namespace = 'graphql-directive-private'

export class FilterOrTransformTypes implements Transform {
  private filter: (type: any) => GraphQLNamedType | null

  constructor(filter: (type: any) => GraphQLNamedType | null) {
    this.filter = filter
  }

  public transformSchema(schema: GraphQLSchema): GraphQLSchema {
    return visitSchema(schema, {
      // @ts-ignore
      [VisitSchemaKind.TYPE]: type => {
        const newType = this.filter(type)
        return newType
      },
    })
  }
}

export function privateTransform(schema: any): Transform {
  return new FilterOrTransformTypes((type: any) => {
    const spicyType = schema.getType(type.toString())
    if (spicyType[namespace] && spicyType[namespace].isPrivate) {
      return null
    }

    const fields = spicyType._fields
    if (!fields) {
      return type
    }

    for (const key in fields) {
      // fields does not have a hasOwnProperty method.
      // but ts requires an if statement
      if (!fields[key]) continue

      const f = fields[key]
      if (f[namespace] && f[namespace].isPrivate) {
        delete fields[key]
      }
    }

    return type
  })
}
