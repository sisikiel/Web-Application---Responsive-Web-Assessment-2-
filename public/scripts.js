/*PARALLAX */
document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;


    document.querySelector(".layer-1").style.transform =
        `translate(${x * 20}px, ${y * 20}px) scale(1.0)`;


    document.querySelector(".layer-2").style.transform =
        `translate(${x * 40}px, ${y * 40}px) scale(1.2)`;


    document.querySelector(".layer-3").style.transform =
        `translate(${x * 50}px, ${y * 50}px) scale(1.1)`;


    document.querySelector(".layer-4").style.transform =
        `translate(${x * 25}px, ${y * 25}px) scale(1.2)`;
});

// Cache layers once
const parallaxLayers = [
    { el: document.querySelector(".layer-1"), strength: 20, scale: 1.0 },
    { el: document.querySelector(".layer-2"), strength: 40, scale: 1.2 },
    { el: document.querySelector(".layer-3"), strength: 50, scale: 1.1 },
    { el: document.querySelector(".layer-4"), strength: 25, scale: 1.2 },
];

// Safety check (prevents errors if layers don't exist on some pages)
if (parallaxLayers.every(layer => layer.el)) {

    function applyParallax(x, y) {
        parallaxLayers.forEach(layer => {
            layer.el.style.transform =
                `translate(${x * layer.strength}px, ${y * layer.strength}px) scale(${layer.scale})`;
        });
    }

    /* Desktop: mouse */
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        applyParallax(x, y);
    });

    /* Mobile: touch */
    document.addEventListener("touchmove", (e) => {
        if (!e.touches.length) return;

        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth - 0.5) * 2;
        const y = (touch.clientY / window.innerHeight - 0.5) * 2;
        applyParallax(x, y);
    }, { passive: true });

    /* Mobile: device tilt (gyro) */
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (e) => {
            const x = Math.max(-1, Math.min(1, e.gamma / 30));
            const y = Math.max(-1, Math.min(1, e.beta / 30));
            applyParallax(x, y);
        });
    }
}

/*CORE ELEMENTS*/
const boxContent = document.getElementById("boxContent");
const contentBox = document.getElementById("contentBox");
const MIN_WIDTH = 700;

