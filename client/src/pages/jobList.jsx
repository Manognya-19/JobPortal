// client/src/pages/JobList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "../App.css"; // ensure CSS is applied

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    skills: "",
  });

  const getJobs = async () => {
    const params = {};
    if (filters.title) params.title = filters.title;
    if (filters.location) params.location = filters.location;
    if (filters.skills) params.skills = filters.skills;

    const res = await api.get("/jobs", { params });
    setJobs(res.data);
  };

  useEffect(() => {
    getJobs();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    getJobs();
  };

  return (
    <main className="main">
      <section className="search-card">
        <h1 className="page-title">Job Portal</h1>
        <p className="page-subtitle">
          Search jobs by title, location or skills.
        </p>

        {/* Search Form */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            name="title"
            placeholder="Title"
            value={filters.title}
            onChange={handleChange}
            className="search-input"
          />
          <input
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
            className="search-input"
          />
          <input
            name="skills"
            placeholder="Skills (comma separated)"
            value={filters.skills}
            onChange={handleChange}
            className="search-input"
          />

          <button type="submit" className="primary-btn search-btn">
            Search
          </button>
        </form>

        {/* Jobs List */}
        <div className="jobs-list">
          {jobs.length === 0 ? (
            <p style={{ marginTop: "20px", color: "#6b7280" }}>
              No jobs found. Try adjusting your filters.
            </p>
          ) : (
            jobs.map((job) => (
              <Link
                to={`/jobs/${job._id}`}
                key={job._id}
                className="job-card"
              >
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
                <p className="job-location">{job.location}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default JobList;
