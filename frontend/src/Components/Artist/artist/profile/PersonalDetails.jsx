import React, { useState, useEffect } from "react";
import { useAuth } from "../../../authContext"; // Use your authentication context
import { db } from "../../../firebaseConfig"; // Firestore configuration
import { doc, setDoc, getDoc } from "firebase/firestore";
import Select from "react-select"; // Import react-select
import makeAnimated from "react-select/animated"; // Import animations for react-select
import "./PersonalDetails.css"; // Import your CSS for styling
import { ThreeDot } from "react-loading-indicators"; // Import Atom loader
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

// Custom styles for react-select dropdowns
const customStyles = {
  control: (base) => ({
    ...base,
    width: 660,
    padding: 4,
    border: "1px solid #ddd",
    borderRadius: "9px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#0056b3",
    },
  }),
  menu: (base) => ({
    ...base,
    border: "1px solid #ddd",
    background: "white",
    borderRadius: "9px",
    width: 660,
    maxHeight: "200px",
    overflow: "visible",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }),
  menuList: (base) => ({
    ...base,
    border: "1px solid #ddd",
    borderRadius: "9px",
    maxHeight: "100px",
    overflowY: "scroll",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "10px",
      borderRadius: "10px",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#212ea0" : "#fff",
    color: state.isSelected ? "#fff" : "#000",
    "&:hover": {
      background: "linear-gradient(135deg, #2980b9, #8e44ad)",
      color: "white",
    },
    padding: 10,
  }),
};

const animatedComponents = makeAnimated();

function PersonalDetails() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [genreOptions, setGenreOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);

  const [personalDetails, setPersonalDetails] = useState({
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    category: "",
    genre: [],
    skills: [],
    preferredLanguage: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setLoadings(true);
      try {
        const genreRef = doc(db, "genre", "YkqOHp57YnOcswTNzEM9");
        const skillRef = doc(db, "skill", "dlzobO1Fkei3FCNPGG3f");

        const [genreSnap, skillSnap] = await Promise.all([
          getDoc(genreRef),
          getDoc(skillRef),
        ]);

        if (genreSnap.exists()) {
          const genreList = genreSnap.data().genrelist || [];
          setGenreOptions(
            genreList.map((item) => ({ label: item, value: item }))
          );
        }

        if (skillSnap.exists()) {
          const skillList = skillSnap.data().skillList || [];
          setSkillOptions(
            skillList.map((item) => ({ label: item, value: item }))
          );
        }
      } catch (err) {
        console.error("Error fetching options:", err);
      } finally {
        setLoading(false);
        setLoadings(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      if (!currentUser) return;
      setLoading(true);
      setLoadings(true);
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPersonalDetails({ email: currentUser.email, ...docSnap.data() });
        } else {
          setPersonalDetails((prev) => ({ ...prev, email: currentUser.email }));
        }
      } catch (err) {
        console.error("Error fetching personal details:", err);
      } finally {
        setLoading(false);
        setLoadings(false);
      }
    };

    fetchPersonalDetails();
  }, [currentUser]);

  const handleSelectChange = (selectedOption, actionMeta) => {
    setPersonalDetails({
      ...personalDetails,
      [actionMeta.name]: selectedOption,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value,
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoadings(true);

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, personalDetails, { merge: true });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving details:", err);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoadings(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Personal Details</h2>
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.loaderContainer}>
            <ThreeDot color="#212ea0" size="small" />
          </div>
        </div>
      )}

      <form onSubmit={handleSaveChanges}>
        <div className="form-section">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={personalDetails.email}
            className="form-input"
            readOnly
          />
        </div>

        <div className="form-section">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={personalDetails.phone}
            className="form-input"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={personalDetails.dateOfBirth}
            className="form-input"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <label>Gender</label>
          <select
            name="gender"
            value={personalDetails.gender}
            className="form-input"
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonBinary">Non-Binary</option>
          </select>
        </div>

        <div className="form-section">
          <label>Category</label>
          <select
            name="category"
            value={personalDetails.category}
            className="form-input"
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            <option value="singer">Singer</option>
            <option value="dj">Dj</option>
            <option value="band">Band</option>
            <option value="instrumentalist">Instrumentalist</option>
          </select>
        </div>

        {personalDetails.category !== "dj" && personalDetails.category !== "" && (
          <>
            <div className="form-section">
              <label>Genre</label>
              <Select
                isMulti
                name="genre"
                value={personalDetails.genre}
                options={genreOptions}
                onChange={handleSelectChange}
                components={animatedComponents}
                styles={customStyles}
                className="form-select"
                required
              />
            </div>

            <div className="form-section">
              <label>Skills</label>
              <Select
                isMulti
                name="skills"
                value={personalDetails.skills}
                options={skillOptions}
                onChange={handleSelectChange}
                components={animatedComponents}
                styles={customStyles}
                className="form-select"
                required
              />
            </div>
          </>
        )}

        <div className="form-section">
          <label>Preferred Language</label>
          <input
            type="text"
            name="preferredLanguage"
            value={personalDetails.preferredLanguage}
            className="form-input"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-section">
          <button type="submit" className="save-button" disabled={loadings}>
            {loadings ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 9999,
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
    borderRadius: "8px",
  },
};

export default PersonalDetails;
