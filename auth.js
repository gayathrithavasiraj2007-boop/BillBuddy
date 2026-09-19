// ========================================
// BILLBUDDY AUTH
// ========================================

const USERS_KEY = "billbuddyUsers";
const SESSION_KEY = "billbuddySession";

// ========================================
// GET USERS
// ========================================

function getUsers() {
    return JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
    );
}

// ========================================
// SAVE USERS
// ========================================

function saveUsers(users) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}

// ========================================
// CONVERT TO BASE64
// ========================================

function toBase64(buffer) {

    let binary = "";

    const bytes =
        new Uint8Array(buffer);

    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary);
}

// ========================================
// PASSWORD HASH
// ========================================

async function makePasswordHash(
    password,
    salt
) {

    const encoder =
        new TextEncoder();

    const key =
        await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            "PBKDF2",
            false,
            ["deriveBits"]
        );

    const result =
        await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            key,
            256
        );

    return toBase64(result);
}

// ========================================
// CREATE ACCOUNT
// ========================================

async function registerUser(
    name,
    email,
    password
) {

    name = name.trim();
    email = email.trim().toLowerCase();

    if (!name || !email || !password) {
        throw new Error(
            "Please fill in all fields."
        );
    }

    const users = getUsers();

    const alreadyExists =
        users.some(
            user =>
                user.email === email
        );

    if (alreadyExists) {
        throw new Error(
            "This email is already registered."
        );
    }

    // Create random salt
    const salt =
        crypto.getRandomValues(
            new Uint8Array(16)
        );

    // Hash password
    const passwordHash =
        await makePasswordHash(
            password,
            salt
        );

    // Create user
    const newUser = {

        id: Date.now().toString(),

        name: name,

        email: email,

        passwordHash:
            passwordHash,

        salt:
            toBase64(salt),

        createdAt:
            new Date().toISOString()
    };

    // Save user
    users.push(newUser);

    saveUsers(users);

    // ====================================
    // CREATE SESSION
    // ====================================

    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({

            userId:
                newUser.id,

            name:
                newUser.name,

            email:
                newUser.email
        })
    );

    return true;
}

// ========================================
// LOGIN
// ========================================

async function loginUser(
    email,
    password
) {

    email =
        email.trim().toLowerCase();

    const users = getUsers();

    const user =
        users.find(
            item =>
                item.email === email
        );

    if (!user) {
        throw new Error(
            "Invalid email or password."
        );
    }

    // Convert Base64 salt
    const binarySalt =
        atob(user.salt);

    const salt =
        Uint8Array.from(
            binarySalt,
            char =>
                char.charCodeAt(0)
        );

    // Hash entered password
    const enteredHash =
        await makePasswordHash(
            password,
            salt
        );

    if (
        enteredHash !==
        user.passwordHash
    ) {

        throw new Error(
            "Invalid email or password."
        );
    }

    // Create login session
    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({

            userId:
                user.id,

            name:
                user.name,

            email:
                user.email
        })
    );

    return true;
}

// ========================================
// CHECK LOGIN
// ========================================

function isLoggedIn() {

    return !!sessionStorage.getItem(
        SESSION_KEY
    );
}

// ========================================
// GET CURRENT USER
// ========================================

function getCurrentUser() {

    return JSON.parse(
        sessionStorage.getItem(
            SESSION_KEY
        ) || "null"
    );
}

// ========================================
// LOGOUT
// ========================================

function logoutUser() {

    sessionStorage.removeItem(
        SESSION_KEY
    );

    window.location.href =
        "login.html";
}