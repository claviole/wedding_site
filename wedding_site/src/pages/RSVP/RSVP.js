import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { findGuestFileByName, submitRSVP } from "../../firebase/guestService";
import "./RSVP.css";

const RSVP = () => {
  const navigate = useNavigate();

  // Check if RSVP deadline has passed (September 7th, 2025)
  const rsvpDeadline = new Date("2025-09-07T23:59:59");
  const currentDate = new Date();
  const isRSVPClosed = currentDate > rsvpDeadline;

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
    const alreadyNotAttendingGuests = existingRSVP
      ? existingRSVP.notAttendingGuests || []
      : [];

    // Initialize attending guests array
    const allGuests = [
      { name: guestFile.primaryName, isPrimary: true },
      ...guestFile.additionalGuests.map((name) => ({ name, isPrimary: false })),
    ];

    setAttendingGuests(
      allGuests.map((guest) => {
        const alreadyRSVPd = alreadyRSVPdGuests.includes(guest.name);
        const alreadyNotAttending = alreadyNotAttendingGuests.includes(
          guest.name
        );

        return {
          ...guest,
          attending: alreadyRSVPd ? true : false,
          notAttending: alreadyNotAttending ? true : false,
          alreadyRSVPd: alreadyRSVPd || alreadyNotAttending,
          responseType: alreadyRSVPd
            ? "attending"
            : alreadyNotAttending
              ? "notAttending"
              : null,
        };
      })
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

  const setGuestResponse = (index, responseType) => {
    const guest = attendingGuests[index];

    // Don't allow changing if guest is already RSVP'd
    if (guest.alreadyRSVPd) {
      return;
    }

    setAttendingGuests((prev) =>
      prev.map((guest, i) =>
        i === index
          ? {
              ...guest,
              attending: responseType === "attending",
              notAttending: responseType === "notAttending",
              responseType: responseType,
            }
          : guest
      )
    );
  };

  const handleContactSubmit = async () => {
    if (!contactInfo.email.trim()) {
      alert("Please provide an email address for wedding updates.");
      return;
    }

    // Get guests with new responses (not already RSVP'd)
    const newResponses = attendingGuests.filter(
      (guest) => !guest.alreadyRSVPd && guest.responseType
    );

    const newlyAttending = newResponses.filter(
      (guest) => guest.responseType === "attending"
    );
    const newlyNotAttending = newResponses.filter(
      (guest) => guest.responseType === "notAttending"
    );

    // Check if all non-RSVP'd guests have made a selection
    const unrespondedGuests = attendingGuests.filter(
      (guest) => !guest.alreadyRSVPd && !guest.responseType
    );

    if (unrespondedGuests.length > 0) {
      alert(
        `Please select attendance status for: ${unrespondedGuests.map((g) => g.name).join(", ")}`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const rsvpData = {
        guestFileId: selectedGuestFile.id,
        primaryGuestName: selectedGuestFile.primaryName,
        attendingGuests: newlyAttending.map((guest) => guest.name),
        notAttendingGuests: newlyNotAttending.map((guest) => guest.name),
        totalAttending: newlyAttending.length,
        totalNotAttending: newlyNotAttending.length,
        contactEmail: contactInfo.email.trim(),
        contactPhone: contactInfo.phone.trim(),
        submittedAt: new Date().toISOString(),
        maxGuestsAllowed: selectedGuestFile.maxGuests,
      };

      console.log("Submitting RSVP data from component:", rsvpData);

      await submitRSVP(rsvpData);
      setIsSubmitted(true);
      setStep(4);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);

      let errorMessage =
        "There was an error submitting your RSVP. Please try again.";

      // Provide more specific error messages
      if (error.code === "permission-denied") {
        errorMessage =
          "Permission denied. Please check your internet connection and try again.";
      } else if (error.code === "unavailable") {
        errorMessage =
          "Service temporarily unavailable. Please try again in a moment.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      alert(errorMessage);
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

  // Show RSVP closed message if deadline has passed
  if (isRSVPClosed) {
    return (
      <div className="rsvp-container">
        <div className="rsvp-content">
          <div className="rsvp-closed-section">
            <div className="rsvp-closed-icon">💌</div>
            <h1>RSVP Period Has Ended</h1>
            <p className="rsvp-closed-message">
              We sincerely appreciate your interest in celebrating with us!
              However, our RSVP deadline of <strong>September 7th, 2025</strong>{" "}
              has now passed, and we are no longer able to accept new responses
              as we finalize our wedding preparations.
            </p>
            <div className="contact-info-box">
              <p className="contact-message">
                If you have any questions, concerns, or special circumstances,
                please don't hesitate to reach out to Christian directly:
              </p>
              <div className="phone-contact">
                <span className="phone-icon">📱</span>
                <a href="tel:219-789-5996" className="phone-number">
                  (219) 789-5996
                </a>
              </div>
            </div>
            <p className="thank-you-message">
              Thank you for your understanding, and we hope to see you at our
              special day!
            </p>
            <button onClick={returnToHome} className="return-home-btn">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    const newlyAttendingGuests = attendingGuests.filter(
      (guest) => guest.responseType === "attending" && !guest.alreadyRSVPd
    );
    const newlyNotAttendingGuests = attendingGuests.filter(
      (guest) => guest.responseType === "notAttending" && !guest.alreadyRSVPd
    );
    const allAttending = attendingGuests.filter(
      (guest) => guest.attending || guest.responseType === "attending"
    );
    const allNotAttending = attendingGuests.filter(
      (guest) => guest.notAttending || guest.responseType === "notAttending"
    );

    return (
      <div className="rsvp-container">
        <div className="rsvp-content">
          <div className="confirmation-section">
            <div className="confirmation-icon">✨</div>
            <h1>Thank You!</h1>
            <p className="confirmation-message">
              {isUpdatingExisting
                ? "Your RSVP has been successfully updated. Thank you for letting us know!"
                : "Your RSVP has been successfully submitted. Thank you for letting us know!"}
            </p>
            <div className="confirmation-details">
              <h3>RSVP Summary:</h3>
              <p>
                <strong>Primary Guest:</strong> {selectedGuestFile?.primaryName}
              </p>

              {allAttending.length > 0 && (
                <>
                  <p>
                    <strong>
                      {isUpdatingExisting && newlyAttendingGuests.length > 0
                        ? "Newly "
                        : ""}
                      Attending Guests:
                    </strong>{" "}
                    {isUpdatingExisting
                      ? newlyAttendingGuests.length
                      : allAttending.length}
                  </p>
                  <div className="guest-list-summary">
                    <ul className="attending-list">
                      {(isUpdatingExisting
                        ? newlyAttendingGuests
                        : allAttending
                      ).map((guest, index) => (
                        <li key={index} className="attending-guest">
                          ✓ {guest.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {allNotAttending.length > 0 && (
                <>
                  <p>
                    <strong>
                      {isUpdatingExisting && newlyNotAttendingGuests.length > 0
                        ? "Newly "
                        : ""}
                      Not Attending:
                    </strong>{" "}
                    {isUpdatingExisting
                      ? newlyNotAttendingGuests.length
                      : allNotAttending.length}
                  </p>
                  <div className="guest-list-summary">
                    <ul className="not-attending-list">
                      {(isUpdatingExisting
                        ? newlyNotAttendingGuests
                        : allNotAttending
                      ).map((guest, index) => (
                        <li key={index} className="not-attending-guest">
                          ✗ {guest.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
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
                ? "Update attendance for additional guests from your invitation:"
                : "Please let us know who will be attending from your invitation:"}
            </p>

            {isUpdatingExisting && (
              <div className="existing-rsvp-notice">
                <p className="notice-text">
                  <strong>Note:</strong> Guests marked with ✓ or ✗ have already
                  responded. You can update attendance for additional guests
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
                    className={`guest-item-individual ${guest.alreadyRSVPd ? "already-responded" : ""}`}
                  >
                    <div className="guest-info">
                      <div className="guest-name">
                        {guest.name}
                        {guest.alreadyRSVPd && (
                          <span
                            className={`rsvp-status ${guest.attending ? "attending" : "not-attending"}`}
                          >
                            {guest.attending ? " ✓" : " ✗"}
                          </span>
                        )}
                      </div>
                    </div>

                    {!guest.alreadyRSVPd ? (
                      <div className="response-options">
                        <button
                          className={`response-btn attending ${guest.responseType === "attending" ? "selected" : ""}`}
                          onClick={() => setGuestResponse(index, "attending")}
                        >
                          ✓ Will attend
                        </button>
                        <button
                          className={`response-btn not-attending ${guest.responseType === "notAttending" ? "selected" : ""}`}
                          onClick={() =>
                            setGuestResponse(index, "notAttending")
                          }
                        >
                          ✗ Cannot attend
                        </button>
                      </div>
                    ) : (
                      <div className="already-responded-status">
                        <span
                          className={`status-badge ${guest.attending ? "attending" : "not-attending"}`}
                        >
                          {guest.attending ? "Attending" : "Not Attending"}
                        </span>
                      </div>
                    )}
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
                disabled={attendingGuests.some(
                  (guest) => !guest.alreadyRSVPd && !guest.responseType
                )}
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
                    <div className="existing-responses">
                      <p>
                        <strong>Previous Responses:</strong>
                      </p>
                      <ul>
                        {attendingGuests
                          .filter((guest) => guest.alreadyRSVPd)
                          .map((guest, index) => (
                            <li
                              key={index}
                              className={
                                guest.attending
                                  ? "attending-guest"
                                  : "not-attending-guest"
                              }
                            >
                              {guest.attending ? "✓" : "✗"} {guest.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </>
                )}

                {attendingGuests.filter(
                  (guest) =>
                    !guest.alreadyRSVPd && guest.responseType === "attending"
                ).length > 0 && (
                  <>
                    <p>
                      <strong>
                        {isUpdatingExisting ? "New " : ""}Attending Guests:
                      </strong>
                    </p>
                    <ul>
                      {attendingGuests
                        .filter(
                          (guest) =>
                            !guest.alreadyRSVPd &&
                            guest.responseType === "attending"
                        )
                        .map((guest, index) => (
                          <li key={index} className="attending-guest">
                            ✓ {guest.name}
                          </li>
                        ))}
                    </ul>
                  </>
                )}

                {attendingGuests.filter(
                  (guest) =>
                    !guest.alreadyRSVPd && guest.responseType === "notAttending"
                ).length > 0 && (
                  <>
                    <p>
                      <strong>
                        {isUpdatingExisting ? "New " : ""}Not Attending:
                      </strong>
                    </p>
                    <ul>
                      {attendingGuests
                        .filter(
                          (guest) =>
                            !guest.alreadyRSVPd &&
                            guest.responseType === "notAttending"
                        )
                        .map((guest, index) => (
                          <li key={index} className="not-attending-guest">
                            ✗ {guest.name}
                          </li>
                        ))}
                    </ul>
                  </>
                )}
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
