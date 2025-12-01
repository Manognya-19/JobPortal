// client/src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../utils/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const loadData = async () => {
    const [uRes, jRes] = await Promise.all([
      api.get("/admin/users"),
      api.get("/admin/jobs"),
    ]);
    setUsers(uRes.data);
    setJobs(jRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    loadData();
  };

  const deleteJob = async (id) => {
    await api.delete(`/admin/jobs/${id}`);
    loadData();
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <h3>Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} ({u.email}) [{u.role}]{" "}
            <button onClick={() => deleteUser(u._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Jobs</h3>
      <ul>
        {jobs.map((j) => (
          <li key={j._id}>
            {j.title} @ {j.company}{" "}
            <button onClick={() => deleteJob(j._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
