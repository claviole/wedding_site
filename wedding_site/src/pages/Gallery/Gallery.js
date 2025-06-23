import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import photoPreloader from "../../firebase/photoPreloader";
// Import Firebase config to ensure it's initialized
import "../../firebase/config";
import "./Gallery.css";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef();

  useEffect(() => {
    loadPhotos();
    setupIntersectionObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const setupIntersectionObserver = () => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );
  };

  const loadPhotos = async () => {
    try {
      // Check if photos are already preloaded
      if (photoPreloader.isPhotosLoaded()) {
        setPhotos(photoPreloader.getPhotos());
        setLoading(false);
        return;
      }

      // Subscribe to preloader updates
      const unsubscribe = photoPreloader.subscribe((preloadedPhotos) => {
        if (preloadedPhotos.length > 0) {
          setPhotos(preloadedPhotos);
          setLoading(false);
        }
      });

      // Trigger preloading if not already started
      const preloadedPhotos = await photoPreloader.preloadPhotos();
      if (preloadedPhotos.length > 0) {
        setPhotos(preloadedPhotos);
        setLoading(false);
      }

      return unsubscribe;
    } catch (error) {
      console.error("Error loading photos:", error);
      setLoading(false);
    }
  };

  const itemRef = useCallback((node, index) => {
    if (node && observerRef.current) {
      node.dataset.index = index;
      observerRef.current.observe(node);
    }
  }, []);

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = "auto";
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

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    },
    [currentIndex, photos.length]
  );

  useEffect(() => {
    if (selectedPhoto) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [selectedPhoto, handleKeyPress]);

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
          <h2>Our Engagement</h2>
          <p>
            These photos capture the beautiful moments of our engagement and the
            love we share.
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
        <section className="gallery-masonry">
          <div className="masonry-grid">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                ref={(node) => itemRef(node, index)}
                className={`masonry-item ${visibleItems.has(index) ? "visible" : ""}`}
                style={{
                  transitionDelay: `${(index % 8) * 0.1}s`,
                }}
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
              </div>
            ))}
          </div>
        </section>
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
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
