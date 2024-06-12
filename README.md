# elysia-xml

The library for [elysia](https://elysiajs.com) which allows you to work with `XML`

## Installation

```bash
bun install elysia-xml
```

## Usage

<!-- prettier-ignore -->
```ts
import Elysia from "elysia"
import { xml } from "elysia-xml"

new Elysia()
    .use(xml())
    .post("/", ({ body }) => {
        // body is object of parsed XML if content-type header the specified Content-Type


        // if accept header contains the specified Content-Type
        // this response will become a XML string with first content-type from array,
        // and if not, it will remain JSON
        return {
            some: "values",
            and: true,
            keys: 228,
        }
    })
    .listen(3000)
```

### Use `xml` decorator

You can also use the xml method to force xml to be returned.

```ts
new Elysia().use(xml()).post("/", ({ xml }) =>
    xml({
        some: "values",
        and: true,
        keys: 228,
    })
);
```

This method return [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)

#### Output

```xml
<some>values</some>
<and>true</and>
<keys>228</keys>
```

### Options

| Key                | Type                                                                                                            | Default                                                | Description                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| builder?           | [XmlBuilderOptions](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/3.XMLBuilder.md) |                                                        | Options to configure `XML` builder                                  |
| parser?            | [X2jOptions](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md)   |                                                        | Options to configure `XML` parser                                   |
| contentTypes?      | string[]                                                                                                        | ["text/xml", "application/xml", "application/rss+xml"] | An array of `content-types` that need to be serialized/deserialized |
| force?             | boolean                                                                                                         | false                                                  | Don't look at the `accept` header to serialize?                     |
| transformResponse? | (value: any) => any                                                                                             |                                                        | Handler to transform `response`                                     |
| as?                | [LifeCycleType](https://elysiajs.com/essential/scope.html#hook-type)                                            | "scoped"                                               | Option to specify `type` of hooks                                   |

### Thanks

-   [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser) - this library use it under the hood
