import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  addGuestFile,
  getGuestFiles,
  deleteGuestFile,
  updateGuestFile,
  getRSVPs,
} from "../../firebase/guestService";
import "./RSVPManagement.css";

const RSVPManagement = () => {
  const [guestFiles, setGuestFiles] = useState([]);
  const [filteredGuestFiles, setFilteredGuestFiles] = useState([]);
  const [rsvps, setRSVPs] = useState([]);
  const [filteredRSVPs, setFilteredRSVPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotAttending, setShowNotAttending] = useState(false);
  const [activeTab, setActiveTab] = useState("guestFiles"); // 'guestFiles' or 'notAttending'
  const [newGuestFile, setNewGuestFile] = useState({
    primaryName: "",
    additionalGuests: [""],
    maxGuests: 1,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortGuests();
  }, [guestFiles, searchTerm]);

  useEffect(() => {
    filterNotAttendingRSVPs();
  }, [rsvps, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [guestFilesData, rsvpsData] = await Promise.all([
        getGuestFiles(),
        getRSVPs(),
      ]);
      setGuestFiles(guestFilesData);
      setRSVPs(rsvpsData);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Error loading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterNotAttendingRSVPs = () => {
    // Filter RSVPs that have any guests not attending (either old format or new format)
    let filtered = rsvps.filter((rsvp) => {
      // Old format: notAttending: true
      if (rsvp.notAttending === true) return true;

      // New format: notAttendingGuests array with content
      if (rsvp.notAttendingGuests && rsvp.notAttendingGuests.length > 0)
        return true;

      return false;
    });

    if (searchTerm) {
      filtered = filtered.filter((rsvp) =>
        rsvp.primaryGuestName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by submission date (most recent first)
    filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    setFilteredRSVPs(filtered);
  };

  const formatName = (name) => {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const filterAndSortGuests = () => {
    let filtered = guestFiles;

    if (searchTerm) {
      filtered = guestFiles.filter((file) => {
        const primaryMatch = file.primaryName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const additionalMatch = file.additionalGuests.some((guest) =>
          guest.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return primaryMatch || additionalMatch;
      });
    }

    // Sort alphabetically by primary guest name
    filtered.sort((a, b) => a.primaryName.localeCompare(b.primaryName));

    setFilteredGuestFiles(filtered);
  };

  // Calculate total guest count
  const getTotalGuestCount = (files) => {
    return files.reduce((total, file) => {
      // Count primary guest (1) + additional guests
      return total + 1 + file.additionalGuests.length;
    }, 0);
  };

  const loadGuestFiles = async () => {
    try {
      setLoading(true);
      const files = await getGuestFiles();
      setGuestFiles(files);
    } catch (error) {
      console.error("Error loading guest files:", error);
      alert("Error loading guest files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGuestFile = async () => {
    if (!newGuestFile.primaryName.trim()) {
      alert("Primary guest name is required");
      return;
    }

    try {
      setSaving(true);
      const filteredAdditionalGuests = newGuestFile.additionalGuests.filter(
        (name) => name.trim() !== ""
      );

      const guestFileData = {
        primaryName: formatName(newGuestFile.primaryName),
        additionalGuests: filteredAdditionalGuests.map((name) =>
          formatName(name)
        ),
        maxGuests: parseInt(newGuestFile.maxGuests) || 1,
        notes: newGuestFile.notes.trim(),
      };

      if (editingFile) {
        const updatedFile = await updateGuestFile(
          editingFile.id,
          guestFileData
        );
        setGuestFiles((prev) =>
          prev.map((file) => (file.id === editingFile.id ? updatedFile : file))
        );
        setEditingFile(null);
      } else {
        const savedGuestFile = await addGuestFile(guestFileData);
        setGuestFiles((prev) => [savedGuestFile, ...prev]);
      }

      setShowAddForm(false);
      setNewGuestFile({
        primaryName: "",
        additionalGuests: [""],
        maxGuests: 1,
        notes: "",
      });
    } catch (error) {
      console.error("Error saving guest file:", error);
      alert("Error saving guest file. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditGuestFile = (file) => {
    setNewGuestFile({
      primaryName: file.primaryName,
      additionalGuests:
        file.additionalGuests.length > 0 ? file.additionalGuests : [""],
      maxGuests: file.maxGuests,
      notes: file.notes || "",
    });
    setEditingFile(file);
    setShowAddForm(true);
  };

  const handleDeleteGuestFile = async (guestFileId) => {
    if (!window.confirm("Are you sure you want to delete this guest file?")) {
      return;
    }

    try {
      await deleteGuestFile(guestFileId);
      setGuestFiles((prev) => prev.filter((file) => file.id !== guestFileId));
    } catch (error) {
      console.error("Error deleting guest file:", error);
      alert("Error deleting guest file. Please try again.");
    }
  };

  const addAdditionalGuestField = () => {
    setNewGuestFile((prev) => ({
      ...prev,
      additionalGuests: [...prev.additionalGuests, ""],
    }));
  };

  const removeAdditionalGuestField = (index) => {
    setNewGuestFile((prev) => ({
      ...prev,
      additionalGuests: prev.additionalGuests.filter((_, i) => i !== index),
    }));
  };

  const updateAdditionalGuest = (index, value) => {
    setNewGuestFile((prev) => ({
      ...prev,
      additionalGuests: prev.additionalGuests.map((guest, i) =>
        i === index ? value : guest
      ),
    }));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  const cancelEdit = () => {
    setEditingFile(null);
    setShowAddForm(false);
    setNewGuestFile({
      primaryName: "",
      additionalGuests: [""],
      maxGuests: 1,
      notes: "",
    });
  };

  if (loading) {
    return (
      <div className="rsvp-management-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  const notAttendingCount = rsvps.filter((rsvp) => {
    // Old format: notAttending: true
    if (rsvp.notAttending === true) return true;

    // New format: notAttendingGuests array with content
    if (rsvp.notAttendingGuests && rsvp.notAttendingGuests.length > 0)
      return true;

    return false;
  }).length;

  return (
    <div className="rsvp-management-page">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">RSVP Management</h1>
            <p className="page-subtitle">
              Manage guest files and view responses
            </p>
          </div>
          <div className="header-actions">
            <Link to="/" className="back-home-btn">
              ← Back to Website
            </Link>
            <button
              onClick={() => setShowAddForm(true)}
              className="add-guest-btn"
            >
              + Add Guest File
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "guestFiles" ? "active" : ""}`}
          onClick={() => setActiveTab("guestFiles")}
        >
          Guest Files ({filteredGuestFiles.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "notAttending" ? "active" : ""}`}
          onClick={() => setActiveTab("notAttending")}
        >
          Not Attending ({notAttendingCount})
        </button>
      </div>

      {showAddForm && (
        <div className="form-modal-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3>{editingFile ? "Edit Guest File" : "Add New Guest File"}</h3>
              <button onClick={cancelEdit} className="close-form-btn">
                ×
              </button>
            </div>

            <div className="form-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Guest Name *</label>
                  <input
                    type="text"
                    placeholder="Enter primary guest name"
                    value={newGuestFile.primaryName}
                    onChange={(e) =>
                      setNewGuestFile((prev) => ({
                        ...prev,
                        primaryName: e.target.value,
                      }))
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Maximum Guests Allowed</label>
                  <input
                    type="number"
                    min="1"
                    value={newGuestFile.maxGuests}
                    onChange={(e) =>
                      setNewGuestFile((prev) => ({
                        ...prev,
                        maxGuests: e.target.value,
                      }))
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="additional-guests-section">
                <label>Additional Guests</label>
                <div className="additional-guests-list">
                  {newGuestFile.additionalGuests.map((guest, index) => (
                    <div key={index} className="additional-guest-row">
                      <input
                        type="text"
                        placeholder="Enter guest name"
                        value={guest}
                        onChange={(e) =>
                          updateAdditionalGuest(index, e.target.value)
                        }
                        className="form-input"
                      />
                      {newGuestFile.additionalGuests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAdditionalGuestField(index)}
                          className="remove-guest-btn"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAdditionalGuestField}
                    className="add-another-guest-btn"
                  >
                    + Add Another Guest
                  </button>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Notes (Optional)</label>
                <textarea
                  placeholder="Any special notes about this guest file..."
                  value={newGuestFile.notes}
                  onChange={(e) =>
                    setNewGuestFile((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="form-textarea"
                />
              </div>

              <div className="form-actions">
                <button
                  onClick={cancelEdit}
                  className="cancel-btn"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGuestFile}
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingFile
                      ? "Update Guest File"
                      : "Save Guest File"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "guestFiles" && (
        <div className="guest-files-section">
          <div className="section-header">
            <div className="section-title-info">
              <h2>Guest Files ({filteredGuestFiles.length})</h2>
              <span className="total-guests-count">
                Total Guests: {getTotalGuestCount(filteredGuestFiles)}
              </span>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {filteredGuestFiles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>{searchTerm ? "No guests found" : "No guest files yet"}</h3>
              <p>
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Create your first guest file to get started with RSVP management."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="empty-action-btn"
                >
                  Add First Guest File
                </button>
              )}
            </div>
          ) : (
            <div className="guest-files-grid">
              {filteredGuestFiles.map((file) => (
                <div key={file.id} className="guest-card">
                  <div className="card-header">
                    <h4>{file.primaryName}</h4>
                    <div className="card-actions">
                      <button
                        onClick={() => handleEditGuestFile(file)}
                        className="edit-btn"
                        title="Edit guest file"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteGuestFile(file.id)}
                        className="delete-btn"
                        title="Delete guest file"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="card-body">
                    {file.additionalGuests.length > 0 && (
                      <div className="additional-guests">
                        <strong>Additional Guests:</strong>
                        <ul>
                          {file.additionalGuests.map((guest, index) => (
                            <li key={index}>{guest}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="guest-info">
                      <span className="max-guests-badge">
                        Max: {file.maxGuests} guest
                        {file.maxGuests !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {file.notes && (
                      <div className="notes">
                        <strong>Notes:</strong> {file.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "notAttending" && (
        <div className="not-attending-section">
          <div className="section-header">
            <div className="section-title-info">
              <h2>Not Attending Responses ({notAttendingCount})</h2>
              <span className="section-subtitle">
                Guests who have declined the invitation
              </span>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search not attending guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {filteredRSVPs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">😔</div>
              <h3>
                {searchTerm
                  ? "No matching responses found"
                  : "No 'Not Attending' responses yet"}
              </h3>
              <p>
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "When guests decline the invitation, they will appear here."}
              </p>
            </div>
          ) : (
            <div className="not-attending-grid">
              {filteredRSVPs.map((rsvp) => {
                // Determine if this is old format (all not attending) or new format (mixed)
                const isFullyNotAttending = rsvp.notAttending === true;
                const attendingGuests = rsvp.attendingGuests || [];
                const notAttendingGuests = rsvp.notAttendingGuests || [];
                const isMixedResponse =
                  attendingGuests.length > 0 && notAttendingGuests.length > 0;

                return (
                  <div key={rsvp.id} className="not-attending-card">
                    <div className="card-header">
                      <h4>{rsvp.primaryGuestName}</h4>
                      <div className="status-badges">
                        {isFullyNotAttending && (
                          <div className="status-badge not-attending">
                            All Not Attending
                          </div>
                        )}
                        {isMixedResponse && (
                          <div className="status-badge mixed">
                            Mixed Response
                          </div>
                        )}
                        {!isFullyNotAttending &&
                          !isMixedResponse &&
                          notAttendingGuests.length > 0 && (
                            <div className="status-badge partial-not-attending">
                              Partial Not Attending
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="rsvp-details">
                        <p>
                          <strong>Submitted:</strong>{" "}
                          {formatDate(rsvp.submittedAt)}
                        </p>
                        <p>
                          <strong>Contact Email:</strong> {rsvp.contactEmail}
                        </p>
                        {rsvp.contactPhone && (
                          <p>
                            <strong>Phone:</strong> {rsvp.contactPhone}
                          </p>
                        )}
                        <p>
                          <strong>Max Guests:</strong> {rsvp.maxGuestsAllowed}
                        </p>

                        {/* Show attending guests if any */}
                        {attendingGuests.length > 0 && (
                          <div className="guest-breakdown">
                            <p>
                              <strong>
                                Attending ({attendingGuests.length}):
                              </strong>
                            </p>
                            <ul className="guest-list attending">
                              {attendingGuests.map((guest, index) => (
                                <li key={index}>✓ {guest}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Show not attending guests */}
                        {notAttendingGuests.length > 0 && (
                          <div className="guest-breakdown">
                            <p>
                              <strong>
                                Not Attending ({notAttendingGuests.length}):
                              </strong>
                            </p>
                            <ul className="guest-list not-attending">
                              {notAttendingGuests.map((guest, index) => (
                                <li key={index}>✗ {guest}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Legacy full "not attending" display */}
                        {isFullyNotAttending && (
                          <div className="guest-breakdown">
                            <p>
                              <strong>Status:</strong> All guests declined
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RSVPManagement;
