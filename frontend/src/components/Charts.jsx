// Simple chart components for dashboard visualization
// No external library needed - using CSS for simple bar charts

export function TaskStatusChart({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "Done").length;

  const stats = [
    { label: "Done", value: done, color: "bg-emerald-500", percent: total > 0 ? (done / total * 100) : 0 },
    { label: "In Progress", value: inProgress, color: "bg-blue-500", percent: total > 0 ? (inProgress / total * 100) : 0 },
    { label: "Pending", value: pending, color: "bg-amber-500", percent: total > 0 ? (pending / total * 100) : 0 },
    { label: "Overdue", value: overdue, color: "bg-rose-500", percent: total > 0 ? (overdue / total * 100) : 0 },
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 text-lg font-semibold">Task Status Distribution</h2>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{stat.label}</span>
              <span className="text-sm font-bold text-slate-900">{stat.value} ({Math.round(stat.percent)}%)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${stat.color} transition-all`}
                style={{ width: `${stat.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectProgressChart({ projects, tasks }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 text-lg font-semibold">Project Progress</h2>
      <div className="space-y-4">
        {projects.map((project) => {
          const projectTasks = tasks.filter((t) => t.project?._id === project._id);
          const completedTasks = projectTasks.filter((t) => t.status === "Done").length;
          const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length * 100) : 0;

          return (
            <div key={project._id}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{project.title}</span>
                <span className="text-sm font-bold text-slate-900">{completedTasks}/{projectTasks.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-500">{Math.round(progress)}% complete</span>
            </div>
          );
        })}
        {projects.length === 0 && <p className="text-sm text-slate-500">No projects yet</p>}
      </div>
    </div>
  );
}

export function TaskPriorityChart({ tasks }) {
  const high = tasks.filter((t) => t.priority === "High").length;
  const medium = tasks.filter((t) => t.priority === "Medium").length;
  const low = tasks.filter((t) => t.priority === "Low").length;
  const total = tasks.length;

  const stats = [
    { label: "High", value: high, color: "bg-rose-500", percent: total > 0 ? (high / total * 100) : 0 },
    { label: "Medium", value: medium, color: "bg-amber-500", percent: total > 0 ? (medium / total * 100) : 0 },
    { label: "Low", value: low, color: "bg-emerald-500", percent: total > 0 ? (low / total * 100) : 0 },
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 text-lg font-semibold">Task Priority Distribution</h2>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{stat.label}</span>
              <span className="text-sm font-bold text-slate-900">{stat.value}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${stat.color} transition-all`}
                style={{ width: `${stat.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeamWorkloadChart({ tasks, users }) {
  const userTaskCount = {};
  tasks.forEach((task) => {
    const userId = task.assignedTo?._id;
    if (userId) {
      userTaskCount[userId] = (userTaskCount[userId] || 0) + 1;
    }
  });

  const userStats = users.map((user) => ({
    name: user.name,
    tasks: userTaskCount[user._id] || 0,
  })).sort((a, b) => b.tasks - a.tasks).slice(0, 5);

  const maxTasks = Math.max(...userStats.map((u) => u.tasks), 1);

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 text-lg font-semibold">Team Workload</h2>
      <div className="space-y-3">
        {userStats.map((stat) => (
          <div key={stat.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-slate-700">{stat.name}</span>
              <span className="text-sm font-bold text-slate-900">{stat.tasks} tasks</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-purple-500 transition-all"
                style={{ width: `${(stat.tasks / maxTasks) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
        {userStats.length === 0 && <p className="text-sm text-slate-500">No tasks assigned yet</p>}
      </div>
    </div>
  );
}
