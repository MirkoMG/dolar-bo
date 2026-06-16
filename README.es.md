> 🌐 [Read in English](README.md)

# 🇧🇴 Dólar BO

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Platform](https://img.shields.io/badge/platform-iOS-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Seguí el tipo de cambio paralelo **USDT/BOB** en tiempo real directamente
desde tu pantalla de inicio — sin abrir Binance, sin buscar en grupos de WhatsApp.

Datos de **Binance P2P**, actualizándose automáticamente cada minuto.

---

## 📱 Vista previa

![Vista previa del widget](assets/preview.png)

---

## ✨ Características

- Precios de compra y venta para BancoDeBolivia, BancoUnion y BancoGanadero
- Diferencia entre compra y venta como valor absoluto y porcentaje
- Auto-refresh cada minuto

---

## 🔍 Cómo funciona

El script manda una solicitud a la **API de Binance P2P** por cada banco,
una vez para órdenes de compra y otra para órdenes de venta.

Toma el **precio del primer listing** — es decir, la mejor oferta disponible
en ese momento para una transacción de **1.000 BOB**.

El **DIFF** es la diferencia entre el precio de compra y venta,
mostrado como valor absoluto y como porcentaje. Un DIFF más chico significa
un mercado más competitivo y mejor precio para ti.

Los precios mostrados dependen del listing más arriba en ese momento —
un solo vendedor, un solo precio. La versión 2.0 mejora esto promediando
los top 5 listings por banco para una tasa de mercado más realista.

---

## 🍎 Instalación — iOS (Scriptable)

**Requisitos:** iPhone con iOS 14 o superior

**1.** Descargá [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188)
gratis desde el App Store

**2.** Abrí Scriptable → tocá **+** arriba a la derecha

**3.** Copiá el contenido de
[`scriptable/dolar-bo.js`](scriptable/dolar-bo.js)
y pegalo en el editor

**4.** Tocá el ícono de configuración (arriba a la derecha) →
poné el nombre **Dólar BO** → guardá

**5.** Mantené presionada tu pantalla de inicio →
tocá **+** → buscá **Scriptable**

**6.** Elegí el tamaño **Medium** → agregalo

**7.** Tocá el widget → en **Script** seleccioná **Dólar BO**

Listo. El widget se actualiza automáticamente cada minuto.

---

## 🔧 Personalización

Al inicio de `dolar-bo.js` podés modificar:

```javascript
const FONT_SIZE = 9;  // Ajustá el tamaño del texto

const COLORS = {
  bg0:        '#1e293b',  // Fondo superior
  bg1:        '#0f172a',  // Fondo inferior
  buyPrice:   '#008000',  // Color precio compra
  sellPrice:  '#ff0000',  // Color precio venta
  difference: '#ffff00',  // Color diferencia
};
```

Para agregar o quitar bancos editá el array `PAYMENT_METHODS`:

```javascript
const PAYMENT_METHODS = [
  "BancoDeBolivia",
  "BancoUnion",
  "BancoGanadero",  // ← quitá o agregá bancos acá
];
```

---

## 📡 Fuentes de datos

| Fuente | Datos | Frecuencia |
|--------|-------|------------|
| [Binance P2P](https://p2p.binance.com) | Precios de compra y venta por banco | Tiempo real |

> ⚠️ Los precios son referenciales. No constituyen asesoría financiera.

---

## 👤 Autor

Hecho por **Mirko** · [@mirkomg](https://github.com/mirkomg)

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=flat&logo=twitter&logoColor=white)](https://twitter.com/mirkomg)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/mirko.michovich/)
[![TikTok](https://img.shields.io/badge/TikTok-000000?style=flat&logo=tiktok&logoColor=white)](https://www.tiktok.com/@mirkomichovich)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mirko-michovich-gonzales-b914481a5)

---

## 📄 Licencia

MIT — libre para usar, modificar y compartir.
