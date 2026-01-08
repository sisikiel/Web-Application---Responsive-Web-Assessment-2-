const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

/* ================== MONGODB SETUP ================== */
const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "stuffedDB";

let usersCollection;

/* ================== MIDDLEWARE ================== */
app.use(express.static("public")); // serve CSS, JS, images
app.use(express.json()); // parse JSON body

/* ================== CONNECT TO MONGODB ================== */
MongoClient.connect(MONGO_URL)
    .then(client => {
        const db = client.db(DB_NAME);
        usersCollection = db.collection("users");
        console.log("✅ Connected to MongoDB");
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
    });

/* ================== API ROUTES ================== */

// ---------- SIGN UP ----------
app.post("/api/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required." });
        }

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            username,
            password: hashedPassword,
            bearState: null
        });

        res.json({ message: "Sign up successful!" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ---------- LOG IN ----------
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        res.json({ message: "Login successful!", username });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ---------- GET CURRENT USER ----------
app.get("/api/me", async (req, res) => {
    const username = req.query.username;

    if (!username) return res.json({ loggedIn: false });

    const user = await usersCollection.findOne({ username });
    if (!user) return res.json({ loggedIn: false });

    res.json({
        loggedIn: true,
        username: user.username,
        bearState: user.bearState || null
    });
});

// ---------- SAVE BEAR ----------
app.post("/api/saveBear", async (req, res) => {
    const { username, bearState } = req.body;

    console.log("Received saveBear request body:", req.body); // debug

    if (!username) {
        return res.status(400).json({ message: "Missing username" });
    }

    // Ensure bearState is always an object
    const safeBearState = bearState && typeof bearState === "object" ? bearState : {};

    try {
        const result = await usersCollection.updateOne(
            { username },
            { $set: { bearState: safeBearState } }
        );

        console.log("Update result:", result);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Bear saved successfully" });
    } catch (err) {
        console.error("Save bear error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


/* ================== SERVE SPA ================== */

// Serve Stuffed.html at root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Stuffed.html"));
});

// Fallback
app.use((req, res) => {
    res.status(404).send("Page not found");
});

/* ================== START SERVER ================== */
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
