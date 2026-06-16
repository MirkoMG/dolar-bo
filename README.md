> 🌐 [Leer en Español](README.es.md)

# 🇧🇴 Dólar BO

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Platform](https://img.shields.io/badge/platform-iOS-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Track the **USDT/BOB** parallel exchange rate in real time directly from your
home screen — no opening Binance, no checking WhatsApp groups.

Data from **Binance P2P**, auto-refreshing every minute.

---

## 📱 Preview

![Widget preview](assets/preview.png)

---

## ✨ Features

- Buy and sell prices for BancoDeBolivia, BancoUnion and BancoGanadero
- Spread between buy and sell prices as value and percentage
- Auto-refresh every minute

---

## 🔍 How it works

The script sends a request to the **Binance P2P API** for each bank,
once for buy orders and once for sell orders.

It picks the **top listed price** for each — meaning the best available
offer at that moment for a transaction of **1,000 BOB**.

The **DIFF** is the difference between the buy and sell price,
shown as an absolute value and as a percentage. A smaller DIFF means
a more competitive market and a better deal for you.

Prices shown are only as good as the top listing at that moment —
one seller, one price. Version 2.0 improves on this by averaging
the top 5 listings per bank for a more realistic market rate.

---

## 🍎 Installation — iOS (Scriptable)

**Requirements:** iPhone with iOS 14 or later

**1.** Download [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188)
for free from the App Store

**2.** Open Scriptable → tap **+** in the top right

**3.** Copy the contents of
[`scriptable/dolar-bo.js`](scriptable/dolar-bo.js)
and paste it into the editor

**4.** Tap the settings icon (top right) →
name it **Dólar BO** → save

**5.** Long press your home screen →
tap **+** → search for **Scriptable**

**6.** Select the **Medium** size → add it

**7.** Tap the widget → under **Script** select **Dólar BO**

Done. The widget updates automatically every minute.

---

## 🔧 Customization

At the top of `dolar-bo.js` you can modify:

```javascript
const FONT_SIZE = 9;  // Adjust text size

const COLORS = {
  bg0:        '#1e293b',  // Background top
  bg1:        '#0f172a',  // Background bottom
  buyPrice:   '#008000',  // Buy price color
  sellPrice:  '#ff0000',  // Sell price color
  difference: '#ffff00',  // Diff color
};
```

To add or remove banks edit the `PAYMENT_METHODS` array:

```javascript
const PAYMENT_METHODS = [
  "BancoDeBolivia",
  "BancoUnion",
  "BancoGanadero",  // ← remove or add banks here
];
```

---

## 📡 Data sources

| Source | Data | Frequency |
|--------|------|-----------|
| [Binance P2P](https://p2p.binance.com) | Buy and sell prices per bank | Real time |

> ⚠️ Prices are for reference only. This is not financial advice.

---

## 👤 Author

Built by **Mirko** · [@mirkomg](https://github.com/mirkomg)

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=flat&logo=twitter&logoColor=white)](https://twitter.com/mirkomg)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/mirko.michovich/)
[![TikTok](https://img.shields.io/badge/TikTok-000000?style=flat&logo=tiktok&logoColor=white)](https://www.tiktok.com/@mirkomichovich)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mirko-michovich-gonzales-b914481a5)
---

## 📄 License

MIT — free to use, modify and share.

