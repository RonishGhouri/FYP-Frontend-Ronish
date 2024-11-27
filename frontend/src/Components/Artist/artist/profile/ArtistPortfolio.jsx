import React from "react";
import { useState, useEffect } from "react";

import {FaPencilAlt, FaPlus} from "react-icons/fa"
import "./ArtistPortfolio.css";

const ArtistPortfolio = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const storedCertificates = localStorage.getItem("certificates");
    if (storedCertificates) {
      setPortfolioData({ certificates: JSON.parse(storedCertificates) });
    }
  }, []);
  const handleAddCertificate = () => {
    setIsEditing(false);
    setNewCertificate({ name: "", org: "", date: "", url: "" });
    setShowModal(true);
  };
  const handleEditCertificate = () => {
    setIsEditing(true); // Set to true to indicate editing mode
    setShowModal(true); // Show modal
  };

  const handleFileUpload = (files) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file); // Create URL for preview
    setNewCertificate({ ...newCertificate, url: fileUrl });
    const updatedCertificates = [...portfolioData.certificates];
    const newErrors = [];

    Array.from(files).forEach((file) => {
      // Check for file size
      if (file.size > maxFileSize) {
        newErrors.push(
          `${file.name} exceeds the maximum size of ${(
            maxFileSize /
            1024 /
            1024
          ).toFixed(2)}MB.`
        );
        return;
      }

      // Check for valid file types
      if (!acceptedFileTypes.includes(file.type)) {
        newErrors.push(
          `${
            file.name
          } is not an accepted format. Allowed formats: ${acceptedFileTypes.join(
            ", "
          )}`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        updatedCertificates.push({
          name: file.name,
          type: file.type,
          url: reader.result,
        });
        setPortfolioData({ certificates: updatedCertificates });
      };
      reader.readAsDataURL(file);
    });

    setErrors(newErrors);
  };

  const [newCertificate, setNewCertificate] = useState({
    name: "",
    org: "",
    date: "",
    url: "",
  });

  const handleSaveCertificate = () => {
    if (isEditing) {
      const updatedCertificates = [...portfolioData.certificates];
      updatedCertificates[currentCertificate] = newCertificate; // Update existing certificate
      setPortfolioData({ certificates: updatedCertificates });
    } else {
      // Add new certificate
      setPortfolioData({
        certificates: [...portfolioData.certificates, newCertificate],
      });
    }
    setShowModal(false); // Close modal after saving
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (errors.length === 0) {
      localStorage.setItem(
        "certificates",
        JSON.stringify(portfolioData.certificates)
      );
      alert("Portfolio updated and saved successfully!");
    } else {
      alert("Please resolve the errors before saving.");
    }
  };

  const handleDeleteCertificate = (indexToDelete) => {
    const updatedCertificates = portfolioData.certificates.filter(
      (_, index) => index !== indexToDelete
    );
    setPortfolioData({ certificates: updatedCertificates });
    setShowModal(false); // Close modal after deletion
  };
  const [portfolioData, setPortfolioData] = useState({
    certificates: [
      {
        id: 1,
        name: "Certificate of Participation",
        org: "Google Developer Student Clubs",
        date: "Apr 2024",
        url: "certificate-url.png", // Placeholder for certificate icon/image
      },
      {
        id: 2,
        name: "Certificate for Teaching Assistantship",
        org: "Forman Christian College",
        date: "Feb 2024",
        url: "certificate-url2.png", // Placeholder for certificate icon/image
      },
    ],
  });
  return (
    <div className="profile-section">
      <h2>Artist Portfolio</h2>
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
                onClick={() => setSelectedCertificate(cert)}
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
      {selectedCertificate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Certificate Details</h3>
            <div className="cert-details">
              <p>
                <strong>Certificate Name:</strong> {selectedCertificate.name}
              </p>
              <p>
                <strong>Issued By:</strong> {selectedCertificate.org}
              </p>
              <p>
                <strong>Issued Date:</strong> {selectedCertificate.date}
              </p>
              {selectedCertificate.fileUrl && (
                <p>
                  <strong>View/Download Certificate:</strong>{" "}
                  <a
                    href={selectedCertificate.fileUrl}
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
