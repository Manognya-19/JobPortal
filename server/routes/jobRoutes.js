// server/routes/jobRoutes.js
const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// GET /api/jobs?title=&location=&skills=
router.get("/", async (req, res) => {
  const { title, location, skills } = req.query;
  const query = {};

  if (title) query.title = { $regex: title, $options: "i" };
  if (location) query.location = { $regex: location, $options: "i" };
  if (skills) {
    const arr = skills.split(",").map((s) => s.trim());
    query.skills = { $in: arr };
  }

  try {
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/jobs (recruiter/admin only)
router.post("/", protect, allowRoles("recruiter", "admin"), async (req, res) => {
  const { title, company, location, skills, description } = req.body;

  try {
    const job = await Job.create({
      title,
      company,
      location,
      skills,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/jobs/:id/apply (jobseeker only)
router.post(
  "/:id/apply",
  protect,
  allowRoles("jobseeker"),
  async (req, res) => {
    const { resumeUrl } = req.body;

    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });

      const application = await Application.create({
        job: job._id,
        applicant: req.user._id,
        resumeUrl,
      });

      res.status(201).json(application);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
