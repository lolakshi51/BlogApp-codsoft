import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    const { email, username, password } = req.body;

    // Check existing user
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(q, [email, username], (err, data) => {
        if (err) return res.status(500).json({ error: "Database query error" });
        if (data.length) return res.status(409).json("User already exists");

        // Hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
        const values = [username, email, hash];

        db.query(q, [values], (err) => {
            if (err) return res.status(500).json({ error: "Database query error" });
            return res.status(201).json("User has been created");
        });
    });
};

export const login = (req, res) => {
    const { username, password } = req.body;

    // Check user
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [username], (err, data) => {
        if (err) return res.status(500).json({ error: "Database query error" });
        if (data.length === 0) return res.status(404).json("User not found");

        // Check password
        const isPasswordCorrect = bcrypt.compareSync(password, data[0].password);
        if (!isPasswordCorrect) return res.status(400).json("Wrong username or password");

        const token = jwt.sign({ id: data[0].id }, "jwtkey"); // Add token expiration
        const { password: _, ...other } = data[0];

        // Send cookie
        res.cookie("access_token", token, { 
            domain: "localhost",     // Prevent JavaScript access
            secure: false, // Use HTTPS in production
            sameSite: 'lax',     // Adjust according to your CORS setup
            path: '/'            // Make sure the path matches where the cookie is needed
        }).status(200).json(other);
    });
};

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        domain: "localhost",
        secure: false,
        sameSite: 'lax',
        path: '/',
    }).status(200).json("User has been logged out");
};
