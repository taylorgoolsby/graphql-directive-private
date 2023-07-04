import test from 'boxtape'
import {makeExecutableSchema} from '@graphql-tools/schema'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import privateDirective from '../lib/index.js'

const {
  privateDirectiveTypeDefs,
  privateDirectiveTransform,
} = privateDirective('private')

test('control', async (t) => {
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

directive @private on OBJECT | FIELD_DEFINITION

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
  runTest(t, typeDefs, expected)
})

test('private object', async (t) => {
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

directive @private on OBJECT | FIELD_DEFINITION

type Post {
  postId: Int
}

type Query {
  post: Post
}
`
  runTest(t, typeDefs, expected)
})

test('private field', async (t) => {
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

directive @private on OBJECT | FIELD_DEFINITION

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
`
  runTest(t, typeDefs, expected)
})

function runTest(t, typeDefs, expected) {
  let schema = makeExecutableSchema({
    typeDefs: [privateDirectiveTypeDefs, typeDefs],
  })
  schema = privateDirectiveTransform(schema)
  const answer = printSchemaWithDirectives(schema)

  if (answer !== expected) {
    console.log(answer)
  }

  t.equal(answer, expected)
}
