import { assertEquals } from "@std/assert";
import { createFetchInterceptor } from "./main.ts";

Deno.test(async function addTest() {
  const interceptor = createFetchInterceptor({
    onRequest: async function (url, _opts) {
      console.log(url);
    },
  });

  const result = await interceptor("https://www.google.com", {
    method: "GET",
  });

  await result.text();

  assertEquals(result.status, 200);
});
