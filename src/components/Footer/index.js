import React from "react";
import "./style.css";

const getYear = () => new Date().getFullYear();


function Footer() {
  return (
    <footer className="footer">
      <div className="link-cluster">
        

        <a href="https://github.com/staffbotsteve/hi-ho-frontend" target="_blank" rel="noopener noreferrer" className="whiteLink">
          Front-End
        </a>

        <img
            src="https://image.flaticon.com/icons/png/512/25/25231.png"
            className="smlink"
            alt="GitHub"
          />

        <a href="https://github.com/staffbotsteve/hi-ho-backend" target="_blank" rel="noopener noreferrer" className="whiteLink">
          Back-End
        </a>
      <br></br>
        Copyright © {getYear()} Lazier Loaders
      </div>
     
    </footer>
  );
}

export default Footer;
