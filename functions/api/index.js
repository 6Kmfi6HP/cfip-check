export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const modifiedRequest = new Request('https://p01--boiling-frame--kw6dd7bjv2nr.code.run/check' + url.search, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  const response = await fetch(modifiedRequest);
  const modifiedResponse = new Response(response.body, response);

  return modifiedResponse;
}
