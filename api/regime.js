export default function detectRegime(prices) {
  const ema50 = avg(prices.slice(-50));
  const ema200 = avg(prices.slice(-200));
  const vol = volatility(prices.slice(-30));

  if (vol > 0.04) return "High Volatility";
  if (ema50 > ema200 * 1.02) return "Bull";
  if (ema50 < ema200 * 0.98) return "Bear";
  return "Neutral";
}

function avg(arr){return arr.reduce((a,b)=>a+b,0)/arr.length}
function volatility(arr){
  let v=0;
  for(let i=1;i<arr.length;i++){
    v+=Math.abs(arr[i]-arr[i-1])/arr[i-1];
  }
  return v/arr.length;
}
