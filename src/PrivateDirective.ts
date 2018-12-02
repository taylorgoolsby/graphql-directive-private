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
    object.customFlag = true
    object.isDeprecated = true
    object.deprecationReason = 'just because'
  }

  public visitFieldDefinition(field: any) {
    field.customFlag = true
    field.isDeprecated = true
    field.deprecationReason = 'just because'
  }
}
