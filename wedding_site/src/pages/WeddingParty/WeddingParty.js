import React from "react";
import { motion } from "framer-motion";
import "./WeddingParty.css";
import ethanPhoto from "../../assets/images/weddingParty/ethan.jpeg"; // Adjust the path as needed
import denisePhoto from "../../assets/images/weddingParty/denise.jpeg";
import anthonyPhoto from "../../assets/images/weddingParty/anthony.jpeg";
import anastasiaPhoto from "../../assets/images/weddingParty/anastasia.jpeg";
import brycePhoto from "../../assets/images/weddingParty/bryce.jpeg";
// Import bride and groom photos - update paths as needed
import bridePhoto from "../../assets/images/weddingParty/bride-placeholder.jpg";
import groomPhoto from "../../assets/images/weddingParty/groom-placeholder.jpg";
import sierraPhoto from "../../assets/images/weddingParty/sierra.jpg";
import jodiPhoto from "../../assets/images/weddingParty/jodi.png";
import sebastianPhoto from "../../assets/images/weddingParty/sebastian.jpg";
import samPhoto from "../../assets/images/weddingParty/sam.png";
import terraPhoto from "../../assets/images/weddingParty/terra.jpg";
import hannahPhoto from "../../assets/images/weddingParty/hannah.jpg";
import gracePhoto from "../../assets/images/weddingParty/grace.png";
import lydiaPhoto from "../../assets/images/weddingParty/lydia.png";
import seanPhoto from "../../assets/images/weddingParty/sean.jpeg";
import richandrachel from "../../assets/images/weddingParty/richandrachel.jpeg";
import dimitraPhoto from "../../assets/images/weddingParty/dimitra.jpeg";
import couplePhoto from "../../assets/images/galleryImages/D&C-71.jpg";
import joshPhoto from "../../assets/images/weddingParty/josh.jpeg";
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

      {/* Bride and Groom Section */}
      <section className="party-section couple-section">
        <div className="section-header">
          <div className="header-line"></div>
          <h2 className="section-title">Our Story</h2>
          <div className="header-line"></div>
        </div>

        <motion.div
          className="couple-story-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="couple-story-card" variants={itemVariants}>
            <div className="couple-story-photo">
              <img
                src={couplePhoto}
                alt="Christian & Dimitra"
                className="couple-story-img"
              />
            </div>
            <div className="couple-story-content">
              <h3 className="couple-story-title">Christian & Dimitra</h3>
              <div className="story-text">
                <p>
                  Our love story began on March 15th, 2017, when we first
                  connected on Tinder of all places! After a month of endless
                  conversations and getting to know each other, we finally met
                  in person on April 20th, 2017, at our first show together. The
                  connection was instant and undeniable - so much so that we
                  went to another show the very next day, where Christian asked
                  Dimitra to be his girlfriend, despite knowing she was supposed
                  to leave for college in California. Spoiler alert: he
                  convinced her to stay!
                </p>
                <p>
                  After dating for several amazing years, Christian first
                  proposed in December 2019, but then the world had other plans
                  when COVID hit. Not to be deterred by a global pandemic, he
                  reproposed at Lost Lands in 2022 - because nothing says
                  "forever" quite like a proposal at a music festival! In 2023,
                  we took the next big step by moving into our own place
                  together and officially began wedding planning. Over the past
                  8 years, we've traveled all over the country, experiencing
                  life's adventures side by side, and we can't wait to make it
                  official and continue this incredible journey as husband and
                  wife.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="party-divider">
        <div className="divider-icon"></div>
      </div>

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
                <img src={samPhoto} alt="Sam Cagle" className="member-img" />
              </div>
              <h4 className="member-name">Sam Cagle</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "My name is Sam and I like to party"
              </p>
            </motion.div>

            <motion.div className="featured-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={richandrachel}
                  alt="Richard and Rachel"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Richard Garza</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "Liquor before beer, you're in the clear. Beer before
                liqour...... you're in the clear"
              </p>
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
                <img
                  src={joshPhoto}
                  alt="Joshua Laviolette"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Joshua Laviolette</h4>
              <p className="member-relation">Brother of The Groom</p>
              <p className="member-quote">
                "Dissapointing my parents is my favorite hobby"
              </p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={ethanPhoto}
                  alt="Ethan Zajac"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Ethan Zajac</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "The only thing better than the open sky is big booty latinas"
              </p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <img src={brycePhoto} alt="Bryce Vann" className="member-img" />
              </div>
              <h4 className="member-name">Bryce Vann</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">"I'm just playing my slice"</p>
            </motion.div>

            <motion.div className="party-member" vsariants={itemVariants}>
              <div className="member-photo">
                <img
                  src={sebastianPhoto}
                  alt="Sebastian"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Sebastian</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "Dont't hurt yourself, we might need you later"
              </p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={seanPhoto}
                  alt="Sean Rutledge"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Sean Rutledge</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "Hey, my name is Sean and I have a basketball game tomorrow"
              </p>
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
                <img
                  src={anthonyPhoto}
                  alt="Anthony Cagala"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Anthony Cagala</h4>
              <p className="member-title">Man of Honor</p>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "At the end of the day... its night"
              </p>
            </motion.div>

            <motion.div className="featured-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={terraPhoto}
                  alt="Terra Cagle"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Terra Cagle</h4>
              <p className="member-title">Maid of Honor</p>
              <p className="member-relation">Friend</p>
              <p className="member-quote">"Shots?"</p>
            </motion.div>

            <motion.div className="featured-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={denisePhoto}
                  alt="Denise Jawan"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Denise Jawan</h4>
              <p className="member-title">Matron of Honor</p>
              <p className="member-relation">Sister</p>
              <p className="member-quote">
                "Imperfection is baeuty, madness is genius, and it's better to
                be absolutely ridiculous than absolutely boring"
              </p>
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
                <img
                  src={lydiaPhoto}
                  alt="Lydia Ciarrocchi"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Lydia Ciarrocchi</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "I give great advice that i will most likely never take myself,
                and I have no idea where I'm at so dont ask me for directions"
              </p>
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
                <img
                  src={sierraPhoto}
                  alt="Sierra Laviolette"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Sierra Laviolette</h4>
              <p className="member-relation">Sister of The Groom</p>
              <p className="member-quote">
                "Websters dictionary defines wedding as diffusing of two metals
                with a hot torch!"
              </p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={anastasiaPhoto}
                  alt="Anastasia Jawan"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Anastasia Jawan</h4>
              <p className="member-relation">Niece</p>
              <p className="member-quote">
                "If my cats dont like you, neither do I."
              </p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={jodiPhoto}
                  alt="Jodie Personius"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Jodie Personius</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "Trust me, you can dance" - Alcohol
              </p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={richandrachel}
                  alt="Richard and Rachel"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Rachel Cuza</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "Don't be salty unless you have tequila"
              </p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={gracePhoto}
                  alt="Grace Kaminski"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Grace Kaminski</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "My cats and I talk shit about you"
              </p>
            </motion.div>

            <motion.div className="party-member" variants={itemVariants}>
              <div className="member-photo">
                <img
                  src={hannahPhoto}
                  alt="Hannah Mickelson"
                  className="member-img"
                />
              </div>
              <h4 className="member-name">Hannah Mickelson</h4>
              <p className="member-relation">Friend</p>
              <p className="member-quote">
                "Life is not a waste of time, and time is not a waste of life.
                So lets stop wasting time, get wasted, and have the time of our
                lives"- Pitbull
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default WeddingParty;
