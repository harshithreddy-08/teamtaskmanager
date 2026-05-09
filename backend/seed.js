require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");

(async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Project.deleteMany(), Task.deleteMany()]);

  const hash = await bcrypt.hash("SecurePass@2025!", 10);
  const admin = await User.create({ name: "Harshith Kumar", email: "harshith.admin@teamtask.io", password: hash, role: "admin" });
  const member = await User.create({ name: "Priya Singh", email: "priya.member@teamtask.io", password: hash, role: "member" });
  const member2 = await User.create({ name: "Rahul Sharma", email: "rahul.dev@teamtask.io", password: hash, role: "member" });

  const p1 = await Project.create({
    title: "Website Redesign",
    description: "Refresh marketing site with new branding.",
    members: [admin._id, member._id, member2._id],
    createdBy: admin._id,
  });
  const p2 = await Project.create({
    title: "Mobile App MVP",
    description: "Ship v1 of the iOS/Android app.",
    members: [admin._id, member._id],
    createdBy: admin._id,
  });

  const now = Date.now();
  await Task.insertMany([
    { title: "Design hero section", description: "Figma mockups", assignedTo: member._id, status: "In Progress", deadline: new Date(now + 3 * 864e5), project: p1._id },
    { title: "Migrate blog", description: "Move posts to new CMS", assignedTo: member2._id, status: "Todo", deadline: new Date(now + 7 * 864e5), project: p1._id },
    { title: "SEO audit", assignedTo: admin._id, status: "Done", deadline: new Date(now - 2 * 864e5), project: p1._id },
    { title: "Auth flow", description: "Login + signup screens", assignedTo: member._id, status: "Todo", deadline: new Date(now - 1 * 864e5), project: p2._id },
    { title: "Push notifications", assignedTo: member._id, status: "In Progress", deadline: new Date(now + 10 * 864e5), project: p2._id },
  ]);

  console.log("Seeded ✔");
  console.log("  harshith.admin@teamtask.io   / SecurePass@2025!  (admin)");
  console.log("  priya.member@teamtask.io     / SecurePass@2025!  (member)");
  console.log("  rahul.dev@teamtask.io        / SecurePass@2025!  (member)");
  process.exit(0);
})();
