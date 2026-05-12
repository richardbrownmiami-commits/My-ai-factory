import type { ActionFunctionArgs } from '@remix-run/cloudflare';

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const targetPath = url.pathname.replace('/api/puter-proxy', '');
  const targetUrl = `https://api.puter.com/openai${targetPath}${url.search}`;

  const body = await request.text();
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  // Forward auth if present
  const authHeader = request.headers.get('Authorization');
  if (authHeader) headers.set('Authorization', authHeader);

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: body || undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
  });
}
