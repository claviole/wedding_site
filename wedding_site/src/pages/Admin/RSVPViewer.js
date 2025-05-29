import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRSVPs } from "../../firebase/guestService";
import * as XLSX from "xlsx";
import "./RSVPViewer.css";

const RSVPViewer = () => {
  const [rsvps, setRsvps] = useState([]);
  const [filteredRsvps, setFilteredRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    loadRSVPs();
  }, []);

  useEffect(() => {
    filterAndSortRSVPs();
  }, [rsvps, searchTerm, sortBy, sortOrder]);

  const loadRSVPs = async () => {
    try {
      setLoading(true);
      const rsvpData = await getRSVPs();
      setRsvps(rsvpData);
    } catch (error) {
      console.error("Error loading RSVPs:", error);
      alert("Error loading RSVPs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRSVPs = () => {
    let filtered = rsvps;

    // Apply search filter
    if (searchTerm) {
      filtered = rsvps.filter((rsvp) => {
        const primaryMatch = rsvp.primaryGuestName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const attendingMatch = rsvp.attendingGuests.some((guest) =>
          guest.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const emailMatch = rsvp.contactEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return primaryMatch || attendingMatch || emailMatch;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "primaryGuestName":
          aValue = a.primaryGuestName.toLowerCase();
          bValue = b.primaryGuestName.toLowerCase();
          break;
        case "totalAttending":
          aValue = a.totalAttending;
          bValue = b.totalAttending;
          break;
        case "submittedAt":
          aValue = new Date(a.submittedAt);
          bValue = new Date(b.submittedAt);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRsvps(filtered);
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

  const getTotalAttendingCount = () => {
    return filteredRsvps.reduce(
      (total, rsvp) => total + rsvp.totalAttending,
      0
    );
  };

  const exportToExcel = () => {
    // Create detailed guest list
    const guestList = [];

    filteredRsvps.forEach((rsvp) => {
      rsvp.attendingGuests.forEach((guestName, index) => {
        guestList.push({
          "Guest Name": guestName,
          "Contact Email": index === 0 ? rsvp.contactEmail : "",
          "Contact Phone":
            index === 0 ? rsvp.contactPhone || "Not provided" : "",
          "RSVP Date": formatDate(rsvp.submittedAt),
          "Party Size": rsvp.totalAttending,
        });
      });
    });

    // Create summary sheet
    const summary = [
      { Metric: "Total RSVPs", Value: filteredRsvps.length },
      { Metric: "Total Guests Attending", Value: getTotalAttendingCount() },
      {
        Metric: "Average Party Size",
        Value: (getTotalAttendingCount() / filteredRsvps.length || 0).toFixed(
          1
        ),
      },
      { Metric: "Export Date", Value: new Date().toLocaleDateString() },
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add guest list sheet
    const guestWs = XLSX.utils.json_to_sheet(guestList);
    XLSX.utils.book_append_sheet(wb, guestWs, "Guest List");

    // Add summary sheet
    const summaryWs = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    // Style the headers (basic styling)
    const range = XLSX.utils.decode_range(guestWs["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!guestWs[address]) continue;
      guestWs[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "E86D5C" } },
      };
    }

    // Generate filename with current date
    const filename = `Wedding_RSVPs_${new Date().toISOString().split("T")[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <div className="rsvp-viewer-container">
        <div className="loading-message">Loading RSVPs...</div>
      </div>
    );
  }

  return (
    <div className="rsvp-viewer-container">
      <div className="rsvp-viewer-header">
        <div className="header-top">
          <h1>Wedding RSVPs</h1>
          <Link to="/admin/rsvp-management" className="back-to-admin-btn">
            ← Back to Admin
          </Link>
        </div>

        <div className="rsvp-stats">
          <div className="stat-card">
            <div className="stat-number">{filteredRsvps.length}</div>
            <div className="stat-label">Total RSVPs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getTotalAttendingCount()}</div>
            <div className="stat-label">Guests Attending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {filteredRsvps.length > 0
                ? (getTotalAttendingCount() / filteredRsvps.length).toFixed(1)
                : 0}
            </div>
            <div className="stat-label">Avg Party Size</div>
          </div>
        </div>

        <div className="rsvp-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, email, or guest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="submittedAt">Sort by Date</option>
              <option value="primaryGuestName">Sort by Name</option>
              <option value="totalAttending">Sort by Party Size</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="sort-order-btn"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          <button onClick={exportToExcel} className="export-btn">
            📊 Export to Excel
          </button>
        </div>
      </div>

      <div className="rsvp-list">
        {filteredRsvps.length === 0 ? (
          <div className="no-rsvps">
            {searchTerm
              ? "No RSVPs match your search."
              : "No RSVPs submitted yet."}
          </div>
        ) : (
          filteredRsvps.map((rsvp) => (
            <div key={rsvp.id} className="rsvp-card">
              <div className="rsvp-card-header">
                <div className="primary-guest-info">
                  <h3>{rsvp.primaryGuestName}</h3>
                  <span className="party-size">
                    {rsvp.totalAttending} guest
                    {rsvp.totalAttending !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="rsvp-date">{formatDate(rsvp.submittedAt)}</div>
              </div>

              <div className="rsvp-card-body">
                <div className="attending-guests">
                  <h4>Attending Guests:</h4>
                  <ul>
                    {rsvp.attendingGuests.map((guest, index) => (
                      <li
                        key={index}
                        className={
                          index === 0 ? "primary-guest" : "additional-guest"
                        }
                      >
                        {guest}{" "}
                        {index === 0 && (
                          <span className="primary-badge">Primary</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Email:</strong>
                    <a href={`mailto:${rsvp.contactEmail}`}>
                      {rsvp.contactEmail}
                    </a>
                  </div>
                  {rsvp.contactPhone && (
                    <div className="contact-item">
                      <strong>Phone:</strong>
                      <a href={`tel:${rsvp.contactPhone}`}>
                        {rsvp.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RSVPViewer;
