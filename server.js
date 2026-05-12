const express=require('express');
const cors=require('cors');
const axios=require('axios');
const app=express();
app.use(cors());
app.use(express.json());
const PORT=3000;


app.get("/codeforces/contests", async (req, res) => {
  const response = await axios.get("https://codeforces.com/api/contest.list");
  res.json(response.data.result);
});

app.get("/codechef/contests",async(req,res)=>{
  const response=await axios.get("https://www.codechef.com/api/list/contests/all");
  res.json(response.data);
})

app.get("/hackerrank/contests", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.hackerrank.com/rest/contests/upcoming",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      }
    );

    res.json(response.data.models);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch HackerRank data" });
  }
});

app.get('/atcoder/contests', async (req, res) => {

  try {

    const response = await axios.get(
      'https://kenkoooo.com/atcoder/resources/contests.json'
    );

    res.json(response.data);

  } catch (err) {

    res.status(500).json({
      error: 'Failed to fetch AtCoder contests'
    });

  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});