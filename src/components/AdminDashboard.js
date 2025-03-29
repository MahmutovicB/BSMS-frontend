import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    // <div className="container mt-4">
    //   <div className="card p-4 shadow">
    //     <h2 className="text-center">Admin Panel</h2>
    //     <button className="btn btn-secondary mb-3" onClick={handleLogout}>Logout</button>
    //     <table className="table table-striped">
    //       <thead>
    //         <tr>
    //           <th>Ime</th>
    //           <th>Telefon</th>
    //           <th>Usluga</th>
    //           <th>Datum</th>
    //           <th>Vrijeme</th>
    //           <th>Akcija</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {appointments.map((app) => (
    //           <tr key={app._id}>
    //             <td>{app.name}</td>
    //             <td>{app.phone}</td>
    //             <td>{app.service}</td>
    //             <td>{app.date}</td>
    //             <td>{app.time}</td>
    //             <td>
    //               <button className="btn btn-danger btn-sm" onClick={() => deleteAppointment(app._id)}>Obriši</button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>

    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2 className="text-center">Admin Panel</h2>
        <button className="btn btn-secondary mb-3" onClick={handleLogout}>Logout</button>

        {/* Kalendar */}
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName} 
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
  );
};

export default AdminDashboard;
