import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Registry.css";
import { Link } from "react-router-dom";

// Import any images you might want to use
import heartIcon from "../../assets/images/wedding-ring.png";
import paypalIcon from "../../assets/images/hd-paypal-logo-transparent-background-701751694777793hs5bxpddux.png";
import venmoIcon from "../../assets/images/png-clipart-venmo-logo-tech-companies-thumbnail.png";

const Registry = () => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const togglePaymentOptions = (e) => {
    e.preventDefault();
    setShowPaymentOptions(!showPaymentOptions);
  };

  return (
    <div className="registry-page">
      <motion.section
        className="registry-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="overlay"></div>
        <div className="registry-hero-content">
          <h1>Our Registry</h1>
          <div className="hero-divider">
            <div className="divider-line"></div>
            <div className="divider-icon"></div>
            <div className="divider-line"></div>
          </div>
          <p>Your presence is our present, but if you'd like to give more...</p>
        </div>
      </motion.section>

      <section className="registry-intro">
        <motion.div
          className="intro-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2>A Note About Gifts</h2>
          <p className="elegant-text">
            After nearly eight beautiful years together and creating a home we
            love, we've found that our space is filled with almost everything we
            need. What we treasure most now are the memories we create together.
          </p>
          <div className="flourish"></div>
        </motion.div>
      </section>

      <motion.section
        className="registry-options"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="registry-card-container">
          <motion.div
            className="registry-card"
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="card-icon honeymoon-icon">
              <img src={heartIcon} alt="Honeymoon Fund" />
            </div>
            <h3>Honeymoon Fund</h3>
            <p className="registry-description">
              If you'd like to help us celebrate our new life together, we would
              be honored to receive a contribution to our honeymoon fund. Your
              gift will help create treasured memories as we begin this exciting
              new chapter of our journey together.
            </p>
            <p className="accent-text">
              Because after eight years of building a home, what we cherish most
              are the experiences we share.
            </p>

            <button className="registry-button" onClick={togglePaymentOptions}>
              Contribute to Our Memories
            </button>

            <AnimatePresence>
              {showPaymentOptions && (
                <motion.div
                  className="payment-options"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="payment-intro">
                    Choose your preferred payment method:
                  </p>

                  <div className="payment-buttons">
                    <a
                      href="https://www.paypal.com/paypalme/DimitraAndChristian"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="payment-option-button paypal"
                    >
                      <img
                        src={paypalIcon}
                        alt="PayPal"
                        className="payment-icon"
                      />
                      <span>PayPal</span>
                    </a>

                    <a
                      href="https://venmo.com/Christian-Laviolette"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="payment-option-button venmo"
                    >
                      <img
                        src={venmoIcon}
                        alt="Venmo"
                        className="payment-icon"
                      />
                      <span>Venmo</span>
                    </a>

                    <a
                      href="https://www.honeyfund.com/site/laviolette-vithoulkas-10-19-2025"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="payment-option-button honeyfund"
                    >
                      <span>Honeyfund</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="registry-card"
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="card-icon registry-icon">
              <img src={heartIcon} alt="Traditional Registry" />
            </div>
            <h3>Traditional Registry</h3>
            <p className="registry-description">
              If you'd prefer to select a traditional gift, we've created a
              small registry with items that would be meaningful additions to
              our home.
            </p>
            <a
              href="https://www.amazon.com/wedding/registry/O9JO7XZF02XV"
              target="_blank"
              rel="noopener noreferrer"
              className="registry-button secondary-button"
            >
              View Registry
            </a>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="heartfelt-message"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="message-container">
          <h3>The Greatest Gift</h3>
          <p>
            More than anything, your presence on our wedding day is the greatest
            gift you can give us. We're so excited to celebrate with our closest
            friends and family as we start this new chapter together.
          </p>
          <div className="closing-icon"></div>
        </div>
      </motion.section>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 0",
        }}
      >
        <div
          style={{
            height: "60px",
            width: "220px",
            background:
              'url("../../assets/images/floral-design-with-curled-edges.png") center/contain no-repeat',
            margin: "0",
            padding: "0",
            display: "block",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Registry;