/*DATA STRUCTURE*/
const sections = {
    home: {
        width: "850px",
        height: "708px",
        content: `
            <section class="home-section">
                <header class="home-header">
                    <h2>Welcome to Stuffed (manuscript)</h2>
                    <p class="home-subtitle">
                        [DRAFT 01]
                    </p>
                </header>


                <div class="home-body">
                    <p>
                        "Every Nightmare Needs A Friend" (tagline??)
                    </p>
                    <p class="home-hint">
                        This manuscript will serve as a draft of my upcoming game titled "Stuffed".
                    </p>
                    <p> -- Sisi, creator and owner. </p>
                </div>
            </section>
        `
    },

    about: {
        width: "850px",
        height: "708px",
        content: `
            <section class="about-section">
                <h2>About Game</h2>
                <p>
                    This is a 2D game that takes place between a teddy bear and its owner, Finn.
                    Mocha's (the bear) sole purpose is to prevent Finn from having nightmares.
                    That's how the story goes.
                </p>


                <p>
                    Why this story, you might ask? Personally, I wanted to create a game where
                    players could feel the story. Growing up, I've always thought stuffed toys
                    were special—how such a simple thing could give a child endless comfort.
                </p>


                <p>
                    The images below are some well-known stuffed toys that teens today might
                    recognize. These can also be used as inspiration for character design. Click it!
                </p>


                <!-- IMAGE AT THE BOTTOM -->
                <div class="about-image-wrapper">
                    <img
                        src="Assets/about_stuffed_toys.png"
                        alt="Stuffed toy inspirations"
                        width="400"
                        height="275"
                        class="zoomable-image"
                    />
                </div>
            </section>
        `
    },

    characters: {
        width: "850px",
        height: "708px",
        bookmarks: [
            {
                id: "finn",
                title: "Finn",
                description: "A quiet boy who loves to read books <br><br> Here are some important information about Finn (click image to view):",
                image: "Assets/finn_image.png",
                imageBelow: "Assets/finn_inspo.png"
            },
            {
                id: "mocha",
                title: "Mocha",
                description: "Finn's favorite teddy bear. <br><br>Not only he is Finn's favorite, he is also his protector :)!",
                image: "Assets/mocha_image.png",
                imageBelow: "Assets/mocha_inspo.png"
            },
            {
                id: "Mother",
                title: "Mother",
                description: "Finn's mother. An important character who will reveal the truth in the end.",
                image: "Assets/mother_image.png",
                imageBelow: "Assets/mother_inspo.png"
            }
        ]
    },


    dream: {
        width: "850px",
        height: "708px",
        content: `
        <section class="dream-section">


            <h2 class="dream-title">Dream Bear Customization</h2>
            <p class="dream-subtitle">Create your own guardian bear ✨</p>


            <!-- PREVIEW CONTAINER -->
            <div class="bear-preview-container">
                <div class="bear-preview">
                    <img id="bear-base"   class="bear-layer" src="Assets/bear/base/base_brown.png">
                    <img id="bear-ears"   class="bear-layer">
                    <img id="bear-eyes"   class="bear-layer">
                    <img id="bear-head"   class="bear-layer">
                </div>
            </div>


            <!-- BOOKMARK NAV -->
            <aside class="bookmark-bar">
                <button class="bookmark active" data-part="base">Base</button>
                <button class="bookmark" data-part="ears">Ears</button>
                <button class="bookmark" data-part="eyes">Eyes</button>
                <button class="bookmark" data-part="head">Head</button>
                <button class="bookmark" data-part="detail">Details</button>
            </aside>


            <!-- OPTIONS CONTAINERS -->
            <div class="bear-options-container">


                <div class="options-panel" id="base-options">
                    <h3>Base Color</h3>
                    <div class="option-row">
                        <button onclick="selectPart('base','base_blue')">Blue</button>
                        <button onclick="selectPart('base','base_brown')">Brown</button>
                        <button onclick="selectPart('base','base_pink')">Pink</button>
                        <button onclick="selectPart('base','base_red')">Red</button>
                        <button onclick="selectPart('base','base_green')">Green</button>
                        <button onclick="selectPart('base','base_purple')">Purple</button>
                    </div>
                </div>


                <div class="options-panel" id="ears-options" style="display:none;">
                    <h3>Ears</h3>
                    <div class="option-row">
                        <button onclick="selectPart('ears','ear_01')">Ear 1</button>
                        <button onclick="selectPart('ears','ear_02')">Ear 2</button>
                        <button onclick="selectPart('ears','ear_03')">Ear 3</button>
                    </div>
                </div>


                <div class="options-panel" id="eyes-options" style="display:none;">
                    <h3>Eyes</h3>
                    <div class="option-row">
                        <button onclick="selectPart('eyes','eyes_01')">Eye 1</button>
                        <button onclick="selectPart('eyes','eyes_02')">Eye 2</button>
                        <button onclick="selectPart('eyes','')">None</button>
                    </div>
                </div>


                <div class="options-panel" id="head-options" style="display:none;">
                    <h3>Head</h3>
                    <div class="option-row">
                        <button onclick="selectPart('head','crown_01')">Crown 1</button>
                        <button onclick="selectPart('head','crown_02')">Crown 2</button>
                        <button onclick="selectPart('head','')">None</button>
                    </div>
                </div>


                <!-- ACTION BUTTONS -->
                <div class="bear-action-buttons">
                    <button class="bear-btn save" onclick="saveBear()">Save</button>
                    <button class="bear-btn undo" onclick="loadBear()">Undo</button>
                </div>


            </div>
        </section>
        `
    },

    download: {
        width: "850px",
        height: "708px",
        content: `<h2>Download</h2><p>Here is where you can download my app.</p>`
    },


    profile: {
        width: "850px",
        height: "708px",
        content: `
            <section class="profile-section">


                <h2 class="profile-title">Your Profile</h2>


                <div class="login-box">
                    <label>
                        Username
                        <input type="text" id="profile-username" />
                    </label>


                    <label>
                        Password
                        <input type="password" id="profile-password" />
                    </label>


                    <div class="profile-actions">
                        <button class="profile-btn" id="signupBtn">Sign Up</button>
                        <button class="profile-btn" id="loginBtn">Log In</button>
                    </div>


                    <p class="profile-message" id="profileMessage"></p>
                </div>


            </section>
        `
    }
};

