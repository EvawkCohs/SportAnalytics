import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/authMiddleware.js";

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      vorname,
      nachname,
      strasse,
      plz,
      stadt,
      mannschaft,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      vorname,
      nachname,
      strasse,
      plz,
      stadt,
      mannschaft,
    });
    await newUser.save();
    res.status(201).json({ message: "Benutzer erfolgreich registriert" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ message: "Benutzer nicht gefunden!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Ungültiges Passwort!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Nutzer nicht gefunden" });
    res.json({
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      vorname: user.vorname,
      nachname: user.nachname,
      strasse: user.strasse,
      plz: user.plz,
      stadt: user.stadt,
      mannschaft: user.mannschaft,
    });
  } catch (error) {
    res.status(500).json({ error: error.mesage });
  }
};
