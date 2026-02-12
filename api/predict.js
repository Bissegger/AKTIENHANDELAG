import detectRegime from "./regime.js";
import { RSI } from "./indicators.js";
import riskScore from "./risk.js";

export default async function handler(req, res){

  try{

    const { prices, days } = req.body;

    if(!prices || !days || prices.length < 30){
      return res.status(400).json({ error: "Not enough data" });
    }

    const regime = detectRegime(prices);
    const rsi = RSI(prices);
    const risk = riskScore(prices);

    let value = prices.at(-1);
    const momentum = (prices.at(-1)-prices.at(-20))/prices.at(-20);

    let weightTrend = 0.4;
    let weightVol = 0.3;

    if(regime === "Bull") weightTrend = 0.6;
    if(regime === "Bear") weightTrend = 0.2;
    if(regime === "High Volatility") weightVol = 0.5;

    for(let i=0; i<days; i++){
      const drift = momentum*weightTrend - risk*0.002;
      value *= (1+drift);
    }

    const confidence = calculateConfidence(prices, value);

    res.status(200).json({
      predicted: value,
      regime,
      risk,
      rsi: Math.round(rsi),
      confidence
    });

  }catch(err){
    res.status(500).json({ error: "Prediction failed" });
  }
}


/* 🔥 Confidence Berechnung */
function calculateConfidence(prices, predicted){
  const last = prices.at(-1);
  const change = Math.abs(predicted - last) / last;

  let confidence = 85 - (change * 100);

  return Math.max(60, Math.min(95, Math.round(confidence)));
}
