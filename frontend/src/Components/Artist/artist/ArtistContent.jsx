import React, { useState, useEffect } from "react";
import "./ArtistContent.css";
import ArtistSidebar from "./sidebar/ArtistSidebar";
import { ThreeDot } from "react-loading-indicators"; // Import the loader
import ArtistHeader from "./header/ArtistHeader";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../authContext";
import { useRef } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ArtistContent = ({ artistId }) => {
  const fileInputRef = useRef(null); // Create a ref for the file input
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [uploadedContent, setUploadedContent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewFileType, setPreviewFileType] = useState("");
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [fullPreviewFile, setFullPreviewFile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    console.log("Current User:", currentUser);
    if (currentUser) {
      fetchArtistContent();
    }
  }, [currentUser]);

  const fetchArtistContent = () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "artistContent"),
        where("artistId", "==", currentUser.uid),
        // orderBy("timestamp", "desc") // Order by timestamp descending
      );

      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const contentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUploadedContent(contentList);
        setLoading(false);
      });

      // Cleanup listener on component unmount
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching content:", error);
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    // Restrict file size to 5MB (for example)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert(
        "File size exceeds the limit of 5MB. Please select a smaller file."
      );
      return;
    }
    try {
      const base64File = await convertToBase64(file);
      setPreviewFile(base64File);
      setPreviewFileType(file.type.startsWith("video") ? "video" : "image");
      setHasInteracted(true);
    } catch (error) {
      console.error("Error converting file to Base64:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("artist-drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("artist-drag-over");
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("artist-drag-over");
    const file = e.dataTransfer.files[0];
    // Restrict file size to 5MB (for example)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert(
        "File size exceeds the limit of 5MB. Please select a smaller file."
      );
      return;
    }
    try {
      const base64File = await convertToBase64(file);
      setPreviewFile(base64File);
      setPreviewFileType(file.type.startsWith("video") ? "video" : "image");
      setHasInteracted(true);
    } catch (error) {
      console.error("Error converting file to Base64:", error);
    }
  };
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("artist-modal-overlay")) {
      if (hasInteracted) {
        setShowConfirmation(true);
      } else {
        closeModal();
      }
    }
  };

  const handleNext = () => {
    setShowDetailsForm(true);
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    try {
      const caption = e.target.caption.value;
      const location = e.target.location.value;
      const tags = e.target.tags.value;

      const newContent = {
        fileUrl: previewFile, // Save Base64 string
        type: previewFileType,
        caption,
        location,
        tags,
        artistId: currentUser.uid,
        timestamp: serverTimestamp(), // Use serverTimestamp
      };

      const docRef = await addDoc(collection(db, "artistContent"), newContent);
      // Update local state immediately for a smoother user experience
      setUploadedContent([
        { id: docRef.id, ...newContent },
        ...uploadedContent,
      ]);
      closeModal();
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "artistContent", selectedItem.id));
      setUploadedContent(
        uploadedContent.filter((content) => content.id !== selectedItem.id)
      );
      setShowFullPreview(false);
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPreviewFile(null);
    setShowDetailsForm(false);
    setHasInteracted(false);
  };

  const handleDiscard = () => {
    closeModal();
    setShowConfirmation(false);
  };

  const handleCancelDiscard = () => {
    setShowConfirmation(false);
  };

  const closeFullPreview = () => {
    setShowFullPreview(false);
    setFullPreviewFile(null);
  };
  const handleFullPreview = (item) => {
    setFullPreviewFile(item);
    setSelectedItem(item);
    setShowFullPreview(true);
  };

  return (
    <div className="artist-content">
      <ArtistSidebar />
      <div className="artist-main-content">
        <ArtistHeader />
        <div className="artist-content-section">
          <h3 className="artist-content-header">Manage Content</h3>
          {/* Loader */}
          {loading && (
            <div style={styles.overlay}>
              <div style={styles.loaderContainer}>
                <ThreeDot color="#212ea0" size="small" />
              </div>
            </div>
          )}
          <div className="artist-content-grid">
            {uploadedContent.length > 0 ? (
              uploadedContent.map((item, index) => (
                <div
                  key={index}
                  className="artist-content-item"
                  onClick={() => handleFullPreview(item)}
                >
                  {item.type === "video" ? (
                    <div className="video-overlay-container">
                      <video
                        src={item.fileUrl}
                        className="artist-grid-item"
                        muted
                      />
                      <div className="video-play-overlay">
                        <i className="fas fa-play-circle"></i>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.fileUrl}
                      alt="Uploaded"
                      className="artist-grid-item"
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No content uploaded yet.</p>
            )}
          </div>
          <FaPlus
            className="artist-upload-content-icon"
            size={40}
            onClick={() => setShowModal(true)}
          />
          {showModal && (
            <div className="artist-modal-overlay" onClick={handleOutsideClick}>
              <div
                className="artist-modal-content"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!showDetailsForm && previewFile ? (
                  <>
                    <div className="artist-preview-container">
                      <div className="artist-top-bar">
                        <button
                          className="artist-nav-button artist-left-button"
                          onClick={() => setPreviewFile(null)}
                        >
                          <FaArrowLeft />
                        </button>
                        <span className="artist-crop-title">Preview</span>
                        <button
                          className="artist-nav-button artist-right-button"
                          onClick={handleNext}
                        >
                          Next
                        </button>
                      </div>
                      <div className="artist-image-preview-container">
                        {previewFileType === "video" ? (
                          <video
                            src={previewFile}
                            className="artist-image-preview"
                            controls
                          />
                        ) : (
                          <img
                            src={previewFile}
                            alt="Preview"
                            className="artist-image-preview"
                          />
                        )}
                      </div>
                    </div>
                  </>
                ) : showDetailsForm ? (
                  <>
                    <div className="artist-preview-container">
                      <div className="artist-top-detail-bar">
                        <button
                          className="artist-nav-button artist-left-button"
                          onClick={() => setShowDetailsForm(false)}
                        >
                          <FaArrowLeft />
                        </button>
                        <span className="artist-detail-title">Add Details</span>
                      </div>
                      <form
                        className="artist-details-form"
                        onSubmit={handleSaveContent}
                      >
                        <label>Caption:</label>
                        <input
                          type="text"
                          name="caption"
                          placeholder="Add a caption"
                          required
                        />
                        <label>Location:</label>
                        <input
                          type="text"
                          name="location"
                          placeholder="Add a location"
                        />
                        <label>Tags:</label>
                        <input
                          type="text"
                          name="tags"
                          placeholder="Add tags (comma separated)"
                        />
                        <button className="artist-save-button" type="submit">
                          Save
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div
                    className="artist-drop-zone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <p>Drag photos and videos here</p>
                    <label className="artist-file-select-btn">
                      Select from computer
                      <input
                        type="file"
                        name="file"
                        ref={fileInputRef} // Attach the ref to the input
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
          {showFullPreview && (
            <div className="artist-modal-overlay" onClick={closeFullPreview}>
              <div className="artist-full-preview-modal">
                {fullPreviewFile.type === "video" ? (
                  <video
                    src={fullPreviewFile.fileUrl}
                    className="artist-full-preview-image"
                    controls
                  />
                ) : (
                  <img
                    src={fullPreviewFile.fileUrl}
                    alt="Full Preview"
                    className="artist-full-preview-image"
                  />
                )}
                <div className="artist-preview-controls">
                  <button
                    className="artist-delete-button"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {showConfirmation && (
            <div className="artist-confirmation-overlay">
              <div className="artist-confirmation-content">
                <h3>Discard Changes?</h3>
                <p>If you leave, your changes will be discarded.</p>
                <div className="artist-confirmation-buttons">
                  <button
                    className="artist-discard-button"
                    onClick={handleDiscard}
                  >
                    Discard
                  </button>
                  <br />
                  <button
                    className="artist-cancel-button"
                    onClick={handleCancelDiscard}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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

export default ArtistContent;
