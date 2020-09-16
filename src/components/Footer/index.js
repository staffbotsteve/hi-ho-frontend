import React from "react";
import "./style.css";

const getYear = () => new Date().getFullYear();


function Footer() {
  return (
    <footer className="footer">
      <div className="link-cluster">
        

        <a href="https://github.com/tpoovaiah" target="_blank" rel="noopener noreferrer">
          Front-End
        </a>

        <a href="https://github.com/tpoovaiah" target="_blank" rel="noopener noreferrer">
          <img
            src="https://image.flaticon.com/icons/png/512/25/25231.png"
            className="smlink"
            alt="GitHub"
          />
          Back-End
        </a>

       
      </div>
      <span>Copyright © {getYear()} Lazier Loaders</span>
    </footer>
  );
}

export default Footer;
