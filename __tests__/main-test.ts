import { validateSchema, introspectionFromSchema, execute } from 'graphql'
import { makeExecutableSchema, transformSchema } from 'graphql-tools'
import gql from 'graphql-tag'
import {
  PrivateDirective,
  privateTransform,
  privateDirectiveDeclaration,
} from '../src'

test('control', async () => {
  const typeDefs = `
    ${privateDirectiveDeclaration}

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

  let schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      private: PrivateDirective,
    },
    resolvers: {
      Query: {
        user: () => ({}),
        post: () => ({}),
      },
      User: {
        userId: () => 1,
        post: () => ({}),
      },
      Post: {
        postId: () => 1,
        user: () => ({}),
      },
    },
  })
  schema = transformSchema(schema, [privateTransform(schema)])

  const errors = validateSchema(schema)
  expect(errors.length).toBe(0)

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
  const result: any = await execute(schema, query)
  expect(result).toEqual({
    data: {
      post: { postId: 1, user: { userId: 1 } },
      user: { post: { postId: 1 }, userId: 1 },
    },
  })
  // console.log('intro', JSON.stringify(result))
})

test('private object', async () => {
  const typeDefs = `
    ${privateDirectiveDeclaration}

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

  let schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      private: PrivateDirective,
    },
    resolvers: {
      Query: {
        user: () => ({}),
        post: () => ({}),
      },
      User: {
        userId: () => 1,
        post: () => ({}),
      },
      Post: {
        postId: () => 1,
        user: () => ({}),
      },
    },
  })
  schema = transformSchema(schema, [privateTransform(schema)])

  const errors = validateSchema(schema)
  expect(errors.length).toBe(0)

  // const intro = introspectionFromSchema(schema)
  // console.log(JSON.stringify(intro))

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
  const result: any = await execute(schema, query)
  expect(result).toEqual({ data: { post: { postId: 1 } } })
  // console.log('intro', JSON.stringify(result))
})

test('private field', async () => {
  const typeDefs = `
    ${privateDirectiveDeclaration}

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

  let schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      private: PrivateDirective,
    },
    resolvers: {
      Query: {
        user: () => ({}),
        post: () => ({}),
      },
      User: {
        userId: () => 1,
        post: () => ({}),
      },
      Post: {
        postId: () => 1,
        user: () => ({}),
      },
    },
  })
  schema = transformSchema(schema, [privateTransform(schema)])

  const errors = validateSchema(schema)
  expect(errors.length).toBe(0)

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
  const result: any = await execute(schema, query)
  expect(result).toEqual({
    data: {
      post: { postId: 1, user: null },
      user: { post: { postId: 1 }, userId: null },
    },
  })
  // console.log('intro', JSON.stringify(result))
})

test('mixed', async () => {
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

  let schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      private: PrivateDirective,
    },
    resolvers: {
      Query: {
        user: () => ({}),
        post: () => ({}),
      },
      User: {
        userId: () => 1,
        post: () => ({}),
      },
      Post: {
        postId: () => 1,
        user: () => ({}),
      },
    },
  })
  schema = transformSchema(schema, [privateTransform(schema)])

  const errors = validateSchema(schema)
  expect(errors.length).toBe(0)

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
  const result: any = await execute(schema, query)
  expect(result).toEqual({ data: { post: { postId: null } } })
  // console.log('intro', JSON.stringify(result))
})
