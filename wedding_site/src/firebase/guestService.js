import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "./config";

const GUEST_FILES_COLLECTION = "guestFiles";
const RSVPS_COLLECTION = "rsvps";

// Guest Files Functions
export const addGuestFile = async (guestFileData) => {
  try {
    const docRef = await addDoc(collection(db, GUEST_FILES_COLLECTION), {
      ...guestFileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding guest file:", error);
    throw error;
  }
};

export const getGuestFiles = async () => {
  try {
    const q = query(
      collection(db, GUEST_FILES_COLLECTION),
      orderBy("primaryName")
    );
    const querySnapshot = await getDocs(q);
    const guestFiles = [];

    querySnapshot.forEach((doc) => {
      guestFiles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return guestFiles;
  } catch (error) {
    console.error("Error getting guest files:", error);
    throw error;
  }
};

export const deleteGuestFile = async (id) => {
  try {
    await deleteDoc(doc(db, GUEST_FILES_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting guest file:", error);
    throw error;
  }
};

export const updateGuestFile = async (id, guestFileData) => {
  try {
    const docRef = doc(db, GUEST_FILES_COLLECTION, id);
    await updateDoc(docRef, {
      ...guestFileData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating guest file:", error);
    throw error;
  }
};

// Enhanced function to find guest file by name and check RSVP status
export const findGuestFileByName = async (searchName) => {
  try {
    const guestFilesSnapshot = await getDocs(
      collection(db, GUEST_FILES_COLLECTION)
    );
    const searchLower = searchName.toLowerCase().trim();

    for (const docSnapshot of guestFilesSnapshot.docs) {
      const guestFile = { id: docSnapshot.id, ...docSnapshot.data() };

      // Check if search name matches primary guest or any additional guest
      const primaryMatch = guestFile.primaryName
        .toLowerCase()
        .includes(searchLower);
      const additionalMatch = guestFile.additionalGuests.some((name) =>
        name.toLowerCase().includes(searchLower)
      );

      if (primaryMatch || additionalMatch) {
        // Get existing RSVP for this guest file if it exists
        const existingRSVP = await getExistingRSVP(guestFile.id);

        return {
          ...guestFile,
          existingRSVP: existingRSVP,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding guest file:", error);
    throw error;
  }
};

// Get existing RSVP for a guest file
export const getExistingRSVP = async (guestFileId) => {
  try {
    console.log("Getting existing RSVP for guestFileId:", guestFileId);

    const q = query(
      collection(db, RSVPS_COLLECTION),
      where("guestFileId", "==", guestFileId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const rsvpDoc = querySnapshot.docs[0];
      const rsvpData = rsvpDoc.data();

      console.log("Raw RSVP data from Firestore:", rsvpData);

      // Migrate old format to new format if needed
      const migratedData = {
        id: rsvpDoc.id,
        ...rsvpData,
        // Ensure arrays exist for new format
        attendingGuests: Array.isArray(rsvpData.attendingGuests)
          ? rsvpData.attendingGuests
          : [],
        notAttendingGuests: Array.isArray(rsvpData.notAttendingGuests)
          ? rsvpData.notAttendingGuests
          : [],
      };

      console.log("Migrated RSVP data:", migratedData);
      return migratedData;
    }

    console.log("No existing RSVP found");
    return null;
  } catch (error) {
    console.error("Error getting existing RSVP:", error);
    console.error("Error details:", error.message, error.code);
    throw error;
  }
};

// Helper function to validate RSVP data structure
const validateRSVPData = (rsvpData) => {
  const requiredFields = ["guestFileId", "primaryGuestName", "contactEmail"];
  const missingFields = requiredFields.filter((field) => !rsvpData[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  if (!Array.isArray(rsvpData.attendingGuests)) {
    throw new Error("attendingGuests must be an array");
  }

  if (!Array.isArray(rsvpData.notAttendingGuests)) {
    throw new Error("notAttendingGuests must be an array");
  }

  return true;
};

// RSVP Functions - Updated to handle partial RSVPs and mixed responses
export const submitRSVP = async (rsvpData) => {
  try {
    console.log("Submitting RSVP with data:", rsvpData);

    // Validate the data structure
    validateRSVPData(rsvpData);

    // Check if an RSVP already exists for this guest file
    const existingRSVP = await getExistingRSVP(rsvpData.guestFileId);
    console.log("Existing RSVP found:", existingRSVP);

    if (existingRSVP) {
      // Update existing RSVP by merging the attending and not attending guests
      const existingAttending = existingRSVP.attendingGuests || [];
      const existingNotAttending = existingRSVP.notAttendingGuests || [];

      const newAttending = rsvpData.attendingGuests || [];
      const newNotAttending = rsvpData.notAttendingGuests || [];

      console.log("Merging guests:", {
        existingAttending,
        existingNotAttending,
        newAttending,
        newNotAttending,
      });

      // Merge and deduplicate guest lists
      const mergedAttendingGuests = [
        ...new Set([...existingAttending, ...newAttending]),
      ];

      const mergedNotAttendingGuests = [
        ...new Set([...existingNotAttending, ...newNotAttending]),
      ];

      // Clean up the data - remove undefined values and ensure proper structure
      const updatedRSVPData = {
        guestFileId: rsvpData.guestFileId,
        primaryGuestName: rsvpData.primaryGuestName,
        attendingGuests: mergedAttendingGuests,
        notAttendingGuests: mergedNotAttendingGuests,
        totalAttending: mergedAttendingGuests.length,
        totalNotAttending: mergedNotAttendingGuests.length,
        contactEmail: rsvpData.contactEmail || existingRSVP.contactEmail,
        contactPhone: rsvpData.contactPhone || existingRSVP.contactPhone || "",
        submittedAt: existingRSVP.submittedAt, // Keep original submission date
        lastUpdatedAt: new Date().toISOString(),
        maxGuestsAllowed:
          rsvpData.maxGuestsAllowed || existingRSVP.maxGuestsAllowed,
      };

      console.log("Updating RSVP with data:", updatedRSVPData);

      const docRef = doc(db, RSVPS_COLLECTION, existingRSVP.id);
      await updateDoc(docRef, updatedRSVPData);

      console.log("RSVP updated successfully");
      return existingRSVP.id;
    } else {
      // Create new RSVP
      const newRSVPData = {
        ...rsvpData,
        // Ensure arrays exist
        attendingGuests: rsvpData.attendingGuests || [],
        notAttendingGuests: rsvpData.notAttendingGuests || [],
        totalAttending: (rsvpData.attendingGuests || []).length,
        totalNotAttending: (rsvpData.notAttendingGuests || []).length,
        contactPhone: rsvpData.contactPhone || "",
      };

      console.log("Creating new RSVP with data:", newRSVPData);

      const docRef = await addDoc(
        collection(db, RSVPS_COLLECTION),
        newRSVPData
      );

      console.log("New RSVP created successfully");
      return docRef.id;
    }
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    console.error("Error details:", error.message, error.code);
    throw error;
  }
};

export const getRSVPs = async () => {
  try {
    const q = query(
      collection(db, RSVPS_COLLECTION),
      orderBy("submittedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const rsvps = [];

    querySnapshot.forEach((doc) => {
      rsvps.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return rsvps;
  } catch (error) {
    console.error("Error getting RSVPs:", error);
    throw error;
  }
};

export const deleteRSVP = async (id) => {
  try {
    await deleteDoc(doc(db, RSVPS_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    throw error;
  }
};
