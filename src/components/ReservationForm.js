import React, { useState } from "react";
import axios from "axios";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/appointments", formData);
      alert("Rezervacija uspješna!");
      setFormData({ name: "", phone: "", service: "", date: "", time: "" });
    } catch (error) {
      console.error(error);
      alert("Došlo je do greške.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2 className="text-center">Rezerviši Termin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Ime</label>
            <input type="text" name="name" className="form-control" placeholder="Unesite ime" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Telefon</label>
            <input type="text" name="phone" className="form-control" placeholder="Unesite broj telefona" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Usluga</label>
            <select name="service" className="form-select" value={formData.service} onChange={handleChange} required>
              <option value="">Izaberi uslugu</option>
              <option value="Šišanje">Šišanje</option>
              <option value="Brijanje">Brijanje</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Datum</label>
            <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Vrijeme</label>
            <input type="time" name="time" className="form-control" value={formData.time} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Rezerviši</button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
