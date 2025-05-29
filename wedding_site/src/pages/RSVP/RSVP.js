import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { findGuestFileByName, submitRSVP } from "../../firebase/guestService";
import "./RSVP.css";

const RSVP = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: name input, 2: guest selection, 3: contact info, 4: confirmation
  const [nameInput, setNameInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGuestFile, setSelectedGuestFile] = useState(null);
  const [attendingGuests, setAttendingGuests] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Search for guests as user types
  useEffect(() => {
    if (nameInput.length >= 3) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(async () => {
        try {
          const results = await findGuestFileByName(nameInput);
          setSearchResults(results ? [results] : []);
        } catch (error) {
          console.error("Error searching for guests:", error);
          setSearchResults([]);
        }
      }, 300);

      setSearchTimeout(timeout);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [nameInput]);

  const handleNameSelect = (guestFile) => {
    setSelectedGuestFile(guestFile);
    setNameInput("");
    setSearchResults([]);

    // Initialize attending guests array
    const allGuests = [
      { name: guestFile.primaryName, isPrimary: true },
      ...guestFile.additionalGuests.map((name) => ({ name, isPrimary: false })),
    ];
    setAttendingGuests(
      allGuests.map((guest) => ({ ...guest, attending: false }))
    );
    setStep(2);
  };

  const toggleGuestAttendance = (index) => {
    setAttendingGuests((prev) =>
      prev.map((guest, i) =>
        i === index ? { ...guest, attending: !guest.attending } : guest
      )
    );
  };

  const handleContactSubmit = async () => {
    if (!contactInfo.email.trim()) {
      alert("Please provide an email address for wedding updates.");
      return;
    }

    const attendingGuestsList = attendingGuests.filter(
      (guest) => guest.attending
    );

    if (attendingGuestsList.length === 0) {
      alert("Please select at least one guest who will be attending.");
      return;
    }

    try {
      setIsSubmitting(true);

      const rsvpData = {
        guestFileId: selectedGuestFile.id,
        primaryGuestName: selectedGuestFile.primaryName,
        attendingGuests: attendingGuestsList.map((guest) => guest.name),
        totalAttending: attendingGuestsList.length,
        contactEmail: contactInfo.email.trim(),
        contactPhone: contactInfo.phone.trim(),
        submittedAt: new Date().toISOString(),
        maxGuestsAllowed: selectedGuestFile.maxGuests,
      };

      await submitRSVP(rsvpData);
      setIsSubmitted(true);
      setStep(4);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("There was an error submitting your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setNameInput("");
    setSelectedGuestFile(null);
    setAttendingGuests([]);
    setContactInfo({ email: "", phone: "" });
    setIsSubmitted(false);
  };

  const returnToHome = () => {
    navigate("/");
  };

  if (isSubmitted) {
    return (
      <div className="rsvp-container">
        <div className="rsvp-content">
          <div className="confirmation-section">
            <div className="confirmation-icon">✨</div>
            <h1>Thank You!</h1>
            <p className="confirmation-message">
              Your RSVP has been successfully submitted. We're so excited to
              celebrate with you!
            </p>
            <div className="confirmation-details">
              <h3>RSVP Summary:</h3>
              <p>
                <strong>Primary Guest:</strong> {selectedGuestFile?.primaryName}
              </p>
              <p>
                <strong>Attending Guests:</strong>{" "}
                {attendingGuests.filter((g) => g.attending).length}
              </p>
              <p>
                <strong>Contact Email:</strong> {contactInfo.email}
              </p>
            </div>
            <button onClick={returnToHome} className="return-home-btn">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp-container">
      <div className="rsvp-content">
        <div className="rsvp-header">
          <h1>RSVP</h1>
          <p className="rsvp-subtitle">We can't wait to celebrate with you!</p>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
          </div>
        </div>

        {step === 1 && (
          <div className="step-section">
            <h2>Find Your Invitation</h2>
            <p>Please enter your name as it appears on your invitation:</p>

            <div className="name-input-section">
              <input
                type="text"
                placeholder="Enter your full name..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="name-input"
                autoFocus
              />

              {searchResults.length > 0 && nameInput.length >= 3 && (
                <div className="search-dropdown">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="search-result"
                      onClick={() => handleNameSelect(result)}
                    >
                      <div className="result-primary">{result.primaryName}</div>
                      {result.additionalGuests.length > 0 && (
                        <div className="result-additional">
                          + {result.additionalGuests.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-section">
            <h2>Who's Coming?</h2>
            <p>Please select who will be attending from your invitation:</p>

            <div className="guest-selection">
              <div className="guest-list">
                {attendingGuests.map((guest, index) => (
                  <div
                    key={index}
                    className={`guest-item ${guest.attending ? "selected" : ""}`}
                    onClick={() => toggleGuestAttendance(index)}
                  >
                    <input
                      type="checkbox"
                      checked={guest.attending}
                      onChange={() => toggleGuestAttendance(index)}
                      className="guest-checkbox"
                    />
                    <div className="guest-info">
                      <div className="guest-name">{guest.name}</div>
                    </div>
                    <div className="guest-icon">👤</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="step-actions">
              <button onClick={() => setStep(1)} className="back-btn">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="continue-btn"
                disabled={!attendingGuests.some((guest) => guest.attending)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-section">
            <h2>Contact Information</h2>
            <p>Please provide your contact information for wedding updates:</p>

            <div className="contact-form">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, email: e.target.value })
                  }
                  className="contact-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, phone: e.target.value })
                  }
                  className="contact-input"
                />
              </div>
            </div>

            <div className="rsvp-summary">
              <h3>RSVP Summary</h3>
              <div className="summary-details">
                <p>
                  <strong>Attending Guests:</strong>
                </p>
                <ul>
                  {attendingGuests
                    .filter((guest) => guest.attending)
                    .map((guest, index) => (
                      <li key={index}>{guest.name}</li>
                    ))}
                </ul>
                <p>
                  <strong>Total Attending:</strong>{" "}
                  {attendingGuests.filter((guest) => guest.attending).length}
                </p>
              </div>
            </div>

            <div className="step-actions">
              <button onClick={() => setStep(2)} className="back-btn">
                ← Back
              </button>
              <button
                onClick={handleContactSubmit}
                className="submit-btn"
                disabled={isSubmitting || !contactInfo.email.trim()}
              >
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVP;
