
export default async function handler(req, res){

  const { symbol } = req.query;
  const KEY = process.env.TWELVE_KEY;

  if(!symbol) return res.status(400).json({error:"No symbol"});

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=90&apikey=${KEY}`;

  try{
    const r = await fetch(url);
    const data = await r.json();

    if(!data.values) return res.status(400).json({error:"No market data"});

    const prices = data.values.map(v=>parseFloat(v.close)).reverse();

    res.json({
      price: prices.at(-1),
      prices
    });

  }catch{
    res.status(500).json({error:"Fetch failed"});
  }
}
