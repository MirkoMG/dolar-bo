const CACHE_TTL_BINANCE = 5 * 60; // 5 minutes
const CACHE_TTL_BCB = 60 * 60; // 1 hour

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin") || "*";

  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const cache = await caches.open("dolar-bo");

  // ── /binance ──────────────────────────────────────────────────────────────
  if (url.pathname === "/binance") {
    const body = await req.text();

    // Build stable cache key from request body
    const cacheKey = new Request(
      "https://cache.dolar-bo/binance/" + btoa(body),
      { method: "GET" },
    );

    const cached = await cache.match(cacheKey);
    if (cached) {
      const text = await cached.text();
      return new Response(text, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Cache": "HIT",
        },
      });
    }

    const res = await fetch(
      "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": "es-BO,es;q=0.9",
          Origin: "https://p2p.binance.com",
          Referer: "https://p2p.binance.com/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        body,
      },
    );

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Binance blocked", status: res.status }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await res.json();
    const responseBody = JSON.stringify(data);

    await cache.put(
      cacheKey,
      new Response(responseBody, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=" + CACHE_TTL_BINANCE,
        },
      }),
    );

    return new Response(responseBody, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Cache": "MISS",
      },
    });
  }

  // ── /bcb ──────────────────────────────────────────────────────────────────
  if (url.pathname === "/bcb") {
    const cacheKey = new Request("https://cache.dolar-bo/bcb", {
      method: "GET",
    });

    const cached = await cache.match(cacheKey);
    if (cached) {
      const text = await cached.text();
      return new Response(text, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html",
          "X-Cache": "HIT",
        },
      });
    }

    const res = await fetch("https://www.bcb.gob.bo/", {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-BO,es;q=0.9",
      },
    });
    const html = await res.text();

    await cache.put(
      cacheKey,
      new Response(html, {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "max-age=" + CACHE_TTL_BCB,
        },
      }),
    );

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html",
        "X-Cache": "MISS",
      },
    });
  }

  // ── /health ───────────────────────────────────────────────────────────────
  if (url.pathname === "/health") {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response("Not found", { status: 404, headers: corsHeaders });
});
