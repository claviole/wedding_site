import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { motion } from "framer-motion";

const Home = () => {
  const [countdown, setCountdown] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  // Wedding date - October 19, 2025
  const weddingDate = new Date("October 19, 2025 16:00:00").getTime();

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const timeRemaining = weddingDate - now;

      if (timeRemaining > 0) {
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        // If wedding date has passed
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately when component mounts
    calculateCountdown();

    // Update countdown every second
    const timer = setInterval(calculateCountdown, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="home">
      <section className="hero parallax-bg">
        <div className="overlay"></div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div className="monogram">C&D</div>
          <h1 className="hero-title">Christian & Dimitra</h1>
          <p className="wedding-date">October 19, 2025</p>
          <p className="wedding-location">Benton Harbor, Michigan</p>
          <Link to="/rsvp" className="rsvp-button">
            RSVP Now
          </Link>
        </motion.div>
      </section>

      <div className="divider">
        <div className="divider-line"></div>
        <div className="divider-icon"></div>
        <div className="divider-line"></div>
      </div>

      <motion.section
        className="welcome-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2>Welcome to Our Wedding Celebration</h2>
        <p className="elegant-text">
          With hearts full of joy, we invite you to join us as we celebrate our
          love at the enchanting Blue Dress Barn. Here you'll find all the
          information you need about our special day where two families become
          one.
        </p>
        <div className="flourish"></div>
      </motion.section>

      <div className="section-title-container">
        <h2 className="section-title">Wedding Details</h2>
      </div>

      <motion.section
        className="details-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="detail-card"
          whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="card-icon ceremony-icon"></div>
          <h3>The Ceremony</h3>
          <p className="detail-time">4:00 PM</p>
          <p className="detail-location">Outdoor Garden</p>
          <p className="card-description">
            Join us as we exchange vows surrounded by the picturesque
            countryside and rustic charm of the Blue Dress Barn's beautiful
            grounds.
          </p>
        </motion.div>

        <motion.div
          className="detail-card"
          whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="card-icon reception-icon"></div>
          <h3>The Reception</h3>
          <p className="detail-time">6:00 PM</p>
          <p className="detail-location">Historic Barn</p>
          <p className="card-description">
            Celebrate with us as we enjoy dinner and dancing in the restored
            authentic 1860s barn with its soaring cathedral ceiling and original
            beams.
          </p>
        </motion.div>

        <motion.div
          className="detail-card"
          whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="card-icon accommodations-icon"></div>
          <h3>Accommodations</h3>
          <p className="card-description">
            We've arranged special rates at several hotels in the St. Joseph and
            Benton Harbor area. Visit our FAQ page for recommendations and
            details.
          </p>
          <Link to="/faq" className="detail-link">
            View Accommodations
          </Link>
        </motion.div>
      </motion.section>

      <motion.section
        className="countdown-section"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="countdown-background"></div>
        <h2>Counting Down to Forever</h2>
        <div className="countdown-timer">
          <div className="countdown-item">
            <span className="countdown-number">{countdown.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{countdown.hours}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{countdown.minutes}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{countdown.seconds}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
      </motion.section>

      <div className="section-title-container">
        <h2 className="section-title">Our Journey Together</h2>
      </div>

      <motion.section
        className="photo-gallery-preview"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="gallery-intro">
          <p>Every love story is beautiful, but ours is our favorite.</p>
        </div>
        <div className="gallery-preview">
          <motion.div
            className="preview-image placeholder"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          ></motion.div>
          <motion.div
            className="preview-image placeholder"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          ></motion.div>
          <motion.div
            className="preview-image placeholder"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          ></motion.div>
        </div>
        <Link to="/gallery" className="view-gallery-button">
          View Our Story
        </Link>
      </motion.section>

      <div className="closing-flourish"></div>
    </div>
  );
};

export default Home;
