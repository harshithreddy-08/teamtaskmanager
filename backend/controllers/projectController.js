const Project = require("../models/Project");
const Task = require("../models/Task");

exports.list = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { members: req.user._id };
  const projects = await Project.find(filter)
    .populate("members", "name email role")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  res.json(projects);
};

exports.create = async (req, res) => {
  const { title, description, members } = req.body;
  if (!title) return res.status(400).json({ message: "title required" });
  const project = await Project.create({
    title,
    description: description || "",
    members: members || [],
    createdBy: req.user._id,
  });
  const populated = await project.populate("members", "name email role");
  res.status(201).json(populated);
};

exports.update = async (req, res) => {
  const { title, description, members } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Not found" });
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (members !== undefined) project.members = members;
  await project.save();
  const populated = await project.populate("members", "name email role");
  res.json(populated);
};

exports.remove = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Not found" });
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ message: "Deleted" });
};
