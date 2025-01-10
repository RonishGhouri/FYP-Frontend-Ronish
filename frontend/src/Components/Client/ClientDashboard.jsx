import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./ClientDashboard.css";
import ClientSidebar from "./sidebar/ClientSidebar";
import ClientHeader from "./header/ClientHeader";

ChartJS.register(ArcElement, Tooltip, Legend);

const ClientDashboard = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [expenditureData, setExpenditureData] = useState({
    total: 12500,
    bookings: 65,
    platformFees: 20,
    reverse: 15,
  });

  const [events] = useState([
    {
      date: "22 August",
      title: "Wedding Ceremony",
      location: "Lahore, Pakistan",
      time: "5:00 PM - 10:00 PM",
    },
    {
      date: "10 September",
      title: "Corporate Gala",
      location: "Islamabad, Pakistan",
      time: "6:00 PM - 9:00 PM",
    },
  ]);

  const [recentActivity] = useState([
    { type: "Booking", message: "Booking confirmed for Wedding Ceremony", date: "22 August" },
    { type: "Payment", message: "Payment completed for Corporate Gala", date: "10 September" },
    { type: "Chat", message: "Message from artist: 'Looking forward to the event!'", date: "15 August" },
  ]);

  const navigate = useNavigate();

  const expenditureDataForChart = {
    labels: ["Bookings", "Platform Fees", "Reverve"],
    datasets: [
      {
        label: "Expenditure Sources",
        data: [expenditureData.bookings, expenditureData.serviceFees, expenditureData.reverse],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="client-dashboard">
      <ClientSidebar />
      <div className="client-main-dashboard">
        <ClientHeader />

        {/* Expenditure and Payment Methods Section with Pie Chart */}
        <div className="client-stats-grid">
          <div className="client-card client-combined-expenditure">
            <div className="client-expenditure-overview">
              <h4>Total Expenditure</h4>
              <p>Rs. {expenditureData.total}</p>
              <div className="client-expenditure-breakdown">
                <p>Bookings: {expenditureData.bookings}%</p>
                <p>Platform Fees: {expenditureData.serviceFees}%</p>
                <p>Reverse Amount: {expenditureData.donations}%</p>
              </div>
            </div>
            <div className="client-payment-methods">
              <h4>Expenditure Breakdown</h4>
              <div className="chart-container">
                <Pie data={expenditureDataForChart} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="client-card client-recent-activity">
            <h4>Recent Activity</h4>
            <ul className="activity-feed">
              {recentActivity.map((activity, index) => (
                <li key={index} className="activity-item">
                  <strong>{activity.type}</strong>: {activity.message} <em>({activity.date})</em>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Events Section */}
        <div className="client-events-section">
          <h4>Upcoming Events</h4>
          <div className="client-events-grid">
            {events.map((event, index) => (
              <div key={index} className="client-event-card">
                <h5>{event.date}</h5>
                <p>{event.title}</p>
                <p>{event.location}</p>
                <p>{event.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
