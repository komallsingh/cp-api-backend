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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});