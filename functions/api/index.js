export async function onRequest(context) {
  const {
    request, // 与现有 Worker API 中的 request 相同
    env, // 与现有 Worker API 中的 env 相同
    params, // 如果文件名包含 [id] 或 [[path]]，则与现有 Worker API 中的 params 相同
    waitUntil, // 与现有 Worker API 中的 ctx.waitUntil 相同
    next, // 用于中间件或获取资源
    data, // 在中间件之间传递数据的任意空间
  } = context;
  const countryCode = request.cf.country;

  // if (countryCode === 'IR' || countryCode === 'RU' || countryCode === 'ID') { // Add more country codes as needed
  //   return new Response('Access denied', { status: 403 });
  // }
  // const newResponse = request.clone();
  const url = new URL(request.url);
  // const { searchParams } = new URL(request.url);
  // const headers_Origin = request.headers.get("Access-Control-Allow-Origin") || "*"
  const modifiedRequest = new Request('https://cfport-1-n2942152.deta.app/check' + url.search, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  let body;
  const response = await fetch(modifiedRequest);
  // if (searchParams.get('format') === 'base64') {
  //   body = btoa(await response.text());
  // } else {
  body = response.body;
  // }
  const modifiedResponse = new Response(body, response);
  // modifiedResponse.headers.set('Access-Control-Allow-Origin', headers_Origin);

  return modifiedResponse;
}
