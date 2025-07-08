import dbConnect from "../../lib/Mongodb";
import User from "../../models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method not allowed
  }

  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields required" });
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return res.status(201).json({ message: "User created", user: { email: user.email } });
}
