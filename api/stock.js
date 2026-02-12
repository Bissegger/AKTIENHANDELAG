const cache = {};

export default async function handler(req, res) {
  const symbol = req.query.symbol?.toUpperCase();
  const API_KEY = process.env.fb30e9c5783845ab83a6e9c57e4d75cd;

  if (!symbol) return res.status(400).json({ error: "No symbol" });

  if (cache[symbol] && Date.now() - cache[symbol].time < 30000) {
    return res.status(200).json(cache[symbol].data);
  }

  const trySymbols = [
    symbol,
    symbol + ".SW",
    symbol + ".DE",
    symbol + ".PA",
    symbol + ".AS"
  ];

  for (let sym of trySymbols) {
    try {
      const url = `https://api.twelvedata.com/time_series?symbol=${sym}&interval=1day&outputsize=120&apikey=${API_KEY}`;
      const r = await fetch(url);
      const j = await r.json();

      if (j.values && j.values.length > 30) {
        const data = {
          success: true,
          symbol: sym,
          prices: j.values.map(v => +v.close).reverse()
        };

        cache[symbol] = { time: Date.now(), data };
        return res.status(200).json(data);
      }
    } catch (e) {}
  }

  return res.status(404).json({
    success: false,
    error: "No supported exchange found"
  });
}
