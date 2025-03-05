import React from "react";
import { motion } from "framer-motion";
import "./WeddingParty.css";

const WeddingParty = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="wedding-party-page">
      <motion.div
        className="page-intro"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="page-title">Our Wedding Party</h1>
        <p className="intro-text">
          We're blessed to have these amazing people standing with us on our
          special day. They've been with us through the good times and bad, and
          we couldn't imagine celebrating without them by our sides.
        </p>
        <div className="flourish"></div>
      </motion.div>

      {/* Groom's Party */}
      <section className="party-section">
        <div className="section-header">
          <div className="header-line"></div>
          <h2 className="section-title">Groom's Party</h2>
          <div className="header-line"></div>
        </div>

        <motion.div
          className="best-men-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="role-title">Best Men</h3>
          <div className="feature-row">
            <motion.div className="featured-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Sam Cagle</h4>
              <p className="member-relation">Best Friend</p>
            </motion.div>

            <motion.div className="featured-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Richard Garza</h4>
              <p className="member-relation">Best Friend</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="groomsmen-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="role-title">Groomsmen</h3>
          <div className="members-grid">
            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Joshua Laviolette</h4>
              <p className="member-relation">Brother</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Ethan Zajac</h4>
              <p className="member-relation">Friend</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Bryce Vann</h4>
              <p className="member-relation">Friend</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Sebastian</h4>
              <p className="member-relation">Friend</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Sean Rutledge</h4>
              <p className="member-relation">Friend</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <div className="party-divider">
        <div className="divider-icon"></div>
      </div>

      {/* Bride's Party */}
      <section className="party-section">
        <div className="section-header">
          <div className="header-line"></div>
          <h2 className="section-title">Bride's Party</h2>
          <div className="header-line"></div>
        </div>

        <motion.div
          className="honors-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="role-title">Honors</h3>
          <div className="honors-row">
            <motion.div className="featured-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Anthony Cagala</h4>
              <p className="member-title">Man of Honor</p>
              <p className="member-relation">Best Friend</p>
            </motion.div>

            <motion.div className="featured-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Terra Cagle</h4>
              <p className="member-title">Maid of Honor</p>
              <p className="member-relation">Best Friend</p>
            </motion.div>

            <motion.div className="featured-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Denise Jawan</h4>
              <p className="member-title">Matron of Honor</p>
              <p className="member-relation">Sister</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="officiant-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="role-title special-title">Officiant</h3>
          <div className="officiant-wrapper">
            <motion.div className="officiant-member" variants={itemVariants}>
              <div className="member-photo special-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Lydia Ciarrocchi</h4>
              <p className="member-relation">Best Friend</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="bridesmaids-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="role-title">Bridesmaids</h3>
          <div className="members-grid">
            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Sierra Laviolette</h4>
              <p className="member-relation">Sister in Law</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Anastasia Jawan</h4>
              <p className="member-relation">Niece</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Jodie Personius</h4>
              <p className="member-relation">Friend</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Rachel Cuza</h4>
              <p className="member-relation">Friend</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Grace Kaminski</h4>
              <p className="member-relation">Friend</p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <div className="photo-placeholder"></div>
              </div>
              <h4 className="member-name">Hannah Mickelson</h4>
              <p className="member-relation">Friend</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <div className="closing-flourish"></div>
    </div>
  );
};

export default WeddingParty;
