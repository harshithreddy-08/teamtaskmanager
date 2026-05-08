const Task = require("../models/Task");
const Project = require("../models/Project");

exports.list = async (req, res) => {
  let filter = {};
  if (req.user.role !== "admin") {
    const projects = await Project.find({ members: req.user._id }).select("_id");
    filter = {
      $or: [
        { assignedTo: req.user._id },
        { project: { $in: projects.map((p) => p._id) } },
      ],
    };
  }
  if (req.query.project) filter.project = req.query.project;
  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("project", "title")
    .sort({ createdAt: -1 });
  res.json(tasks);
};

exports.create = async (req, res) => {
  const { title, description, assignedTo, status, deadline, project } = req.body;
  if (!title || !project) return res.status(400).json({ message: "title and project required" });
  const task = await Task.create({
    title,
    description: description || "",
    assignedTo: assignedTo || null,
    status: status || "Todo",
    deadline: deadline || null,
    project,
  });
  const populated = await task.populate([
    { path: "assignedTo", select: "name email" },
    { path: "project", select: "title" },
  ]);
  res.status(201).json(populated);
};

exports.update = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Not found" });

  const isAdmin = req.user.role === "admin";
  const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

  if (!isAdmin && !isAssignee) return res.status(403).json({ message: "Forbidden" });

  if (isAdmin) {
    const { title, description, assignedTo, status, deadline, project } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline;
    if (project !== undefined) task.project = project;
  } else {
    // members can only update status
    if (req.body.status) task.status = req.body.status;
  }
  await task.save();
  const populated = await task.populate([
    { path: "assignedTo", select: "name email" },
    { path: "project", select: "title" },
  ]);
  res.json(populated);
};

exports.remove = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Not found" });
  await task.deleteOne();
  res.json({ message: "Deleted" });
};
