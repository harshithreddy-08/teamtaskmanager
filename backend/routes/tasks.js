const router = require("express").Router();
const c = require("../controllers/taskController");
const { protect, requireRole } = require("../middleware/auth");

router.use(protect);
router.get("/", c.list);
router.post("/", requireRole("admin"), c.create);
router.put("/:id", c.update); // controller enforces admin OR assignee
router.delete("/:id", requireRole("admin"), c.remove);

module.exports = router;
