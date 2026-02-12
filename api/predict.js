import detectRegime from "./regime.js";
import { RSI } from "./indicators.js";
import riskScore from "./risk.js";

export default async function handler(req,res){

  const { prices, days } = req.body;

  const regime = detectRegime(prices);
  const rsi = RSI(prices);
  const risk = riskScore(prices);

  let value = prices.at(-1);
  const momentum = (prices.at(-1)-prices.at(-20))/prices.at(-20);

  let weightTrend=0.4, weightVol=0.3;

  if(regime==="Bull") weightTrend=0.6;
  if(regime==="Bear") weightTrend=0.2;
  if(regime==="High Volatility") weightVol=0.5;

  for(let i=0;i<days;i++){
    const drift = momentum*weightTrend - risk*0.002;
    value *= (1+drift);
  }

  res.json({
    predicted:value,
    regime,
    risk,
    rsi:Math.round(rsi)
  });
}
