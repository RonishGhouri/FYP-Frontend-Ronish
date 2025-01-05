import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc} from "firebase/firestore";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import "./ArtistPortfolio.css";
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

const ArtistPortfolio = () => {
  const { currentUser } = useAuth(); // Get the authenticated user
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [portfolioData, setPortfolioData] = useState({
    certificates: [],
    instagramLink: "",
    facebookLink: "",
    youtubeLink: "",
  });

  const [newCertificate, setNewCertificate] = useState({
    name: "",
    org: "",
    date: "",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch portfolio data from Firestore
    const fetchPortfolioData = async () => {
      if (!currentUser) return;

      setLoading(true);
      setLoadings(true);
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
        setLoadings(false);
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

  const handleSetCertificate = async () => {
    let updatedCertificates;
    if (isEditing) {
      updatedCertificates = [...portfolioData.certificates];
      updatedCertificates[selectedCertificate] = newCertificate;
    } else {
      updatedCertificates = [...portfolioData.certificates, newCertificate];
    }

    const updatedPortfolio = {
      ...portfolioData,
      certificates: updatedCertificates,
    };
    setPortfolioData(updatedPortfolio);
    setShowModal(false);
  };

  const handleDeleteCertificate = async (indexToDelete) => {
    try {
      const updatedCertificates = portfolioData.certificates.filter(
        (_, index) => index !== indexToDelete
      );

      const updatedPortfolio = {
        ...portfolioData,
        certificates: updatedCertificates,
      };
      setPortfolioData(updatedPortfolio);

      const docRef = doc(db, "portfolios", currentUser.uid);
      await setDoc(docRef, updatedPortfolio, { merge: true });
    } catch (error) {
      console.error("Error deleting certificate:", error);
      setError("Failed to delete certificate. Please try again.");
    }
  };

  const handleSaveChanges = async () => {
    setLoadings(true);
    if (!currentUser) {
      setError("No authenticated user found. Please log in.");
      return;
    }

    try {
      // Reference to the document in Firestore using the user's UID
      const docRef = doc(db, "portfolios", currentUser.uid);

      // Save the updated portfolioData to Firestore
      await setDoc(docRef, portfolioData, { merge: true });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving portfolio data:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoadings(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64File = await convertToBase64(file); // Convert file to Base64
        setNewCertificate((prev) => ({ ...prev, url: base64File }));
      } catch (error) {
        console.error("Error converting file to Base64:", error);
        setError("Failed to process the file. Please try again.");
      }
    }
  };

  // Helper function to convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // Resolve with Base64 string
      reader.onerror = (error) => reject(error); // Reject on error
    });
  };

  const handleBase64Download = (e, index) => {
    e.preventDefault();

    const certificate = portfolioData.certificates[index];
    const base64Data = certificate.url;
    const fileName = certificate.name || "certificate";

    // Determine the file type from Base64 data
    const mimeType = base64Data.substring(
      base64Data.indexOf(":") + 1,
      base64Data.indexOf(";")
    );

    // Create a download link
    const link = document.createElement("a");
    link.href = base64Data; // Base64 file data
    link.download = `${fileName}.${mimeType.split("/")[1]}`; // Set file name and extension
    link.click();
  };

  return (
    <div className="profile-section">
      <h2>Artist Portfolio</h2>
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.loaderContainer}>
            <ThreeDot
              color="#212ea0" // Loader color
              size="small" // Loader size
            />
          </div>
        </div>
      )}
      {/* Portfolio Link */}
      <div className="form-section">
        <label>Instagram</label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter your instagram account link"
          value={portfolioData.instagramLink}
          onChange={(e) =>
            setPortfolioData({
              ...portfolioData,
              instagramLink: e.target.value,
            })
          }
        />
      </div>

      {/* Social Links */}
      <div className="form-section">
        <label>Facebook</label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter your facebook account link"
          value={portfolioData.facebookLink}
          onChange={(e) =>
            setPortfolioData({ ...portfolioData, facebookLink: e.target.value })
          }
        />
      </div>
      {/* Social Links */}
      <div className="form-section">
        <label>Youtube</label>
        <input
          type="text"
          className="form-input"
          placeholder="Enter your youtube channel link"
          value={portfolioData.youtubeLink}
          onChange={(e) =>
            setPortfolioData({ ...portfolioData, youtubeLink: e.target.value })
          }
        />
      </div>
      {/* Certifications Section */}
      <div className="certification-section">
        <div className="certification-header">
          <h3>Licenses & certifications</h3>
          <div className="certification-actions">
            <button
              className="add-certification"
              onClick={handleAddCertificate}
            >
              <FaPlus />
            </button>
            <button
              className="edit-certification"
              onClick={handleEditCertificate}
            >
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

      

      {/* Only one Save Button at the bottom */}
      <div className="form-section">
        <button
          type="submit"
          className="save-button"
          onClick={handleSaveChanges}
        >
          {loadings ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)} // Close modal when clicking on overlay
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent modal content clicks from closing modal
          >
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
                    onClick={() => {
                      handleSetCertificate(); // Call the save function
                      setShowModal(false); // Close the modal after saving
                    }}
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
                <strong>Certificate Name:</strong>{" "}
                {portfolioData.certificates[selectedCertificate]?.name}
              </p>
              <p>
                <strong>Issued By:</strong>{" "}
                {portfolioData.certificates[selectedCertificate]?.org}
              </p>
              <p>
                <strong>Issued Date:</strong>{" "}
                {portfolioData.certificates[selectedCertificate]?.date}
              </p>
              {portfolioData.certificates[selectedCertificate]?.url && (
                <p>
                  <strong>View/Download Certificate:</strong>{" "}
                  <a
                    href={portfolioData.certificates[selectedCertificate]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) =>
                      handleBase64Download(e, selectedCertificate)
                    }
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

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Grey transparent background
    zIndex: 9999, // Ensure the loader appears above everything else
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "none",
    padding: "20px 40px",
    borderRadius: "8px", // Rounded corners for the popup
  },
};

export default ArtistPortfolio;
