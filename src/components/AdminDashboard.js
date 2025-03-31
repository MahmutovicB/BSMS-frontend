import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const AdminDashboard = ({events}) => {
  const [appointments, setAppointments] = useState([]);
  const [calendarAppointments, setCalendarAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchAppointments = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin");
          return;
        }
  
        try {
          const response = await axios.get("http://localhost:5000/api/appointments", {
            headers: { "x-auth-token": token }
          });
          setAppointments(response.data);
          setCalendarAppointments(
            response.data.map(app => ({
            title: `${app.name} - ${app.service}`,
            start: new Date(app.date + " " + app.time),
            end: moment(new Date(app.date + " " + app.time)).add(0.5, "hour").toDate(),
          })));
        } catch (error) {
          console.error("Greška:", error);
          navigate("/admin");
        }
      };
  
      fetchAppointments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
    };


  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      setAppointments(appointments.filter((app) => app._id !== id));
      setCalendarAppointments(calendarAppointments.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Greška pri brisanju termina:", error);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const isBooked = appointments.some((app) => new Date(app.date).toDateString() === date.toDateString());
      return isBooked ? "booked" : "available";
    }
  };

  return (
    <div className="row">
    <div className="container mt-4 col-md-8">
      <div className="card p-4 shadow">
        <h2 className="text-center">Admin Panel</h2>
        <button className="btn btn-secondary mb-3" onClick={handleLogout}>Logout</button>

        <Calendar
          localizer={localizer}
          events={calendarAppointments}
          startAccessor="start"
          endAccessor="end"
          defaultView={currentView}
          style={{ height: 500 }}
          min={new Date(2025, 0, 1, 8, 0)} // Početak u 8:00 AM
          max={new Date(2025, 0, 1, 18, 0)} // Kraj u 5:00 PM
          formats={{
            dayFormat: (date, culture, localizer) =>
              localizer.format(date, "DD.", culture), // Prikazuje samo dan npr. "04."
          }}
          views={["month", "week", "day"]} // Omogućava prebacivanje između prikaza
          onView={(view) => setCurrentView(view)} 
          
        />

        <table className="table table-striped mt-4">
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
                <td>{new Date(app.date).toLocaleDateString()}</td>
                <td>{app.time}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteAppointment(app._id)}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stilizacija za zauzete i slobodne termine */}
      <style>
        {`
          .booked { background-color: #ffcccc !important; } /* Crveno za zauzete termine */
          .available { background-color: #ccffcc !important; } /* Zeleno za slobodne termine */
        `}
      </style>
    </div>
    </div>
  );
};

export default AdminDashboard;
