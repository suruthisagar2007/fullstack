
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const Patient = mongoose.model(
    "Patient",
    new mongoose.Schema({
        name: { type: String, required: true },
        age: { type: Number, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        department: { type: String, required: true },
        doctor: { type: String, required: true }
    })
);

// Get all patients
app.get("/patients", async (req, res) => {
    try {
        const patients = await Patient.find().sort({ _id: -1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: "Failed to load patients" });
    }
});

// Register a patient
app.post("/patients", async (req, res) => {
    try {
        const { name, age, date, time, department, doctor } = req.body;

        if (!name || !age || !date || !time || !department || !doctor) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const patient = await Patient.create({
            name: name.trim(),
            age: Number(age),
            date: String(date),
            time: String(time),
            department,
            doctor
        });

        res.status(201).json({
            message: "Patient registered successfully!",
            patient
        });
    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ message: "Registration failed" });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(5000, () => {
            console.log("Hospital app running at http://localhost:5000");
        });
    })
    .catch(err => {
        console.error("MongoDB connection failed:", err.message);
    });
