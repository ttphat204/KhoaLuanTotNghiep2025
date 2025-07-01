const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");

const corsOptions = {
  origin: "http://localhost:5173",
};

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ fruits: ["apple", "banana", "cherry"] });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
