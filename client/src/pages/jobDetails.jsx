import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!resumeFile) return alert("Please choose a resume file");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const uploadRes = await api.post("/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resumeUrl = uploadRes.data.url;

      await api.post(`/jobs/${id}/apply`, { resumeUrl });
      setMsg("Applied successfully!");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to apply");
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2 className="page-title">{job.title}</h2>
      <p style={{ marginBottom: "8px", color: "#555" }}>
        {job.company} • {job.location}
      </p>
      <p style={{ marginBottom: "8px" }}>{job.description}</p>
      <p style={{ marginBottom: "16px", fontSize: "14px", color: "#555" }}>
        Skills: {job.skills?.join(", ")}
      </p>

      {user?.role === "jobseeker" && (
        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(15,23,42,0.08)",
            maxWidth: "400px",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Apply</h3>
          <input
            type="file"
            onChange={(e) => setResumeFile(e.target.files[0])}
            style={{ marginBottom: "10px" }}
          />
          <br />
          <button className="btn btn-primary" onClick={handleApply}>
            Apply
          </button>
          {msg && (
            <p style={{ marginTop: "10px", fontSize: "14px" }}>{msg}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;
