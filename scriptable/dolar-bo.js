/******************************************************************************
 *  Dolar Bolivia P2P Prices Widget V1.0 - by @mirkomg
 *  Fetches USDT prices in BOB for various payment methods 
 *  from Binance P2P and displays them in a horizontally condensed widget.
 ******************************************************************************/

/******************************************************************************
 * 
 *  Constants and Configurations
 *****************************************************************************/

// Font name and size
const FONT_NAME = 'Menlo';
const FONT_SIZE = 9;

// Colors
const COLORS = {
  bg0: '#1e293b',
  bg1: '#0f172a',
  buyPrice: '#008000',
  sellPrice: '#ff0000',
  difference: '#ffff00',
};

// List of payment methods to check
const PAYMENT_METHODS = [
  "BancoDeBolivia",
  "BancoUnion",
  "BancoGanadero"
];

/******************************************************************************
 * Main Functions
 *****************************************************************************/

/**
 * Fetch P2P prices for USDT in BOB for specified payment methods.
 */
async function fetchPrices() {
  const results = [];

  for (const method of PAYMENT_METHODS) {
    const buyData = {
      proMerchantAds: false,
      page: 1,
      rows: 20,
      transAmount: 1000,
      payTypes: [method],
      asset: "USDT",
      fiat: "BOB",
      tradeType: "BUY",
    };

    const sellData = { ...buyData, tradeType: "SELL" };

    try {
      const buyRequest = new Request("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search");
      buyRequest.method = "POST";
      buyRequest.headers = { "Content-Type": "application/json" };
      buyRequest.body = JSON.stringify(buyData);
      const buyResponse = await buyRequest.loadJSON();
      const buyPrice = buyResponse.data?.[0]?.adv?.price ? parseFloat(buyResponse.data[0].adv.price) : null;

      const sellRequest = new Request("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search");
      sellRequest.method = "POST";
      sellRequest.headers = { "Content-Type": "application/json" };
      sellRequest.body = JSON.stringify(sellData);
      const sellResponse = await sellRequest.loadJSON();
      const sellPrice = sellResponse.data?.[0]?.adv?.price ? parseFloat(sellResponse.data[0].adv.price) : null;

      results.push({
        method,
        buyPrice,
        sellPrice,
        difference: buyPrice && sellPrice ? (sellPrice - buyPrice).toFixed(2) : null,
        percentage: buyPrice && sellPrice ? (((sellPrice - buyPrice) / buyPrice) * 100).toFixed(1) : null,
      });
    } catch (error) {
      console.error(`Error fetching prices for method ${method}:`, error);
      results.push({ method, buyPrice: null, sellPrice: null, difference: null, percentage: null });
    }
  }

  return results;
}

/**
 * Create a horizontally condensed widget for USDT prices.
 */
function createWidget(prices) {
  const widget = new ListWidget();

  // Set the background gradient
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color(COLORS.bg0), new Color(COLORS.bg1)];
  bgColor.locations = [0.0, 1.0];
  widget.backgroundGradient = bgColor;
  widget.setPadding(5, 5, 5, 5);

  // Add title
  const titleStack = widget.addStack();
  const title = titleStack.addText("💵 USDT Prices (BOB)");
  title.font = new Font(FONT_NAME, FONT_SIZE + 2);
  title.textColor = Color.white();
  titleStack.addSpacer();

  // Add data in a horizontal layout
  for (const price of prices) {
    const rowStack = widget.addStack();
    rowStack.layoutHorizontally();
    rowStack.spacing = 5;

    // Payment method
    const methodText = rowStack.addText(price.method.slice(0, 10)); // Truncate if too long
    methodText.font = new Font(FONT_NAME, FONT_SIZE);
    methodText.textColor = Color.white();

    // Buy and Sell prices
    const buyText = rowStack.addText(`Buy: ${price.buyPrice ? price.buyPrice.toFixed(3) : "N/A"}`);
    buyText.font = new Font(FONT_NAME, FONT_SIZE);
    buyText.textColor = new Color(COLORS.buyPrice);

    const sellText = rowStack.addText(`Sell: ${price.sellPrice ? price.sellPrice.toFixed(3) : "N/A"}`);
    sellText.font = new Font(FONT_NAME, FONT_SIZE);
    sellText.textColor = new Color(COLORS.sellPrice);

    // Difference and percentage
    const diffText = rowStack.addText(`Diff: ${price.difference || "N/A"} (${price.percentage || "N/A"}%)`);
    diffText.font = new Font(FONT_NAME, FONT_SIZE);
    diffText.textColor = new Color(COLORS.difference);
    rowStack.addSpacer();
  }

  // Add last updated time
  widget.addSpacer();
  const updatedText = widget.addText(`⏱ ${new Date().toLocaleTimeString()}`);
  updatedText.font = new Font(FONT_NAME, FONT_SIZE - 1);
  updatedText.textColor = Color.gray();
  updatedText.rightAlignText();

  return widget;
}

/******************************************************************************
 * Main Execution
 *****************************************************************************/

// Fetch data and create widget
const prices = await fetchPrices();
const widget = createWidget(prices);

// Auto-refresh every 10 minutes
widget.refreshAfterDate = new Date(Date.now() + 1 * 60 * 1000);

// Show widget
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}

Script.complete();