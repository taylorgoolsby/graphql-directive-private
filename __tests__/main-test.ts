import { makeExecutableSchema, printSchemaWithDirectives } from 'graphql-tools'
import privateDirective from '../src'

const {
  privateDirectiveTypeDefs,
  privateDirectiveTransform,
} = privateDirective('private')

test('control', async () => {
  const typeDefs = `
    type User {
      userId: Int
      post: Post
    }

    type Post {
      postId: Int
      user: User
    }

    type Query {
      user: User
      post: Post
    }
  `
  const expected = `schema {
  query: Query
}
type User {
  userId: Int
  post: Post
}
type Post {
  postId: Int
  user: User
}
type Query {
  user: User
  post: Post
}
directive @private on OBJECT | FIELD_DEFINITION`
  runTest(typeDefs, expected)
})

test('private object', async () => {
  const typeDefs = `
    type User @private {
      userId: Int
      post: Post
    }
    type Post {
      postId: Int
      user: User
    }
    type Query {
      user: User
      post: Post
    }
  `
  const expected = `schema {
  query: Query
}
type Post {
  postId: Int
}
type Query {
  post: Post
}
directive @private on OBJECT | FIELD_DEFINITION`
  runTest(typeDefs, expected)
})

test('private field', async () => {
  const typeDefs = `
    type User {
      userId: Int @private
      post: Post
    }

    type Post {
      postId: Int
      user: User
    }

    type Query {
      user: User
      post: Post
    }
  `
  const expected = `schema {
  query: Query
}
type User {
  post: Post
}
type Post {
  postId: Int
  user: User
}
type Query {
  user: User
  post: Post
}
directive @private on OBJECT | FIELD_DEFINITION`
  runTest(typeDefs, expected)
})

function runTest(typeDefs: string, expected: string) {
  let schema = makeExecutableSchema({
    typeDefs: [privateDirectiveTypeDefs, typeDefs],
  })
  schema = privateDirectiveTransform(schema)
  const answer = printSchemaWithDirectives(schema)

  if (answer !== expected) {
    console.log(answer)
  }

  expect(answer).toEqual(expected)
}