/* ================== SECTION LOADER ================== */
/* ------------------------
   RESPONSIVE FUNCTION
------------------------ */
function adjustBookSize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Right page
    if (vw < 400) { // Extra small screens
        contentBox.style.width = "90%";
        contentBox.style.height = "auto";
        contentBox.style.maxHeight = "380px";
    } else if (vw < 600) { // Mobile
        contentBox.style.width = "100%";
        contentBox.style.height = "auto";
        contentBox.style.maxHeight = "770px";
    } else if (vw < 900) { // Tablet
        contentBox.style.width = "90%";
        contentBox.style.height = "auto";
        contentBox.style.maxHeight = "1000px";
    } else { // Desktop
        const section = boxContent.parentElement.classList[2]?.replace("section-", "");
        const data = sections[section] || {};
        contentBox.style.width = Math.max(parseInt(data.width) || MIN_WIDTH, MIN_WIDTH) + "px";
        contentBox.style.height = data.height || "708px";
    }

    // Nav buttons scaling
    const navBtns = document.querySelectorAll(".nav-btn");
    navBtns.forEach(btn => {
        if (vw < 400) {
            btn.style.width = "20px";
            btn.style.height = "20px";
        } else if (vw < 600) {
            btn.style.width = "35px";
            btn.style.height = "35px";
        } else if (vw < 900) {
            btn.style.width = "60px";
            btn.style.height = "60px";
        } else {
            btn.style.width = "80px";
            btn.style.height = "80px";
        }
    });
}

/* ------------------------
   LOAD SECTION
------------------------ */
function loadSection(section) {
    const data = sections[section];

    // Insert section content
    boxContent.innerHTML = data.content;

    // Reset classes & add section-specific
    contentBox.className = "book-page right-page content-box";
    contentBox.classList.add(`section-${section}`);

    // Dream section reset
    if (section === "dream") {
        resetBearCustomizer();
        document.querySelectorAll(".bookmark").forEach(btn => {
            btn.addEventListener("click", () => {
                const part = btn.dataset.part;
                document.querySelectorAll(".options-panel").forEach(panel => panel.style.display = "none");
                const activePanel = document.getElementById(`${part}-options`);
                if (activePanel) activePanel.style.display = "flex";
                document.querySelectorAll(".bookmark").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            });
        });
    }

    // Characters section
    if (section === "characters") {
        renderCharacters();
    }

    // Profile section
    if (section === "profile") {
        setTimeout(renderProfile, 0);
    }

    // Update profile button
    updateProfileNavButton();

    // Adjust size dynamically
    adjustBookSize();
}

/* ------------------------
   DYNAMIC RESIZE
------------------------ */
window.addEventListener("resize", adjustBookSize);

/* ------------------------
   INITIAL LOAD
------------------------ */
window.addEventListener("DOMContentLoaded", () => {
    loadSection("home"); // default section
});



/* ================== DREAM BEAR CUSTOMIZER ================== */
const bearState = {
    base: "base_brown",
    ears: "",
    eyes: "",
    head: ""
};

function resetBearCustomizer() {
    bearState.base = "base_brown"; // or your default
    bearState.ears = "";
    bearState.eyes = "";
    bearState.head = "";

    applyBearState();
}


function imagePath(part, name) {
    if (!name) return "";
    return `Assets/bear/${part}/${name}.png`;
}

function applyBearState() {
    Object.keys(bearState).forEach(part => {
        const img = document.getElementById(`bear-${part}`);
        if (img) img.src = bearState[part] ? imagePath(part, bearState[part]) : "";
    });
}

function selectPart(part, name) {
    bearState[part] = name;
    applyBearState();
}

