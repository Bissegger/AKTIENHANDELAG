export default async function handler(req,res){

  const { symbol } = req.query;
  const KEY = process.env.NEWS_KEY;

  if(!symbol) return res.json({sentiment:0});

  try{
    const r = await fetch(
      `https://newsapi.org/v2/everything?q=${symbol}&language=en&apiKey=${KEY}`
    );

    const data = await r.json();

    if(!data.articles) return res.json({sentiment:0});

    let score=0,count=0;

    data.articles.slice(0,15).forEach(a=>{
      const t=(a.title+" "+a.description).toLowerCase();

      if(t.includes("crash")||t.includes("loss")||t.includes("lawsuit")) score--;
      if(t.includes("growth")||t.includes("profit")||t.includes("upgrade")) score++;

      count++;
    });

    res.json({sentiment: count? score/count:0});

  }catch{
    res.json({sentiment:0});
  }
}
