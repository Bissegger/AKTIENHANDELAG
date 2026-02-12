export default function riskScore(prices){

  const vol = volatility(prices.slice(-30));
  const drawdown = calcDrawdown(prices.slice(-30));

  return Math.round((vol*100)+(drawdown*100));
}

function volatility(a){
  let v=0;
  for(let i=1;i<a.length;i++)
    v+=Math.abs(a[i]-a[i-1])/a[i-1];
  return v/a.length;
}

function calcDrawdown(a){
  const peak=Math.max(...a);
  const last=a.at(-1);
  return (peak-last)/peak;
}
