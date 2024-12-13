import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import "./ArtistPortfolio.css";

const ArtistPortfolio = () => {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [portfolioData, setPortfolioData] = useState({ certificates: [] });
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    org: "",
    date: "",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch portfolio data from Firestore
    const fetchPortfolioData = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const docRef = doc(db, "portfolios", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPortfolioData(docSnap.data());
        } else {
          console.log("No portfolio data found!");
        }
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setError("Failed to fetch portfolio data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [currentUser]);

  const handleAddCertificate = () => {
    setIsEditing(false);
    setNewCertificate({ name: "", org: "", date: "", url: "" });
    setShowModal(true);
  };

  const handleEditCertificate = () => {
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveCertificate = async () => {
    try {
      let updatedCertificates;
      if (isEditing) {
        updatedCertificates = [...portfolioData.certificates];
        updatedCertificates[selectedCertificate] = newCertificate;
      } else {
        updatedCertificates = [...portfolioData.certificates, newCertificate];
      }

      const updatedPortfolio = { ...portfolioData, certificates: updatedCertificates };
      setPortfolioData(updatedPortfolio);

      const docRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(docRef, updatedPortfolio, { merge: true });
      setShowModal(false);
    } catch (error) {
      console.error("Error saving certificate:", error);
      setError("Failed to save certificate. Please try again.");
    }
  };

  const handleDeleteCertificate = async (indexToDelete) => {
    try {
      const updatedCertificates = portfolioData.certificates.filter(
        (_, index) => index !== indexToDelete
      );

      const updatedPortfolio = { ...portfolioData, certificates: updatedCertificates };
      setPortfolioData(updatedPortfolio);

      const docRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(docRef, updatedPortfolio, { merge: true });
    } catch (error) {
      console.error("Error deleting certificate:", error);
      setError("Failed to delete certificate. Please try again.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Generate a preview URL
      setNewCertificate((prev) => ({ ...prev, url: fileUrl }));
    }
  };

  return (
    <div className="profile-section">
      <h2>Artist Portfolio</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Portfolio Link */}
      <div className="form-section">
        <label>Portfolio Link</label>
        <input
          type="text"
          className="form-input"
          placeholder="Add external link to your portfolio"
        />
      </div>

      {/* Certifications Section */}
      <div className="certification-section">
        <div className="certification-header">
          <h3>Licenses & certifications</h3>
          <div className="certification-actions">
            <button className="add-certification" onClick={handleAddCertificate}>
              <FaPlus />
            </button>
            <button className="edit-certification" onClick={handleEditCertificate}>
              <FaPencilAlt />
            </button>
          </div>
        </div>

        {/* Certificate List */}
        <ul className="certification-list">
          {portfolioData.certificates
            .slice(0, showAll ? portfolioData.certificates.length : 2)
            .map((cert, index) => (
              <li
                key={index}
                className="certification-item"
                onClick={() => setSelectedCertificate(index)}
              >
                <div className="cert-info">
                  <span className="cert-name">{cert.name}</span>
                  <span className="cert-org">Issued by {cert.org}</span>
                  <span className="cert-date">Issued {cert.date}</span>
                </div>
              </li>
            ))}
        </ul>

        {/* Show All Link */}
        <div className="show-all-link">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAll(!showAll);
            }}
          >
            {showAll
              ? "Show less licenses & certifications"
              : `Show all ${portfolioData.certificates.length} licenses & certifications`}
          </a>
        </div>
      </div>

      {/* Social Links */}
      <div className="form-section">
        <label>Social Links</label>
        <input
          type="text"
          className="form-input"
          placeholder="Add links to your social media accounts"
        />
      </div>

      {/* Only one Save Button at the bottom */}
      <div className="form-section">
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </div>

      {/* Modal for Add/Edit/Delete Certificates */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Conditional rendering based on add or edit mode */}
            <h3>{isEditing ? "Manage Certificates" : "Add Certificate"}</h3>

            {isEditing ? (
              <div>
                {/* Show list of certificates with delete buttons */}
                <ul className="certification-list">
                  {portfolioData.certificates.map((cert, index) => (
                    <li key={index} className="certification-item">
                      <div className="cert-info">
                        <span className="cert-name">{cert.name}</span>
                        <span className="cert-org">Issued by {cert.org}</span>
                        <span className="cert-date">Issued {cert.date}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCertificate(index)}
                        className="remove-button"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                {/* Add new certificate form */}
                <div className="form-section">
                  <label>Certificate Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCertificate.name}
                    onChange={(e) =>
                      setNewCertificate({
                        ...newCertificate,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-section">
                  <label>Issuing Organization</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCertificate.org}
                    onChange={(e) =>
                      setNewCertificate({
                        ...newCertificate,
                        org: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-section">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newCertificate.date}
                    onChange={(e) =>
                      setNewCertificate({
                        ...newCertificate,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-section">
                  <label>Upload Certificate (PDF/Image)</label>
                  <input
                    type="file"
                    className="form-input"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="form-section">
                  <button
                    onClick={handleSaveCertificate}
                    className="save-button"
                  >
                    Add Certificate
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for Viewing Certificate Details */}
      {selectedCertificate !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Certificate Details</h3>
            <div className="cert-details">
              <p>
                <strong>Certificate Name:</strong> {portfolioData.certificates[selectedCertificate]?.name}
              </p>
              <p>
                <strong>Issued By:</strong> {portfolioData.certificates[selectedCertificate]?.org}
              </p>
              <p>
                <strong>Issued Date:</strong> {portfolioData.certificates[selectedCertificate]?.date}
              </p>
              {portfolioData.certificates[selectedCertificate]?.url && (
                <p>
                  <strong>View/Download Certificate:</strong>{" "}
                  <a
                    href={portfolioData.certificates[selectedCertificate]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View or Download
                  </a>
                </p>
              )}
            </div>
            <button
              className="close-button"
              onClick={() => setSelectedCertificate(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistPortfolio;
