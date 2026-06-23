const CACHE_TTL_BINANCE = 5 * 60;  // 5 minutes
const CACHE_TTL_BCB     = 60 * 60; // 1 hour

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '*';

    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const cache = caches.default;

    // ── Route: /binance ──────────────────────────────────────────────────────
    if (url.pathname === '/binance') {
      const body = await request.text();
      const cacheKey = new Request(
        'https://cache.dolar-bo/binance/' + btoa(body),
        { method: 'GET' }
      );

      const cached = await cache.match(cacheKey);
      if (cached) {
        const text = await cached.text();
        return new Response(text, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
        });
      }

      const res = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json();
      const responseBody = JSON.stringify(data);

      await cache.put(cacheKey, new Response(responseBody, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=' + CACHE_TTL_BINANCE,
        },
      }));

      return new Response(responseBody, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
      });
    }

    // ── Route: /bcb ──────────────────────────────────────────────────────────
    if (url.pathname === '/bcb') {
      const cacheKey = new Request('https://cache.dolar-bo/bcb', { method: 'GET' });

      const cached = await cache.match(cacheKey);
      if (cached) {
        const text = await cached.text();
        return new Response(text, {
          headers: { ...corsHeaders, 'Content-Type': 'text/html', 'X-Cache': 'HIT' },
        });
      }

      // No User-Agent — this is a server-to-server request, no need to mimic a browser.
      // If BCB blocks it, replace with: 'User-Agent': 'dolar-bo-bot/2.0 (github.com/mirkomg/dolar-bo)'
      const res = await fetch('https://www.bcb.gob.bo/', {
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'es-BO,es;q=0.9',
        },
      });
      const html = await res.text();

      await cache.put(cacheKey, new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=' + CACHE_TTL_BCB,
        },
      }));

      return new Response(html, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html', 'X-Cache': 'MISS' },
      });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
