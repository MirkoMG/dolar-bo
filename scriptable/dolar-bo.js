/************************************************************************************
 * Dolar Bolivia P2P Prices Widget V2.0 - by @mirkomg
 *
 * A Scriptable iOS widget that fetches real-time USDT/BOB exchange rates
 * from Binance P2P for multiple payment methods and BCB official rates.
 * Displays buy/sell prices in a compact horizontal layout
 * with color-coded pricing indicators.
 ************************************************************************************/

// ── Configuration ────────────────────────────────────────────────────────────

const CONFIG = {
  font: "Menlo",
  amount: 1000,
  rows: 5,
  refresh: 5 * 60 * 1000,
  asset: "USDT",
  fiat: "BOB",
};

const BANKS = [
  { id: "BancoDeBolivia", label: "BNB" },
  { id: "BancoUnion", label: "Union" },
  { id: "BancoGanadero", label: "Ganadero" },
  { id: "BancoSantaCruz", label: "Mercantil" },
  { id: "BancoDeCredito", label: "BCP" },
  // { id: 'TigoMoney',       label: 'Tigo'     },
  // { id: 'BancoEconomico',  label: 'Economico'},
  // { id: 'BancoFassil',     label: 'Fassil'    },
  // { id: 'BancoSolidario',  label: 'Solidario' },
  // { id: 'BancoFIE',        label: 'FIE'       },
  // { id: 'SoliPagos',       label: 'SoliPagos' },
];

const C = {
  bg0: "#0D1B2A",
  bg1: "#1B2838",
  accent: "#F59E0B",
  buy: "#34D399",
  sell: "#F87171",
  spread: "#FCD34D",
  offers: "#93C5FD",
  white: "#F1F5F9",
  dim: "#475569",
  divider: "#1E3A5F",
  bcb: "#C084FC",
};

