import React from "react";
import style from "./Footer.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(style);

const Footer = () => {
  return (
    <div className={cx("container")}>
      <div className={cx("top")}>
        <div className={cx("column")}>
          <h3>About Us</h3>
          <p>
            We are a team dedicated to building beautiful and responsive
            websites.
          </p>
        </div>

        <div className={cx("column")}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className={cx("column")}>
          <h3>Contact</h3>
          <ul>
            <li>Email: info@example.com</li>
            <li>Phone: +84 123 456 789</li>
            <li>Address: Hanoi, Vietnam</li>
          </ul>
        </div>
      </div>

      <div className={cx("bottom")}>
        © 2025 Your Company. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
