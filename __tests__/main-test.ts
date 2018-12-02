import { validateSchema, introspectionFromSchema, execute } from 'graphql'
import { makeExecutableSchema, transformSchema } from 'graphql-tools'
import gql from 'graphql-tag'
import {
  PrivateDirective,
  privateTransform,
  privateDirectiveDeclaration,
} from '../src'

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

  const firstSchema: any = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      private: PrivateDirective,
    },
  })

  // schema = transformSchema(schema, [privateTransform(schema)])
  console.log('first schema', firstSchema._typeMap.User.customFlag) // true
  // console.log('first schema, field.customFlag', firstSchema._typeMap.User._fields.userId.customFlag)
  // console.log('first schema, field.isDeprecated', firstSchema._typeMap.User._fields.userId.isDeprecated)
  const thirdSchema: any = transformSchema(firstSchema, [
    {
      transformSchema: (secondSchema: any) => {
        console.log('second schema', secondSchema._typeMap.User.customFlag) // undefined
        // console.log('second schema, field.customFlag', secondSchema._typeMap.User._fields.userId.customFlag)
        // console.log('second schema, field.isDeprecated', secondSchema._typeMap.User._fields.userId.isDeprecated)
        return secondSchema
      },
    },
  ])
  console.log('third schema', thirdSchema._typeMap.User.customFlag) // undefined

  // output of console.log:
  /*
  console.log __tests__/main-test.ts:45
    first schema true

  console.log __tests__/main-test.ts:48
    second schema undefined

  console.log __tests__/main-test.ts:52
    third schema undefined

  The problem is that the firstSchema has customFlag,
  but the second and third schema don't.

  The expected result is that the secondSchema should have the customFlag.
  */
})
