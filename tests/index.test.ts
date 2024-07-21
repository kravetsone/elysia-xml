import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { XMLBuilder } from "fast-xml-parser";
import { xml } from "../src";

describe("Tests", () => {
	it("Use accept header and serialize to xml", async () => {
		const app = new Elysia().use(xml()).get("/", () => ({ ok: true }));

		const response = await app.handle(
			new Request("http://localhost/", {
				headers: {
					accept: "text/xml",
				},
			}),
		);

		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("xml");
	});
	it("Use accept header and send xml-body and serialize to xml", async () => {
		const app = new Elysia()
			.use(xml())
			.post("/", ({ body }) => ({ data: body }));
		const builder = new XMLBuilder();

		const response = await app.handle(
			new Request("http://localhost/", {
				method: "POST",
				headers: {
					accept: "text/xml",
					"content-type": "text/xml",
				},
				body: builder.build({
					some: {
						nested: {
							example: "HII",
						},
					},
				}),
			}),
		);

		expect(response.status).toBe(200);
		expect(await response.text()).toBe(
			"<data><some><nested><example>HII</example></nested></some></data>",
		);
		expect(response.headers.get("content-type")).toContain("xml");
	});
	it("Use force", async () => {
		const app = new Elysia()
			.use(
				xml({
					force: true,
				}),
			)
			.post("/", ({ body }) => ({ data: body }));
		const builder = new XMLBuilder();

		const response = await app.handle(
			new Request("http://localhost/", {
				method: "POST",
				headers: {
					"content-type": "text/xml",
				},
				body: builder.build({
					some: {
						nested: {
							example: "HII",
						},
					},
				}),
			}),
		);

		expect(response.status).toBe(200);
		expect(await response.text()).toBe(
			"<data><some><nested><example>HII</example></nested></some></data>",
		);
		expect(response.headers.get("content-type")).toContain("xml");
	});
});
