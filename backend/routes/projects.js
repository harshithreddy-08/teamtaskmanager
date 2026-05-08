const router = require("express").Router();
const c = require("../controllers/projectController");
const { protect, requireRole } = require("../middleware/auth");

router.use(protect);
router.get("/", c.list);
router.post("/", requireRole("admin"), c.create);
router.put("/:id", requireRole("admin"), c.update);
router.delete("/:id", requireRole("admin"), c.remove);

module.exports = router;
