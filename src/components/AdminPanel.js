import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Greška pri učitavanju termina:", error);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      setAppointments(appointments.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Greška pri brisanju termina:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2 className="text-center">Lista Rezervacija</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Ime</th>
              <th>Telefon</th>
              <th>Usluga</th>
              <th>Datum</th>
              <th>Vrijeme</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.phone}</td>
                <td>{app.service}</td>
                <td>{app.date}</td>
                <td>{app.time}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteAppointment(app._id)}>
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
