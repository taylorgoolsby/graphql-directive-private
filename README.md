# graphql-directive-private

Fields and Objects marked with @private will be removed from the schema. They will not appear in introspection and they will not be queryable.

## Example

```
import { PrivateDirective, privateTransform, privateDirectiveDeclaration } from 'graphql-directive-private'
const typeDefs = `
    ${privateDirectiveDeclaration}

    type User @private {
      userId: Int
      post: Post
    }

    type Post {
      postId: Int @private
      user: User
    }

    type Query {
      user: User
      post: Post
    }
  `

const publicSchema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    private: PrivateDirective
  },
})
const privateSchema = transformSchema(publicSchema, [privateTransform(publicSchema)])

const query = gql`
  query {
    user {
      userId
      post {
        postId
      }
    }
    post {
      postId
      user {
        userId
      }
    }
  }
`
const response = await execute(schema, query)
// response == { data: { post: { postId: null } } }
```