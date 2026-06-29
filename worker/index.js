const CACHE_TTL_BINANCE = 5 * 60;
const CACHE_TTL_BCB = 60 * 60;

const kv = await Deno.openKv();

function buildCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// ── KV cache helpers (for POST /binance) ─────────────────────────────────────

async function kvGet(key) {
  const result = await kv.get(["cache", key]);
  if (!result.value) return null;
  if (result.value.expires < Date.now()) {
    await kv.delete(["cache", key]);
    return null;
  }
  return result.value.data;
}

async function kvSet(key, data, ttlSeconds) {
  await kv.set(["cache", key], {
    data,
    expires: Date.now() + ttlSeconds * 1000,
  });
}

// ── /binance — POST, uses KV cache ───────────────────────────────────────────

async function handleBinance(req, corsHeaders) {
  const body = await req.text();
  const cacheKey = "binance-" + btoa(body);

  const cached = await kvGet(cacheKey);
  if (cached) {
    return new Response(cached, {
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

  await kvSet(cacheKey, responseBody, CACHE_TTL_BINANCE);

  return new Response(responseBody, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "X-Cache": "MISS",
    },
  });
}

// ── /bcb — GET, uses Deno CDN cache via Cache-Control headers ─────────────────

async function handleBCB(corsHeaders) {
  const res = await fetch("https://www.bcb.gob.bo/", {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "es-BO,es;q=0.9",
    },
  });
  const html = await res.text();

  // Deno's CDN caches this GET response automatically via s-maxage
  return new Response(html, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/html",
      "Cache-Control": "public, s-maxage=" + CACHE_TTL_BCB,
    },
  });
}

// ── /health ───────────────────────────────────────────────────────────────────

function handleHealth(corsHeaders) {
  return new Response(
    JSON.stringify({ status: "ok", ts: new Date().toISOString() }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin") || "*";
  const corsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);

  if (url.pathname === "/binance") return handleBinance(req, corsHeaders);
  if (url.pathname === "/bcb") return handleBCB(corsHeaders);
  if (url.pathname === "/health") return handleHealth(corsHeaders);

  return new Response("Not found", { status: 404, headers: corsHeaders });
});
