const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const Url = require("./models/url");

const app = express();

// Middleware
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://SwetaKumari2020:Paul2020@url-shortner.mt3zbm1.mongodb.net/SwetaKumari2020", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Shorten URL route
app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }

  const shortId = nanoid(7); // generate random short id

  const newUrl = new Url({
    originalUrl: longUrl,
    shortId,
  });

  await newUrl.save();

  res.json({ shortUrl: `http://localhost:5000/${shortId}` });
});

// ✅ Redirect route
app.get("/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });

  if (url) {
    url.clicks++;
    await url.save();
    return res.redirect(url.originalUrl);
  } else {
    return res.status(404).json({ error: "URL not found" });
  }
});

// Start server
app.listen(5000, () => console.log("🚀 Server started on http://localhost:5000"));
