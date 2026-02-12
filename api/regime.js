export default function detectRegime(prices){

  const short = avg(prices.slice(-20));
  const long = avg(prices.slice(-50));

  const vol = volatility(prices.slice(-20));

  if(vol>0.04) return "High Volatility";
  if(short>long) return "Bull";
  if(short<long) return "Bear";

  return "Sideways";
}

function avg(a){return a.reduce((x,y)=>x+y,0)/a.length;}

function volatility(a){
  let v=0;
  for(let i=1;i<a.length;i++)
    v+=Math.abs(a[i]-a[i-1])/a[i-1];
  return v/a.length;
}
