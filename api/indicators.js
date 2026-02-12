export function RSI(prices, period=14){
  let gains=0, losses=0;
  for(let i=prices.length-period;i<prices.length;i++){
    const diff=prices[i]-prices[i-1];
    if(diff>0) gains+=diff;
    else losses-=diff;
  }
  const rs=gains/losses;
  return 100-(100/(1+rs));
}
