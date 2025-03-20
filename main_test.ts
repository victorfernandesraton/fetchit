import { assertEquals, assertThrows } from "@std/assert";
import { createFetchInterceptor } from "./main.ts";

const interceptor = createFetchInterceptor({
  onRequest: async function (url, _opts) {
    console.log(url);
  },
  fetch: fetch,
});

Deno.test(async function addTest() {
  const result = await interceptor("https://www.google.com", {
    method: "GET",
  });

  await result.text();

  assertEquals(result.status, 200);
});

Deno.test({
  name: "raiseStatus",
  async fn() {
    const response = await interceptor("https://vraton.dev/asdf");
    await response.body?.cancel();
    assertThrows(
      () => {
        response.raiseStatus();
      },
      Error,
      "Erro: Status 404 - Not Found",
    );
  },
});
