import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { db } from "../../firebaseConfig"; // Firestore configuration
import { doc, getDoc } from "firebase/firestore";
import "./ArtistDashboard.css";
import ArtistSidebar from "./sidebar/ArtistSidebar";
import ArtistHeader from "./header/ArtistHeader";

ChartJS.register(ArcElement, Tooltip, Legend);

const ArtistDashboard = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [incomeData, setIncomeData] = useState({
    total: 15480,
    crowdfunding: 60,
    donations: 24,
    tickets: 16,
  });

  const [artistRating, setArtistRating] = useState({
    rating: 0,
    reviews: 0,
    excellent: 0,
    average: 0,
    bad: 0,
  });

  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const [events] = useState([
    {
      date: "08 June",
      title: "A Chorus of Beauty and Menace",
      location: "Brooklyn, New York",
      time: "7:00 PM - 9:00 PM",
    },
    {
      date: "15 July",
      title: "23rd Biennale of Miami",
      location: "Miami, Florida",
      time: "2:30 PM - 4:00 PM",
    },
    {
      date: "27 July",
      title: "The Sign, The Line and The Color",
      location: "Yantis, Texas",
      time: "10:00 AM - 2:00 PM",
    },
  ]);

  const [recentActivity] = useState([
    {
      type: "Booking",
      message: "Booking confirmed for A Chorus of Beauty and Menace",
      date: "08 June",
    },
    {
      type: "Payment",
      message: "Payment received for Crowdfunding",
      date: "02 June",
    },
    {
      type: "Campaign",
      message: "Raised $1000 for Ghost Writer Campaign",
      date: "01 June",
    },
    {
      type: "Upload",
      message: "New video uploaded: My Journey as an Artist",
      date: "30 May",
    },
  ]);

  const navigate = useNavigate();

  const paymentData = {
    labels: ["Crowdfunding", "Donations", "Tickets"],
    datasets: [
      {
        label: "Payment Sources",
        data: [
          incomeData.crowdfunding,
          incomeData.donations,
          incomeData.tickets,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // This makes the chart responsive
    devicePixelRatio: window.devicePixelRatio || 1, // Ensures the chart uses the correct pixel ratio
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  useEffect(() => {
    const fetchArtistRating = async () => {
      try {
        const docRef = doc(db, "ratings", "artistIdPlaceholder"); // Replace 'artistIdPlaceholder' with dynamic artist ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setArtistRating({
            rating: data.overallRating || 0,
            reviews: data.totalReviews || 0,
            excellent: data.excellent || 0,
            average: data.average || 0,
            bad: data.bad || 0,
          });
        } else {
          console.log("No rating data found!");
        }
      } catch (error) {
        console.error("Error fetching artist rating:", error);
      }
    };

    fetchArtistRating();
  }, []);

  const openReviewsModal = () => {
    setShowReviewsModal(true);
  };

  const closeReviewsModal = () => {
    setShowReviewsModal(false);
  };

  // Helper to generate star rating with filled and hollow stars
  const generateStars = (rating) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

    return (
      <div className="stars-container">
        {Array(filledStars)
          .fill()
          .map((_, index) => (
            <span key={`filled-${index}`} className="star filled">★</span>
          ))}
        {halfStar && <span className="star half">★</span>}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <span key={`empty-${index}`} className="star empty">★</span>
          ))}
      </div>
    );
  };

  return (
    <div className="artist-dashboard">
      <ArtistSidebar />
      <div className="artist-main-dashboard">
        <ArtistHeader />

        {/* Earnings and Payment History Section with Pie Chart */}
        <div className="artist-stats-grid">
          <div className="artist-card artist-combined-earnings">
            <div className="artist-earnings-overview">
              <h4>Total Earnings</h4>
              <p>${incomeData.total}</p>
              <div className="artist-earnings-breakdown">
                <p>Crowdfunding: {incomeData.crowdfunding}%</p>
                <p>Donations: {incomeData.donations}%</p>
                <p>Tickets: {incomeData.tickets}%</p>
              </div>
              <div className="artist-rating">
                <h4>Artist Rating: {artistRating.rating}/5</h4>
                {generateStars(artistRating.rating)}
                <p
                  className="reviews-link"
                  onClick={openReviewsModal}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Based on {artistRating.reviews} reviews
                </p>
              </div>
            </div>
            <div className="artist-payment-history">
              <h4>Payment Breakdown</h4>
              <div className="chart-container">
                <Pie data={paymentData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="artist-card artist-recent-activity">
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
        <div className="artist-events-section">
          <h4>Upcoming Events</h4>
          <div className="artist-events-grid">
            {events.map((event, index) => (
              <div key={index} className="artist-event-card">
                <h5>{event.date}</h5>
                <p>{event.title}</p>
                <p>{event.location}</p>
                <p>{event.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Review Breakdown</h3>
            <p>Excellent: {artistRating.excellent}</p>
            <p>Average: {artistRating.average}</p>
            <p>Bad: {artistRating.bad}</p>
            <button onClick={closeReviewsModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
