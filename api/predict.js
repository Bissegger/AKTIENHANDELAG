import detectRegime from "./regime.js";
import { RSI } from "./indicators.js";
import riskScore from "./risk.js";
import crashRisk from "./crash.js";

export default async function handler(req,res){

  const { prices, days, sentiment } = req.body;

  const regime = detectRegime(prices);
  const rsi = RSI(prices);
  const risk = riskScore(prices);

  let value = prices.at(-1);
  const momentum = (prices.at(-1)-prices.at(-20))/prices.at(-20);

  let weightTrend=0.4;
  if(regime==="Bull") weightTrend=0.6;
  if(regime==="Bear") weightTrend=0.2;

  for(let i=0;i<days;i++){
    const drift = momentum*weightTrend - risk*0.002 + sentiment*0.01;
    value *= (1+drift);
  }

  const crash = crashRisk(prices, sentiment);
  const confidence = calcConfidence(prices,value);

  res.json({
    predicted:value,
    regime,
    risk,
    rsi:Math.round(rsi),
    crashRisk:crash,
    confidence
  });
}

function calcConfidence(prices,pred){
  const last=prices.at(-1);
  const change=Math.abs(pred-last)/last;
  let conf=85-(change*100);
  return Math.max(60,Math.min(95,Math.round(conf)));
}
