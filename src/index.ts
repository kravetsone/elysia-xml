import { Elysia } from "elysia";
import type { LifeCycleType } from "elysia/types";
import {
	type X2jOptions,
	XMLBuilder,
	XMLParser,
	type XmlBuilderOptions,
} from "fast-xml-parser";

/** Interface of XML plugin options */
export interface XMLOptions<Type extends LifeCycleType = "scoped"> {
	/** Options to configure `XML` builder
	 *
	 * [XmlBuilderOptions](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/3.XMLBuilder.md) */
	builder?: XmlBuilderOptions;
	/** Options to configure `XML` parser
	 *
	 * [X2jOptions](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md)  */
	parser?: X2jOptions;
	/** An array of `content-types` that need to be serialized/deserialized
	 *
	 * @default
	 * ["text/xml", "application/xml", "application/rss+xml"]
	 */
	contentTypes?: string[];
	/** Option to specify `type` of hooks
	 *
	 * [LifeCycleType](https://elysiajs.com/essential/scope.html#hook-type)
	 */
	as?: Type;
	/** Don't look at the `accept` header to serialize?
	 *
	 * @default false
	 */
	force?: boolean;
	/** Handler to transform `response` */
	transformResponse?: (value: any) => any;
}

// TODO: add XMLValidator and errors
/** The library for elysia which allows you to work with XM */
export function xml<Type extends LifeCycleType>(
	options: XMLOptions<Type> = {},
) {
	const builder = new XMLBuilder(options.builder);
	const parser = new XMLParser(options.parser);

	const contentTypes = options.contentTypes ?? [
		"text/xml",
		"application/xml",
		"application/rss+xml",
	];
	const as = (options.as ?? "scoped") as Type;

	return new Elysia({
		name: "elysia-msgpack",
		seed: options,
	})
		.onParse({ as }, async ({ request, contentType }) => {
			if (contentTypes.includes(contentType))
				return parser.parse(await request.text());
		})
		.decorate("xml", (value: any) => {
			const response = options.transformResponse
				? options.transformResponse(value)
				: value;

			return new Response(builder.build(response), {
				headers: {
					"content-type": contentTypes.at(0) || "",
				},
			});
		})
		.mapResponse({ as }, ({ headers, response: rawResponse, xml }) => {
			if (
				(options.force ||
					contentTypes.some((x) => headers?.accept?.includes(x))) &&
				rawResponse
			)
				return xml(rawResponse);
		});
}
