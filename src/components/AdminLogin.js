import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", credentials);
  
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        console.error("No token received from API");
        setError("Neispravan odgovor servera");
      }
    } catch (error) {
      console.error("Login error:", error);
  
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("Greška pri povezivanju na server");
      }
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-center">Admin Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-control" value={credentials.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={credentials.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
