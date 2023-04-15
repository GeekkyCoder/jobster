const express = require("express");

const router = express.Router();
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
} = require("../controllers/jobs");
const testUserAuth = require("../middleware/testUserAuth");

router.route("/").post(testUserAuth, createJob).get(getAllJobs);

router
  .route("/:id")
  .get(getJob)
  .delete(testUserAuth, deleteJob)
  .patch(testUserAuth, updateJob);

module.exports = router;
