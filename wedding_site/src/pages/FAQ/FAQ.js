import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FAQ.css";

const FAQ = () => {
  // State to track which FAQ is expanded
  const [expandedId, setExpandedId] = useState(null);

  // Toggle function for expanding/collapsing FAQs
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // FAQ data array
  const faqs = [
    {
      id: 1,
      question: "Will there be an open bar?",
      answer:
        "Of course! We know how much our friends and family enjoy a good drink, so we'll have a selection of whiskey, vodka, tequila, rum, beer, and wine for you to enjoy. However, due to venue restrictions, shots won't be allowed—we want everyone to have a great time and actually remember the night! Cheers!",
    },
    {
      id: 2,
      question: "Are kids allowed?",
      answer:
        "We love your little ones, but for this special evening, we kindly ask that our celebration remain an adults-only affair—unless otherwise specified by us. We hope you take this opportunity to enjoy a well-deserved night out, filled with laughter, dancing, and celebration. Let's make it a night to remember!",
    },
    {
      id: 3,
      question: "Can I bring a plus-one?",
      answer:
        "We're so excited to celebrate with our closest family and friends! Due to space limitations, only the guests listed on the invitation and shown when RSVPing are included. If you have any questions or need clarification, please don't hesitate to reach out—we're happy to help!",
    },
    {
      id: 4,
      question: "Where is the wedding located?",
      answer:
        "Our wedding will be held in Benton Harbor, Michigan. We'll exchange vows in their charming outdoor ceremony space, then celebrate with dinner and dancing in the restored authentic 1930s barn with its soaring cathedral ceiling and original beams. The specific address is included in your wedding invitation. For any questions or more information, please contact Christian at 219-789-5996.",
    },
    {
      id: 5,
      question: "What is the dress code?",
      answer:
        "Our wedding will be formal. For men, we kindly ask that you wear a tuxedo or a dark suit (navy, charcoal, or black) with a tie. For women, please wear a floor-length gown or a formal cocktail dress. And, of course, a friendly reminder: do not wear white… unless you'd like to risk an accidental wine spill. Fair warning! 😉",
    },
    {
      id: 6,
      question: "Will the reception and ceremony be at the same location?",
      answer:
        "Yes! Both the ceremony and reception will be held at the same venue, so there's no need for any extra travel. Just arrive, relax, and enjoy the celebration from start to finish!",
    },
    {
      id: 7,
      question: "What accommodations are available for out-of-town guests?",
      answerComponent: () => (
        <div>
          <p>
            We've reserved a block of rooms at the Courtyard by Marriott St.
            Joseph/Benton Harbor for your convenience. Here are the details:
          </p>
          <div style={{ marginLeft: "20px", marginTop: "15px" }}>
            <p>
              <strong>Hotel:</strong> Courtyard St. Joseph/Benton Harbor
            </p>
            <p>
              <strong>Address:</strong> 1295 Cinema Way, Benton Harbor, MI 49022
            </p>
            <p>
              <strong>Phone:</strong> (269) 210-3000
            </p>
            <p>
              <strong>Reservation Code:</strong> VLW
            </p>
            <p>
              <strong>Booking Deadline:</strong> September 19th, 2025
            </p>
          </div>
          <p style={{ marginTop: "15px" }}>
            Please mention the reservation code "VLW" when booking to receive
            our group rate. Be sure to book by September 19th, 2025 to guarantee
            availability and pricing.
          </p>
        </div>
      ),
    },
    // Additional FAQs will be added here
  ];

  return (
    <div className="faq-page">
      <motion.div
        className="page-intro"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="page-title">Frequently Asked Questions</h1>
        <p className="intro-text">
          We've compiled some answers to questions we thought you might have
          about our special day. If you have any other questions, please don't
          hesitate to reach out to us directly.
        </p>
        <div className="flourish"></div>
      </motion.div>

      <motion.section
        className="faq-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div
              className={`faq-question ${expandedId === faq.id ? "active" : ""}`}
              onClick={() => toggleExpand(faq.id)}
            >
              <h3>{faq.question}</h3>
              <div className="faq-icon">
                <div className="icon-line horizontal"></div>
                <div
                  className={`icon-line vertical ${
                    expandedId === faq.id ? "collapsed" : ""
                  }`}
                ></div>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === faq.id && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answerComponent ? (
                    faq.answerComponent()
                  ) : (
                    <p>{faq.answer}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.section>

      <div className="faq-contact">
        <h3>Still have questions?</h3>
        <p>
          Feel free to reach out to us directly at{" "}
          <a href="mailto:dimitravithoulkas@yahoo.com">
            dimitravithoulkas@yahoo.com
          </a>
        </p>
      </div>

      <div className="closing-flourish"></div>
    </div>
  );
};

export default FAQ;
