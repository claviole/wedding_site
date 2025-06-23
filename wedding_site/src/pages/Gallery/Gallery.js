import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "./Gallery.css";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const storage = getStorage();
      const photosRef = ref(storage, "engagementPhotos");

      const photosList = await listAll(photosRef);
      const photoUrls = await Promise.all(
        photosList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            url,
            name: item.name,
            id: item.name,
          };
        })
      );

      setPhotos(photoUrls);
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  };

  const prevPhoto = () => {
    const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
  };

  useEffect(() => {
    if (selectedPhoto) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [selectedPhoto, currentIndex]);

  return (
    <div className="gallery-page">
      <motion.section
        className="gallery-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="overlay"></div>
        <div className="gallery-hero-content">
          <h1>Our Gallery</h1>
          <div className="gallery-hero-divider">
            <div className="divider-line"></div>
            <div className="divider-icon"></div>
            <div className="divider-line"></div>
          </div>
          <p>Capturing the moments that tell our story</p>
        </div>
      </motion.section>

      <section className="gallery-intro">
        <motion.div
          className="intro-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2>Our Journey Together</h2>
          <p>
            These photos capture the beautiful moments of our engagement and the
            love we share. Each image tells a part of our story as we prepare
            for the next chapter of our lives together.
          </p>
          <div className="flourish"></div>
        </motion.div>
      </section>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading our beautiful memories...</p>
        </div>
      ) : (
        <motion.section
          className="gallery-masonry"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="masonry-grid">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="masonry-item"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => openLightbox(photo, index)}
              >
                <div className="photo-container">
                  <img
                    src={photo.url}
                    alt={`Engagement photo ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="photo-overlay">
                    <div className="photo-overlay-content">
                      <span className="view-text">View Full Size</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="close-button" onClick={closeLightbox}>
              ×
            </button>

            <button className="nav-button prev-button" onClick={prevPhoto}>
              ‹
            </button>

            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lightbox-image">
                <img src={selectedPhoto.url} alt="Full size view" />
              </div>
              <div className="lightbox-info">
                <p>
                  {currentIndex + 1} of {photos.length}
                </p>
              </div>
            </motion.div>

            <button className="nav-button next-button" onClick={nextPhoto}>
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="closing-flourish"></div>
    </div>
  );
};

export default Gallery;
