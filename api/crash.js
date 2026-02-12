import { RSI } from "./indicators.js";
import detectRegime from "./regime.js";

export default function crashRisk(prices, sentiment){

  const rsi = RSI(prices);
  const regime = detectRegime(prices);
  const last = prices.at(-1);

  let risk=0;

  const volRecent = volatility(prices.slice(-5));
  const volLong = volatility(prices.slice(-30));

  if(volRecent>volLong*1.6) risk+=20;
  if(rsi>80||rsi<20) risk+=15;

  const ema20 = avg(prices.slice(-20));
  if(last<ema20) risk+=20;

  const peak=Math.max(...prices.slice(-30));
  if((peak-last)/peak>0.08) risk+=20;

  if(sentiment<-0.5) risk+=25;
  if(regime==="Bear"||regime==="High Volatility") risk+=15;

  return Math.min(95,Math.round(risk));
}

function avg(a){return a.reduce((x,y)=>x+y,0)/a.length;}
function volatility(a){
  let v=0;
  for(let i=1;i<a.length;i++)
    v+=Math.abs(a[i]-a[i-1])/a[i-1];
  return v/a.length;
}
