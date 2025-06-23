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
  const [isUpdatingExisting, setIsUpdatingExisting] = useState(false);

  // Search for guests as user types
  useEffect(() => {
    if (nameInput.length >= 5) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(async () => {
        try {
          const result = await findGuestFileByName(nameInput);
          setSearchResults(result ? [result] : []);
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

    // Check if this guest file has an existing RSVP
    const existingRSVP = guestFile.existingRSVP;
    const alreadyRSVPdGuests = existingRSVP ? existingRSVP.attendingGuests : [];

    // Initialize attending guests array
    const allGuests = [
      { name: guestFile.primaryName, isPrimary: true },
      ...guestFile.additionalGuests.map((name) => ({ name, isPrimary: false })),
    ];

    setAttendingGuests(
      allGuests.map((guest) => ({
        ...guest,
        attending: false,
        alreadyRSVPd: alreadyRSVPdGuests.includes(guest.name),
      }))
    );

    // Set updating flag if there's an existing RSVP
    setIsUpdatingExisting(!!existingRSVP);

    // Pre-fill contact info if available
    if (existingRSVP) {
      setContactInfo({
        email: existingRSVP.contactEmail || "",
        phone: existingRSVP.contactPhone || "",
      });
    }

    setStep(2);
  };

  const toggleGuestAttendance = (index) => {
    const guest = attendingGuests[index];

    // Don't allow toggling if guest is already RSVP'd
    if (guest.alreadyRSVPd) {
      return;
    }

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

    // Get newly selected guests (not already RSVP'd)
    const newlySelectedGuests = attendingGuests.filter(
      (guest) => guest.attending && !guest.alreadyRSVPd
    );

    if (newlySelectedGuests.length === 0) {
      alert("Please select at least one guest who will be attending.");
      return;
    }

    try {
      setIsSubmitting(true);

      const rsvpData = {
        guestFileId: selectedGuestFile.id,
        primaryGuestName: selectedGuestFile.primaryName,
        attendingGuests: newlySelectedGuests.map((guest) => guest.name),
        totalAttending: newlySelectedGuests.length,
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
    setIsUpdatingExisting(false);
  };

  const returnToHome = () => {
    navigate("/");
  };

  if (isSubmitted) {
    const newlyRSVPdGuests = attendingGuests.filter(
      (guest) => guest.attending && !guest.alreadyRSVPd
    );

    return (
      <div className="rsvp-container">
        <div className="rsvp-content">
          <div className="confirmation-section">
            <div className="confirmation-icon">✨</div>
            <h1>Thank You!</h1>
            <p className="confirmation-message">
              {isUpdatingExisting
                ? "Your RSVP has been successfully updated. We're so excited to celebrate with you!"
                : "Your RSVP has been successfully submitted. We're so excited to celebrate with you!"}
            </p>
            <div className="confirmation-details">
              <h3>RSVP Summary:</h3>
              <p>
                <strong>Primary Guest:</strong> {selectedGuestFile?.primaryName}
              </p>
              <p>
                <strong>
                  {isUpdatingExisting ? "Newly Added" : "Attending"} Guests:
                </strong>{" "}
                {newlyRSVPdGuests.length}
              </p>
              {newlyRSVPdGuests.length > 0 && (
                <div className="guest-list-summary">
                  <ul>
                    {newlyRSVPdGuests.map((guest, index) => (
                      <li key={index}>{guest.name}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                      {result.existingRSVP && (
                        <div className="result-status">
                          ✓ Partial RSVP submitted
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
            <h2>{isUpdatingExisting ? "Update Your RSVP" : "Who's Coming?"}</h2>
            <p>
              {isUpdatingExisting
                ? "Select additional guests who will be attending:"
                : "Please select who will be attending from your invitation:"}
            </p>

            {isUpdatingExisting && (
              <div className="existing-rsvp-notice">
                <p className="notice-text">
                  <strong>Note:</strong> Guests marked with ✓ have already
                  RSVP'd. You can add additional guests from your invitation
                  below.
                </p>
              </div>
            )}

            <div className="guest-list-notice">
              <p className="notice-text">
                <strong>Note:</strong> These are the people from your household
                we would like to invite. If you believe someone is missing,
                please contact us so we can take a look.
              </p>
            </div>

            <div className="guest-selection">
              <div className="guest-list">
                {attendingGuests.map((guest, index) => (
                  <div
                    key={index}
                    className={`guest-item ${guest.attending ? "selected" : ""} ${guest.alreadyRSVPd ? "already-rsvpd" : ""}`}
                    onClick={() => toggleGuestAttendance(index)}
                  >
                    <input
                      type="checkbox"
                      checked={guest.attending || guest.alreadyRSVPd}
                      onChange={() => toggleGuestAttendance(index)}
                      className="guest-checkbox"
                      disabled={guest.alreadyRSVPd}
                    />
                    <div className="guest-info">
                      <div className="guest-name">
                        {guest.name}
                        {guest.alreadyRSVPd && (
                          <span className="rsvp-status"> ✓</span>
                        )}
                      </div>
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
                disabled={
                  !attendingGuests.some(
                    (guest) => guest.attending && !guest.alreadyRSVPd
                  )
                }
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
                {isUpdatingExisting && (
                  <>
                    <p>
                      <strong>Already RSVP'd:</strong>
                    </p>
                    <ul>
                      {attendingGuests
                        .filter((guest) => guest.alreadyRSVPd)
                        .map((guest, index) => (
                          <li key={index} className="already-rsvpd-guest">
                            {guest.name} ✓
                          </li>
                        ))}
                    </ul>
                  </>
                )}
                <p>
                  <strong>
                    {isUpdatingExisting ? "Adding" : "Attending"} Guests:
                  </strong>
                </p>
                <ul>
                  {attendingGuests
                    .filter((guest) => guest.attending && !guest.alreadyRSVPd)
                    .map((guest, index) => (
                      <li key={index}>{guest.name}</li>
                    ))}
                </ul>
                <p>
                  <strong>
                    Total {isUpdatingExisting ? "New" : ""} Attending:
                  </strong>{" "}
                  {
                    attendingGuests.filter(
                      (guest) => guest.attending && !guest.alreadyRSVPd
                    ).length
                  }
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
                {isSubmitting
                  ? "Submitting..."
                  : isUpdatingExisting
                    ? "Update RSVP"
                    : "Submit RSVP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVP;
