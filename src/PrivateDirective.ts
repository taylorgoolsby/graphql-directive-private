import { SchemaDirectiveVisitor } from 'graphql-tools'
import { GraphQLSchema, GraphQLDirective, DirectiveLocation } from 'graphql'

const namespace = 'graphql-directive-private'

export class PrivateDirective extends SchemaDirectiveVisitor {
  public static getDirectiveDeclaration(
    name: string,
    schema: GraphQLSchema
  ): GraphQLDirective {
    return new GraphQLDirective({
      name,
      locations: [DirectiveLocation.OBJECT, DirectiveLocation.FIELD_DEFINITION],
    })
  }

  public visitObject(object: any) {
    if (!object[namespace]) object[namespace] = {}
    object[namespace].isPrivate = true
  }

  public visitFieldDefinition(field: any) {
    if (!field[namespace]) field[namespace] = {}
    field[namespace].isPrivate = true
  }
}
