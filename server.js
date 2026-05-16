const express=require('express');
const cors=require('cors');
const axios=require('axios');
const app=express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// CODEFORCES
app.get("/codeforces/contests", async (req, res) => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    res.json(response.data.result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Codeforces data" });
  }
});

//CODECHEF
app.get("/codechef/contests",async(req,res)=>{
  try{
    const response=await axios.get("https://www.codechef.com/api/list/contests/all");
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch CodeChef data" });
  }
});

// HACKERRANK - LOADS BUT FAILS AS MOST IS PAST CONTESTS
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


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});