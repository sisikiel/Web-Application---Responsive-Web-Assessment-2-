const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static("public")); // serve CSS, JS, images
app.use(express.json()); // parse JSON in requests

// Path to users.json
const USERS_FILE = path.join(__dirname, "users.json");

// Helper: read users, create file if missing
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, "[]");
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

// Helper: save users
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ================== API ROUTES ==================

// Sign Up
app.post("/api/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required." });
        }

        const users = readUsers();

        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
        saveUsers(users);

        res.json({ message: "Sign up successful!" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Log In
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const users = readUsers();
        const user = users.find(u => u.username === username);

        if (!user) return res.status(400).json({ message: "Invalid username or password." });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid username or password." });

        res.json({ message: "Login successful!", username });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get user bear
app.get("/api/me", (req, res) => {
    const username = req.query.username; // frontend will send username

    if (!username) return res.json({ loggedIn: false });

    const users = readUsers();
    const user = users.find(u => u.username === username);

    if (!user) return res.json({ loggedIn: false });

    res.json({
        loggedIn: true,
        username: user.username,
        bearState: user.bearState || null
    });
});


app.post("/api/saveBear", (req, res) => {
    const { username, bearState } = req.body;
    if (!username || !bearState) return res.status(400).json({ message: "Missing data" });

    const users = readUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bearState = bearState;
    saveUsers(users);

    res.json({ message: "Bear saved successfully" });
});

// ================== SERVE SPA ==================

// Serve Stuffed.html at root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Stuffed.html"));
});

// Fallback for unknown routes
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
