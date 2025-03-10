import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Gallery.css";
// Import the image
import engagementPhoto1 from "../../assets/images/galleryImages/D&C-71.jpg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // This will be replaced with your actual engagement photos
  const galleryImages = [
    { id: 1, src: engagementPhoto1, alt: "Engagement photo 1", category: "Engagement" },
    { id: 2, alt: "Engagement photo 2", category: "Engagement" },
    { id: 3, alt: "Engagement photo 3", category: "Engagement" },
    { id: 4, alt: "Couple photo 1", category: "Couple" },
    { id: 5, alt: "Couple photo 2", category: "Couple" },
    { id: 6, alt: "Couple photo 3", category: "Couple" },
    { id: 7, alt: "Venue photo 1", category: "Venue" },
    { id: 8, alt: "Venue photo 2", category: "Venue" },
    { id: 9, alt: "Engagement photo 4", category: "Engagement" },
    { id: 10, alt: "Couple photo 4", category: "Couple" },
    { id: 11, alt: "Engagement photo 5", category: "Engagement" },
    { id: 12, alt: "Venue photo 3", category: "Venue" },
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Engagement", "Couple", "Venue"];

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

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
          <h1>Our Journey Together</h1>
          <div className="gallery-hero-divider">
            <div className="divider-line"></div>
            <div className="divider-icon"></div>
            <div className="divider-line"></div>
          </div>
          <p>A glimpse into our love story and the moments we've shared</p>
        </div>
      </motion.section>

      <section className="gallery-intro">
        <motion.div 
          className="intro-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2>Capturing Our Love</h2>
          <p>
            From the day we met to our engagement, these photos tell the story of our journey together.
            Each moment captured is a testament to the love we share and the beautiful future we're building.
          </p>
          <div className="flourish"></div>
        </motion.div>
      </section>

      <section className="gallery-filter">
        <div className="filter-tabs">
          {categories.map(category => (
            <button 
              key={category} 
              className={`filter-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <motion.section 
        className="gallery-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {filteredImages.map((image) => (
          <motion.div 
            key={image.id} 
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openLightbox(image)}
          >
            <div className={`gallery-image ${!image.src ? "placeholder" : ""}`}>
              {image.src ? (
                <img src={image.src} alt={image.alt} />
              ) : (
                <div className="image-number">{image.id}</div>
              )}
            </div>
            <div className="image-caption">
              <p>{image.alt}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {selectedImage && (
        <motion.div 
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <button className="close-button" onClick={closeLightbox}>×</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className={`lightbox-image ${!selectedImage.src ? "placeholder" : ""}`}>
              {selectedImage.src ? (
                <img src={selectedImage.src} alt={selectedImage.alt} />
              ) : (
                <div className="image-number">{selectedImage.id}</div>
              )}
            </div>
            <div className="lightbox-caption">
              <p>{selectedImage.alt}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="gallery-footer">
        <p>❖ Our adventure continues ❖</p>
      </div>
    </div>
  );
};

export default Gallery;
