import React, { useState } from "react";
import logo from "../styles/zksnake.jpg";
import SiteDropdown from "./SiteDropdown";

const Navbar = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const shortenAddress = () => {
    if (props.address && props.address.length > 10) {
      return `${props.address.substring(0, 6)}...${props.address.substring(props.address.length - 4)}`;
    }
    return props.address;
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1 flex items-center">
        <img src={logo} alt="ZKSnake Logo" className="h-20 w-20" />
        <a className="btn btn-ghost text-xl" href="/">
          ZKSnake
        </a>
      </div>
      <div
        className="flex-none mr-8"
        onMouseEnter={() => {
          setIsDropdownOpen(true);
        }}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <div className="relative">
          <button className="flex items-center px-4 py-2 bg-white rounded-full shadow-md">
            <span className="flex items-center justify-center h-8 w-8 bg-yellow-400 rounded-full mr-2"></span>
            {shortenAddress()}
          </button>

          {isDropdownOpen && <SiteDropdown terminate={props.terminate} />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
