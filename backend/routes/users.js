const router = require("express").Router();
const { list } = require("../controllers/userController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", protect, requireRole("admin"), list);

module.exports = router;
