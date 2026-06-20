> 🌐 [Leer en Español](README.es.md)

# 🇧🇴 Dólar BO

![Version](https://img.shields.io/badge/version-2.0.0-orange)
![Platform](https://img.shields.io/badge/platform-iOS-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Track the **USDT/BOB** parallel exchange rate in real time directly from your
home screen — no opening Binance, no checking WhatsApp groups.

Data from **Binance P2P** + **Banco Central de Bolivia (BCB)**,
auto-refreshing every 5 minutes.

---

## 📱 Preview

![Widget preview](assets/preview.png)

---

## ✨ Features

- Buy and sell prices for 5 banks — BNB, Union, Ganadero, Mercantil and BCP
- Average of top 5 listings per bank for a realistic market rate
- DIFF column: spread between buy and sell as value and percentage
- OF column: active listings found per bank (liquidity indicator)
- BCB official exchange rate and USD reference value
- All requests fire in parallel — fast and efficient
- Auto-refresh every 5 minutes

---

## 🔍 How it works

The script fires all requests to the **Binance P2P API** simultaneously using
`Promise.all` — one buy and one sell request per bank, all in parallel.

For each bank it fetches the **top 5 listings** and averages the prices,
giving a more realistic market rate than relying on a single seller.

The **DIFF** is the difference between the average buy and sell price,
shown as an absolute value and percentage. A smaller DIFF means a more
competitive market and a better deal for you.

The **OF** column shows how many listings were found out of 5 — a `5/5`
means the market is liquid, a `1/5` means very few sellers are active
for that bank at that amount.

The **BCB** rows at the bottom show the official exchange rate and the
USD reference value published daily by the Banco Central de Bolivia,
fetched directly from their website.

---

## 📝 Changelog

### v2.0.0
- Parallel requests with Promise.all (~3x faster than v1)
- Average of top 5 listings per bank instead of top 1
- Fixed column alignment with fixed-width cell stacks
- BCB rows: official exchange rate + USD reference value
- OF column: liquidity indicator per bank
- 5 banks supported (BNB, Union, Ganadero, Mercantil, BCP)
- Refresh interval changed to 5 minutes

### v1.0.0
- Initial release by [@mirkomg](https://github.com/mirkomg)
- Sequential Binance P2P fetch for 3 banks
- Top listed price per bank for buy and sell
- DIFF as absolute value and percentage
- Auto-refresh every minute

---

## 🍎 Installation — iOS (Scriptable)

**Requirements:** iPhone with iOS 14 or later

**1.** Download [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188)
for free from the App Store

**2.** 👉 [**Download dolar-bo.js**](https://raw.githubusercontent.com/mirkomg/dolar-bo/main/scriptable/dolar-bo.js)
— tap the link on your iPhone, select all, copy

**3.** Open Scriptable → tap **+** in the top right → paste the code

**4.** Tap the settings icon (top right) →
name it **Dólar BO** → save

**5.** Long press your home screen →
tap **+** → search for **Scriptable**

**6.** Select the **Medium** size → add it

**7.** Tap the widget → under **Script** select **Dólar BO**

Done. The widget updates automatically every 5 minutes.

---

## 🔧 Customization

At the top of `dolar-bo.js` you can modify:

```javascript
const CONFIG = {
  amount:  1000,            // BOB amount used to filter listings
  rows:    5,               // Number of listings to average per bank
  refresh: 5 * 60 * 1000,  // Refresh interval in milliseconds
};
```

To enable more banks uncomment the lines in `BANKS`:

```javascript
const BANKS = [
  { id: 'BancoDeBolivia',  label: 'BNB'      },
  { id: 'BancoUnion',      label: 'Union'    },
  { id: 'BancoGanadero',   label: 'Ganadero' },
  { id: 'BancoSantaCruz',  label: 'Mercantil'},
  { id: 'BancoDeCredito',  label: 'BCP'      },
  // { id: 'TigoMoney',    label: 'Tigo'     },  // ← remove // to enable
];
```

---

## 📡 Data sources

| Source | Data | Frequency |
|--------|------|-----------|
| [Binance P2P](https://p2p.binance.com) | Buy and sell prices per bank | Real time |
| [BCB](https://www.bcb.gob.bo) | Official rate + Reference value | Daily |

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