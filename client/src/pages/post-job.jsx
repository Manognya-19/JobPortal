// client/src/pages/PostJob.jsx
import { useState } from "react";
import api from "../utils/api";

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    skills: "",
    description: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      };
      await api.post("/jobs", payload);
      setMsg("Job posted successfully!");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div>
      <h2>Post a Job</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
        />
        <br />
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />
        <br />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <br />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
        />
        <br />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostJob;
