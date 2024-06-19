import React from "react";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ terminate }) => {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="relative">
      <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50">
        <div
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          Play Game!
        </div>
        <div
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleNavigation("/leaderboard")}
        >
          Leaderboard
        </div>
        <div
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleNavigation("/gallery")}
        >
          Browse ZKSnake NFTs
        </div>
        <div
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleNavigation("/my-profile")}
        >
          View Profile
        </div>

        <a
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          href="https://github.com/0xAndoroid/zkSnake"
        >
          View on GitHub
        </a>
        <div
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          onClick={terminate}
        >
          Disconnect Address
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
