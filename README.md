# graphql-directive-private

Fields and Objects marked with @private will be removed from the schema. They will not appear in introspection and they will not be queryable.

## Example

```js
import privateDirective from 'graphql-directive-private'

const { privateDirectiveTransform } = privateDirective('private')

const typeDefs = `
  directive @private on OBJECT | FIELD_DEFINITION

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

let schema = makeExecutableSchema({
  typeDefs
})

schema = privateDirectiveTransform(schema)

const query = `
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