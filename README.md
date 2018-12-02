# graphql-tools-transform-bug

This branch is dedicated to demonstrating a working example of a bug with graphql-tools `transformSchema`. Please run `npm test` to reproduce the bug. Please see [main-test.ts](./__tests__/main-test.ts) to inspect the code which causes this bug.

### Explanation of bug:

This is a bug where `transformSchema` removes any properties added to `GraphQLObject` or `GraphQLFieldDefinition` instances during the execution of `visitObject` and `visitFieldDefinition`.

For example,

```
public visitObject(object: any) {
  if (!object[namespace]) object[namespace] = {}
  object.customFlag = true
}

public visitFieldDefinition(field: any) {
  if (!field[namespace]) field[namespace] = {}
  field.customFlag = true
}
```

The visitors above will add a property called `customFlag` to any object or field visited.

The schema object returned from `makeExecutableSchema` will have this `customFlag` property. However, when calling `transformSchema(schema, transforms)`, the transforms will recieve a schema object which does not have the `customFlag` property.

My current work around is to pass the schema with the custom properties directly to the transforms like so: `transformSchema(originalSchema, [myTransform(originalSchema)])`.

Here is an exception: if a visitor sets `isDeprecated` on a field definition, it will not be lost during the call to `transformSchema`.

Just like we are able to set `field.isDeprecated` during visiting, and then use that flag to do something to the schema during transforming, I would like to be able to set my own flags.