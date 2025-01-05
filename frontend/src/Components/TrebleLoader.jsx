// import React from "react";
// import "./SpinnerLoader.css";
// import Image1 from "../assets/b.png"; // Path to your first icon
// import Image2 from "../assets/p.png"; // Path to your second icon

// function SpinnerLoader() {
//   return (
//     <div className="loader-container">
//       <div className="loader-ring">
//         <img src={Image1} alt="Front Icon" className="loader-image loader-front" />
//         <img src={Image2} alt="Back Icon" className="loader-image loader-back" />
//       </div>
//     </div>
//   );
// }

// export default SpinnerLoader;

import React from "react";
import "./TrebleLoader.css";

const TrebleLoader = () => {
  return (
    <div className="spinner-container">
      <div className="treble clef1">🎼</div>
      <div className="treble clef2">🎼</div>
      <div className="treble clef3">🎼</div>
    </div>
  );
};

export default TrebleLoader;
