import { Elysia } from "elysia";
import type { LifeCycleType } from "elysia/types";
import {
	type X2jOptions,
	XMLBuilder,
	XMLParser,
	type XmlBuilderOptions,
} from "fast-xml-parser";

export interface XMLOptions<Type extends LifeCycleType = "scoped"> {
	builder?: XmlBuilderOptions;
	parser?: X2jOptions;
	contentTypes?: string[];
	as?: Type;
	force?: boolean;
	transformResponse?: (value: any) => any;
}

// TODO: add XMLValidator and errors

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
