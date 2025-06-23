import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

class PhotoPreloader {
  constructor() {
    this.photos = [];
    this.isLoading = false;
    this.isLoaded = false;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    if (this.isLoaded) {
      callback(this.photos);
    }
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((callback) => callback(this.photos));
  }

  async preloadPhotos() {
    if (this.isLoading || this.isLoaded) return this.photos;

    this.isLoading = true;

    try {
      const photosRef = ref(storage, "engagementPhotos");

      const photosList = await listAll(photosRef);
      const photoUrls = await Promise.all(
        photosList.items.map(async (item) => {
          const url = await getDownloadURL(item);

          // Preload the actual image
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                url,
                name: item.name,
                id: item.name,
                width: img.naturalWidth,
                height: img.naturalHeight,
                aspectRatio: img.naturalHeight / img.naturalWidth,
              });
            };
            img.onerror = () => {
              resolve({
                url,
                name: item.name,
                id: item.name,
                width: 400,
                height: 600,
                aspectRatio: 1.5,
              });
            };
            img.src = url;
          });
        })
      );

      // Shuffle photos for better visual distribution
      this.photos = photoUrls.sort(() => Math.random() - 0.5);
      this.isLoaded = true;
      this.notify();

      return this.photos;
    } catch (error) {
      console.error("Error preloading photos:", error);
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  getPhotos() {
    return this.photos;
  }

  isPhotosLoaded() {
    return this.isLoaded;
  }
}

// Create singleton instance
const photoPreloader = new PhotoPreloader();

// Start preloading after a delay to ensure Firebase is fully initialized
setTimeout(() => {
  photoPreloader.preloadPhotos();
}, 2000); // Increased delay to ensure Firebase is ready

export default photoPreloader;
