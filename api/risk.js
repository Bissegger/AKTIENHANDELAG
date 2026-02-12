export default function riskScore(prices){
  const vol = calcVol(prices.slice(-30));
  const draw = maxDrawdown(prices);
  let score = 10 - (vol*50 + draw*20);
  return Math.max(1,Math.min(10,Math.round(score)));
}

function calcVol(arr){
  let v=0;
  for(let i=1;i<arr.length;i++){
    v+=Math.abs(arr[i]-arr[i-1])/arr[i-1];
  }
  return v/arr.length;
}

function maxDrawdown(arr){
  let peak=arr[0], max=0;
  for(let p of arr){
    if(p>peak) peak=p;
    const dd=(peak-p)/peak;
    if(dd>max) max=dd;
  }
  return max;
}
