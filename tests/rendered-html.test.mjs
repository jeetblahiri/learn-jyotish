import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Drishti learning workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Drishti — Jyotish, made visible<\/title>/i);
  assert.match(html, /Jyotish reasoning laboratory/);
  assert.match(html, /Learn the generative grammar/);
  assert.match(html, /What a chart represents/);
  assert.match(html, /Astronomical fact/);
  assert.match(html, /Traditional rule/);
  assert.match(html, /Interpretive hypothesis/);
});

test("renders an accessible birth form and workspace navigation", async () => {
  const html = await (await render()).text();
  assert.match(html, /aria-label="Drishti workspaces"/);
  assert.match(html, /Skip to learning workspace/);
  assert.match(html, /type="date"/);
  assert.match(html, /type="time"/);
  assert.match(html, /role="combobox"/);
  assert.match(html, /Time reliability/);
  assert.match(html, /Birth data remains local/);
});
