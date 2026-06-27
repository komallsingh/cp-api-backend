require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//CONTEST ROUTES 

// CODEFORCES
app.get("/codeforces/contests", async (req, res) => {
  try {
    const response = await axios.get(
      "https://codeforces.com/api/contest.list"
    );
    res.json(response.data.result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Codeforces data" });
  }
});

// CODECHEF
app.get("/codechef/contests", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.codechef.com/api/list/contests/all"
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch CodeChef data" });
  }
});

// HACKERRANK
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

// LEETCODE
app.get("/leetcode/contests", async (req, res) => {
  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
          query {
            allContests {
              title
              titleSlug
              startTime
              duration
            }
          }
        `,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const now = Math.floor(Date.now() / 1000);

    const contests = response.data.data.allContests
      .filter(contest => contest.startTime > now)
      .map(contest => ({
        title: contest.title,
        startTime: contest.startTime,
        duration: contest.duration,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      }));

    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/auth", authRoutes);
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.MONGO_URI", process.env.MONGO_URI);
console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});