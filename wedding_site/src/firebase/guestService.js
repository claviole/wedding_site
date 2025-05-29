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
    return {
      id: docRef.id,
      ...guestFileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error adding guest file:", error);
    throw error;
  }
};

export const getGuestFiles = async () => {
  try {
    const q = query(
      collection(db, GUEST_FILES_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const guestFiles = [];
    querySnapshot.forEach((doc) => {
      guestFiles.push({ id: doc.id, ...doc.data() });
    });
    return guestFiles;
  } catch (error) {
    console.error("Error getting guest files:", error);
    throw error;
  }
};

export const deleteGuestFile = async (guestFileId) => {
  try {
    await deleteDoc(doc(db, GUEST_FILES_COLLECTION, guestFileId));
    return guestFileId;
  } catch (error) {
    console.error("Error deleting guest file:", error);
    throw error;
  }
};

export const updateGuestFile = async (guestFileId, guestFileData) => {
  try {
    const guestFileRef = doc(db, GUEST_FILES_COLLECTION, guestFileId);
    const updateData = {
      ...guestFileData,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(guestFileRef, updateData);
    return { id: guestFileId, ...updateData };
  } catch (error) {
    console.error("Error updating guest file:", error);
    throw error;
  }
};

// Enhanced search function for RSVP - excludes already RSVP'd guests
export const findGuestFileByName = async (guestName) => {
  try {
    // Get all guest files
    const guestFilesQuery = query(collection(db, GUEST_FILES_COLLECTION));
    const guestFilesSnapshot = await getDocs(guestFilesQuery);
    const guestFiles = [];
    guestFilesSnapshot.forEach((doc) => {
      guestFiles.push({ id: doc.id, ...doc.data() });
    });

    // Get all existing RSVPs to exclude them
    const rsvpsQuery = query(collection(db, RSVPS_COLLECTION));
    const rsvpsSnapshot = await getDocs(rsvpsQuery);
    const rsvpedGuestFileIds = new Set();
    rsvpsSnapshot.forEach((doc) => {
      const rsvpData = doc.data();
      rsvpedGuestFileIds.add(rsvpData.guestFileId);
    });

    // Filter out guest files that have already RSVP'd
    const availableGuestFiles = guestFiles.filter(
      (file) => !rsvpedGuestFileIds.has(file.id)
    );

    // Search for guest in primary name or additional guests from available files
    const foundFiles = availableGuestFiles.filter((file) => {
      const primaryMatch = file.primaryName
        .toLowerCase()
        .includes(guestName.toLowerCase());
      const additionalMatch = file.additionalGuests.some((guest) =>
        guest.toLowerCase().includes(guestName.toLowerCase())
      );
      return primaryMatch || additionalMatch;
    });

    // Return the best match (exact match first, then partial matches)
    const exactMatch = foundFiles.find(
      (file) =>
        file.primaryName.toLowerCase() === guestName.toLowerCase() ||
        file.additionalGuests.some(
          (guest) => guest.toLowerCase() === guestName.toLowerCase()
        )
    );

    return exactMatch || foundFiles[0] || null;
  } catch (error) {
    console.error("Error finding guest file by name:", error);
    throw error;
  }
};

// RSVP Functions
export const submitRSVP = async (rsvpData) => {
  try {
    const docRef = await addDoc(collection(db, RSVPS_COLLECTION), rsvpData);
    return { id: docRef.id, ...rsvpData };
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    throw error;
  }
};

export const getRSVPs = async () => {
  try {
    const rsvpsQuery = query(
      collection(db, RSVPS_COLLECTION),
      orderBy("submittedAt", "desc")
    );
    const rsvpsSnapshot = await getDocs(rsvpsQuery);
    const rsvps = [];
    rsvpsSnapshot.forEach((doc) => {
      rsvps.push({ id: doc.id, ...doc.data() });
    });
    return rsvps;
  } catch (error) {
    console.error("Error getting RSVPs:", error);
    throw error;
  }
};

export const getRSVPByGuestFile = async (guestFileId) => {
  try {
    const q = query(
      collection(db, RSVPS_COLLECTION),
      where("guestFileId", "==", guestFileId)
    );
    const querySnapshot = await getDocs(q);
    const rsvps = [];
    querySnapshot.forEach((doc) => {
      rsvps.push({ id: doc.id, ...doc.data() });
    });
    return rsvps[0] || null; // Return first RSVP or null
  } catch (error) {
    console.error("Error getting RSVP by guest file:", error);
    throw error;
  }
};
