import React, { useState } from "react";
import "./ArtistContent.css";
import ArtistSidebar from "./sidebar/ArtistSidebar";
import ArtistHeader from "./header/ArtistHeader";
import { FaPlus, FaArrowLeft } from "react-icons/fa";

const ArtistContent = () => {
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setPreviewFile(fileUrl);
    setPreviewFileType(file.type.startsWith("video") ? "video" : "image");
    setHasInteracted(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("artist-drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("artist-drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("artist-drag-over");
    const file = e.dataTransfer.files[0];
    const fileUrl = URL.createObjectURL(file);
    setPreviewFile(fileUrl);
    setPreviewFileType(file.type.startsWith("video") ? "video" : "image");
    setHasInteracted(true);
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

  const handleSaveContent = (e) => {
    e.preventDefault();
    const caption = e.target.caption.value;
    const location = e.target.location.value;
    const tags = e.target.tags.value;
    setUploadedContent([
      ...uploadedContent,
      { fileUrl: previewFile, type: previewFileType, caption, location, tags },
    ]);
    closeModal();
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

  const handleFullPreview = (item) => {
    setFullPreviewFile(item);
    setSelectedItem(item);
    setShowFullPreview(true);
  };

  const handleEdit = () => {
    setPreviewFile(selectedItem.fileUrl);
    setPreviewFileType(selectedItem.type);
    setShowFullPreview(false);
    setShowDetailsForm(false);
    setShowModal(true);
    setHasInteracted(true); // Set to true as we are entering edit mode
  };

  const handleDelete = () => {
    setUploadedContent(
      uploadedContent.filter((content) => content !== selectedItem)
    );
    setShowFullPreview(false);
  };

  const closeFullPreview = () => {
    setShowFullPreview(false);
    setFullPreviewFile(null);
  };

  return (
    <div className="artist-dashboard">
      <ArtistSidebar />
      <div className="artist-main-dashboard">
        <ArtistHeader />
        <div className="artist-content-section">
          <h3 className="artist-content-header">Manage Content</h3>
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
                  <button className="artist-edit-button" onClick={handleEdit}>
                    Edit
                  </button>
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
                  </button><br />
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

export default ArtistContent;