async function generateBearProfileImageFromState(state) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 300;

    const BEAR_LAYERS = ["base", "ears", "eyes", "head"];
    for (const part of BEAR_LAYERS) {
        const name = state[part];
        if (!name) continue;
        await new Promise(resolve => {
            const img = new Image();
            img.src = `Assets/bear/${part}/${name}.png`;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve();
            };
        });
    }
    return canvas.toDataURL("image/png");
}

async function updateProfileNavButton() {
    const profileBtn = document.querySelector(".nav-btn[data-section='profile']");
    if (!profileBtn) return;

    let profileImg = localStorage.getItem("profileBearImage");

    const username = localStorage.getItem("username");
    if (!profileImg && username) {
        try {
            const res = await fetch(`/api/me?username=${encodeURIComponent(username)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.loggedIn && data.bearState) {
                    profileImg = await generateBearProfileImageFromState(data.bearState);
                    localStorage.setItem("profileBearImage", profileImg);
                }
            }
        } catch (err) {
            console.error("Failed to fetch user bear:", err);
        }
    }

    profileBtn.style.backgroundImage = profileImg ? `url(${profileImg})` : "url('Assets/Button_Profile.png')";
    profileBtn.style.backgroundSize = "cover";
    profileBtn.style.borderRadius = "15%";
}

async function saveBear() {
    const loginData = await isLoggedIn();
    if (!loginData) {
        alert("🔒 You must log in to save your Dream Bear!");
        loadSection("profile");
        return;
    }

    const profileImg = await generateBearProfileImageFromState(bearState);
    localStorage.setItem("dreamBear", JSON.stringify(bearState));
    localStorage.setItem("profileBearImage", profileImg);

    await updateProfileNavButton();

    try {
        await fetch("/api/saveBear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: loginData.username, bearState })
        });
        alert("🐻 Bear saved successfully!");
    } catch (err) {
        console.error("Failed to save bear to backend:", err);
        alert("⚠️ Failed to save bear to server!");
    }
}

function loadBear() {
    const saved = localStorage.getItem("dreamBear");
    if (saved) Object.assign(bearState, JSON.parse(saved));
    applyBearState();
}


function showOptions(part) {
    document.querySelectorAll(".options-panel").forEach(panel => panel.style.display = "none");
    const activePanel = document.getElementById(`${part}-options`);
    if (activePanel) activePanel.style.display = "flex";

    document.querySelectorAll(".bookmark").forEach(tab => tab.classList.remove("active"));
    const activeTab = document.querySelector(`.bookmark[data-part="${part}"]`);
    if (activeTab) activeTab.classList.add("active");
}

/* ================== CHARACTERS ================== */
function renderCharacters(activeId) {
    const chars = sections.characters.bookmarks;
    const active = chars.find(c => c.id === activeId) || chars[0];

    boxContent.innerHTML = `
        <section class="characters-section">
            <aside class="character-tabs">
                ${chars.map(c => `
                    <button class="character-tab ${c.id === active.id ? "active" : ""}" data-char="${c.id}">
                        ${c.title}
                    </button>
                `).join("")}
            </aside>
            <div class="character-content">
                <div class="character-image-frame">
                    <img src="${active.image}" alt="${active.title}" class="zoomable-image" loading="lazy" />
                </div>
                <h2>${active.title}</h2>
                <p>${active.description}</p>
                ${active.imageBelow ? `<div class="character-image-frame secondary">
                    <img src="${active.imageBelow}" alt="${active.title} extra" class="zoomable-image" loading="lazy" />
                </div>` : ""}
            </div>
        </section>
    `;

    document.querySelectorAll(".character-tab").forEach(btn => {
        btn.addEventListener("click", () => renderCharacters(btn.dataset.char));
    });
}

/* ================== PROFILE ================== */
function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}
function getUsername() {
    return localStorage.getItem("username");
}

function renderProfile() {
    const section = document.querySelector(".profile-section");
    if (!section) return;
    if (isLoggedIn()) showWelcome(getUsername());
    else showProfileForm();
}

function showProfileForm() {
    const section = document.querySelector(".profile-section");
    if (!section) return;

    section.innerHTML = `
        <h2 class="profile-title">Your Profile</h2>
        <div class="login-box">
            <label>Username<input type="text" id="profile-username"></label>
            <label>Password<input type="password" id="profile-password"></label>
            <div class="profile-actions">
                <button class="profile-btn" id="signupBtn">Sign Up</button>
                <button class="profile-btn" id="loginBtn">Log In</button>
            </div>
            <p class="profile-message" id="profileMessage"></p>
        </div>
    `;
}

function showWelcome(username) {
    const section = document.querySelector(".profile-section");
    if (!section) return;

    section.innerHTML = `
        <h2 class="profile-title">Your Profile</h2>
        <div class="welcome-box">
            <p class="welcome-message">Welcome, <strong>${username}</strong>!</p>
            <button class="profile-btn" id="logoutBtn">Log Out</button>
        </div>
    `;
}

function updateSaveButton() {
    const saveBtn = document.querySelector(".bear-btn.save");
    if (!saveBtn) return;
    if (isLoggedIn()) {
        saveBtn.disabled = false;
        saveBtn.innerText = "Save";
    } else {
        saveBtn.disabled = false;
        saveBtn.innerText = "Log in to Save";
    }
}

/* ---------- PROFILE CLICK HANDLER ---------- */
document.addEventListener("click", async e => {
    const msg = document.getElementById("profileMessage");

    if (e.target.id === "signupBtn") {
        const u = document.getElementById("profile-username").value.trim();
        const p = document.getElementById("profile-password").value.trim();
        if (!u || !p) { msg.textContent = "Please fill in all fields."; msg.style.color = "red"; return; }

        try {
            const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: u, password: p }) });
            const data = await res.json();
            if (!res.ok) { msg.textContent = data.message || "Sign up failed"; msg.style.color = "red"; return; }
            msg.textContent = data.message; msg.style.color = "green";
            showWelcome(u); updateSaveButton();
        } catch (err) { console.error(err); msg.textContent = "Server error"; msg.style.color = "red"; }
    }

    if (e.target.id === "loginBtn") {
        const u = document.getElementById("profile-username").value.trim();
        const p = document.getElementById("profile-password").value.trim();
        if (!u || !p) { msg.textContent = "Please fill in all fields."; msg.style.color = "red"; return; }

        try {
            const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: u, password: p }) });
            const data = await res.json();
            if (!res.ok) { msg.textContent = data.message || "Login failed"; msg.style.color = "red"; return; }

            msg.textContent = data.message; msg.style.color = "green";
            localStorage.setItem("username", data.username);
            localStorage.setItem("loggedIn", "true");
            showWelcome(data.username); updateSaveButton();
            await updateProfileNavButton();
        } catch (err) { console.error(err); msg.textContent = "Server error"; msg.style.color = "red"; }
    }

    if (e.target.id === "logoutBtn") {
        localStorage.removeItem("username");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("profileBearImage");
        showProfileForm();
        updateSaveButton();
        await updateProfileNavButton();
    }
});

/* ================== NAV BUTTONS ================== */
document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
        loadSection(btn.dataset.section);
        await updateProfileNavButton();
    });
});

/* ================== IMAGE ZOOM ================== */
document.addEventListener("click", e => {
    const img = e.target.closest(".zoomable-image");
    if (!img || document.querySelector(".image-overlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "image-overlay";
    overlay.appendChild(img.cloneNode(true));
    document.body.appendChild(overlay);
    overlay.addEventListener("click", () => overlay.remove());
});

/* ================== BOOK TOGGLE ================== */
document.addEventListener("DOMContentLoaded", () => {
    const book = document.getElementById("book");
    const cover = document.getElementById("bookCover");
    if (book && cover) cover.addEventListener("click", () => book.classList.toggle("open"));
});

/* ================== INIT ================== */
document.addEventListener("DOMContentLoaded", async () => {
    resetBearCustomizer();
    showOptions("base");
    updateProfileNavButton();

    const saveBtn = document.querySelector(".bear-btn.save");
    if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.addEventListener("click", saveBear);
    }

    loadSection("home");
});

/*Loading screen*/
window.addEventListener("load", () => {
    const loader = document.getElementById("app-loader");
    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("hidden");
    }, 4800); // slight delay feels smoother
});