const COL = {
  bank: 68,
  buy: 48,
  sell: 48,
  spread: 72,
  offers: 28,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function color(hex) {
  return new Color(hex);
}
function font(size) {
  return new Font(CONFIG.font, size);
}

function addText(parent, text, size, hex, align) {
  const t = parent.addText(text);
  t.font = font(size);
  t.textColor = color(hex);
  if (align === "right") t.rightAlignText();
  if (align === "center") t.centerAlignText();
  return t;
}

function addCell(parent, width, text, size, hex, align) {
  const cell = parent.addStack();
  cell.size = new Size(width, 0);
  addText(cell, text, size, hex, align);
}

// ── BCB Fetch ────────────────────────────────────────────────────────────────

async function fetchBCB() {
  try {
    const req = new Request("https://api.factura.bo/ExchangeRate");
    const json = await req.loadJSON();

    if (!json.ok || !json.datos) return { officialRate: null };

    return { officialRate: json.datos.usd_bob };
  } catch (e) {
    return { officialRate: null };
  }
}

// ── Binance P2P Fetch ────────────────────────────────────────────────────────

function buildRequest(payType, tradeType) {
  const req = new Request(
    "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
  );
  req.method = "POST";
  req.headers = { "Content-Type": "application/json" };
  req.body = JSON.stringify({
    proMerchantAds: false,
    page: 1,
    rows: CONFIG.rows,
    transAmount: CONFIG.amount,
    payTypes: [payType],
    asset: CONFIG.asset,
    fiat: CONFIG.fiat,
    tradeType,
  });
  return req;
}

function averagePrice(json) {
  if (!json || !json.data || json.data.length === 0)
    return { avg: null, count: 0 };
  const prices = [];
  for (var i = 0; i < json.data.length; i++) {
    const p = json.data[i] && json.data[i].adv && json.data[i].adv.price;
    if (p) prices.push(parseFloat(p));
  }
  if (prices.length === 0) return { avg: null, count: 0 };
  var sum = 0;
  for (var j = 0; j < prices.length; j++) {
    sum += prices[j];
  }
  return { avg: sum / prices.length, count: prices.length };
}

async function fetchAllPrices() {
  const promises = BANKS.map(function (bank) {
    return Promise.all([
      buildRequest(bank.id, "BUY")
        .loadJSON()
        .catch(function () {
          return null;
        }),
      buildRequest(bank.id, "SELL")
        .loadJSON()
        .catch(function () {
          return null;
        }),
    ]);
  });
  const responses = await Promise.all(promises);
  return BANKS.map(function (bank, i) {
    const buyResult = averagePrice(responses[i][0]);
    const sellResult = averagePrice(responses[i][1]);
    const buy = buyResult.avg;
    const sell = sellResult.avg;
    const spread = buy && sell ? sell - buy : null;
    const pct = buy && sell ? (spread / buy) * 100 : null;
    const offers = Math.min(buyResult.count, sellResult.count);
    return {
      label: bank.label,
      buy: buy,
      sell: sell,
      spread: spread,
      pct: pct,
      offers: offers,
    };
  });
}

// ── Widget Layout ────────────────────────────────────────────────────────────

function createWidget(data, bcb) {
  const w = new ListWidget();

  const grad = new LinearGradient();
  grad.colors = [color(C.bg0), color(C.bg1)];
  grad.locations = [0.0, 1.0];
  w.backgroundGradient = grad;
  w.setPadding(10, 12, 8, 12);

  // ── Header ──
  const header = w.addStack();
  header.layoutHorizontally();
  header.centerAlignContent();
  addText(header, "₿  USDT / BOB", 13, C.accent);
  header.addSpacer();
  const now = new Date();
  addText(
    header,
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    9,
    C.dim,
  );

  w.addSpacer(4);

  // ── Column Headers ──
  const colHeader = w.addStack();
  colHeader.layoutHorizontally();
  addCell(colHeader, COL.bank, "BANCO", 7, C.dim, "left");
  addCell(colHeader, COL.buy, "COMPRA", 7, C.dim, "right");
  addCell(colHeader, COL.sell, "VENTA", 7, C.dim, "right");
  addCell(colHeader, COL.spread, "DIFF", 7, C.dim, "right");
  addCell(colHeader, COL.offers, "OF", 7, C.dim, "right");

  w.addSpacer(2);

  // ── P2P Data Rows ──
  for (var i = 0; i < data.length; i++) {
    const row = data[i];
    const stack = w.addStack();
    stack.layoutHorizontally();
    stack.centerAlignContent();

    addCell(stack, COL.bank, row.label, 9, C.white, "left");
    addCell(
      stack,
      COL.buy,
      row.buy ? row.buy.toFixed(2) : "—",
      9,
      C.buy,
      "right",
    );
    addCell(
      stack,
      COL.sell,
      row.sell ? row.sell.toFixed(2) : "—",
      9,
      C.sell,
      "right",
    );

    if (row.spread !== null) {
      addCell(
        stack,
        COL.spread,
        row.spread.toFixed(2) + "(" + row.pct.toFixed(1) + "%)",
        9,
        C.spread,
        "right",
      );
    } else {
      addCell(stack, COL.spread, "—", 9, C.dim, "right");
    }

    addCell(
      stack,
      COL.offers,
      row.offers + "/" + CONFIG.rows,
      9,
      C.offers,
      "right",
    );
    w.addSpacer(2);
  }

  // ── Divider ──
  w.addSpacer(3);
  const divider = w.addStack();
  divider.layoutHorizontally();
  divider.backgroundColor = color(C.divider);
  divider.size = new Size(0, 1);
  w.addSpacer(3);

  // ── BCB TC Oficial ──
  const tcoStack = w.addStack();
  tcoStack.layoutHorizontally();
  tcoStack.centerAlignContent();
  addCell(tcoStack, COL.bank, "BCB OFICIAL", 9, C.bcb, "left");
  addCell(
    tcoStack,
    COL.buy,
    bcb.officialRate ? bcb.officialRate.toFixed(2) : "—",
    9,
    C.buy,
    "right",
  );
  addCell(tcoStack, COL.sell, "—", 9, C.dim, "right");
  addCell(tcoStack, COL.spread, "Oficial", 7, C.dim, "right");
  addCell(tcoStack, COL.offers, "—", 9, C.dim, "right");

  w.addSpacer();

  // ── Footer ──
  addText(
    w,
    "avg top " + CONFIG.rows + " · P2P Binance · Bs. " + CONFIG.amount,
    7,
    C.dim,
  );

  w.refreshAfterDate = new Date(Date.now() + CONFIG.refresh);
  return w;
}

// ── Entry Point ──────────────────────────────────────────────────────────────

const [data, bcb] = await Promise.all([fetchAllPrices(), fetchBCB()]);
const widget = createWidget(data, bcb);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}

Script.complete();
