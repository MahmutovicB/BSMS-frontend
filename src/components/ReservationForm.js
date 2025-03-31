import React, { useState, useEffect } from "react";
import axios from "axios";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  ];

  useEffect(() => {
    if (formData.date) {
      fetchAppointments(formData.date);
    }
  }, [formData.date]);

  const fetchAppointments = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments?date=${date}`);
      setAppointments(response.data);
      generateAvailableTimes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Greška pri učitavanju termina:", error);
    }
  };

  const generateAvailableTimes = (bookedAppointments) => {
    const bookedTimes = bookedAppointments.map(app => app.time);
    
    const available = timeSlots.filter(time => {
      const timeIndex = timeSlots.indexOf(time);
      const prevTime = timeSlots[timeIndex - 1];
      const nextTime = timeSlots[timeIndex + 1];

      return !bookedTimes.includes(time);
    });

    setAvailableTimes(available);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSelect = (selectedTime) => {
    setFormData({ ...formData, time: selectedTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/appointments", formData);
      alert("Rezervacija uspješna!");
      setFormData({ name: "", phone: "", service: "", date: "", time: "" });
      fetchAppointments(formData.date); 
    } catch (error) {
      console.error("Greška pri rezervaciji:", error);
      alert("Došlo je do greške.");
    }
  };

  return (
    <div className="row">
    <div className="container mt-4 col-md-8">
      <div className="card p-4 shadow">
        <h2 className="text-center">Rezerviši Termin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Ime</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Telefon</label>
            <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
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
          
          {/* Dostupna vremena kao dugmad */}
          {formData.date && (
            <div className="mb-3">
              <label className="form-label">Odaberite vrijeme:</label>
              <div className="d-flex flex-wrap">
                {availableTimes.length > 0 ? (
                  availableTimes.map((time) => (
                    <button
                      type="button"
                      key={time}
                      className={`btn me-2 mb-2 ${formData.time === time ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="text-danger">Nema dostupnih termina.</p>
                )}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={!formData.time}>
            Rezerviši
          </button>
        </form>
      </div>
    </div>

    </div>
  );
};

export default ReservationForm;
