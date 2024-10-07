import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './CatInfo.css'; // Import your CSS file
import { openDB } from 'idb';
import { onAuthStateChanged, signOut  } from 'firebase/auth';
import { auth } from './firebaseConfig.js'; 
import { useNavigate } from 'react-router-dom';

// Open IndexedDB and create object store if needed
const dbPromise = openDB('CatAppDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('favorites')) {
      db.createObjectStore('favorites', { keyPath: 'id', autoIncrement: true });
    }
  },
});


// Save image blob to IndexedDB with favorite flag
const saveToIndexedDB = async (imageBlob, fact, favorite = false) => {
  const db = await dbPromise;
  console.log('Saving blob to IndexedDB:', imageBlob);
  return db.put('favorites', { imageBlob, fact, favorite });
};

// Retrieve all images from IndexedDB
const getAllFromIndexedDB = async () => {
  const db = await dbPromise;
  return db.getAll('favorites');
};

// Update favorite status in IndexedDB
const updateFavoriteInIndexedDB = async (id, favorite) => {
  const db = await dbPromise;
  const image = await db.get('favorites', id);
  if (image) {
    image.favorite = favorite;
    return db.put('favorites', image);
  }
};

// Fetch image as blob and store in IndexedDB
const fetchAndSaveImageAsBlob = async (fact) => {
  const imageUrl = 'https://cataas.com/cat?' + new Date().getTime();  // Ensure a unique image URL
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return await saveToIndexedDB(blob, fact, false);  // Save image blob with fact
  } catch (error) {
    console.error('Error fetching image blob:', error);
  }
};

  // Clear all favorites (set favorite to false for all records)
  const clearAllFavorites = async () => {
    const db = await dbPromise;
    const transaction = db.transaction('favorites', 'readwrite');
    const store = transaction.objectStore('favorites');
    const allRecords = await store.getAll();
  
    for (const record of allRecords) {
      record.favorite = false;  // Set favorite to false
      await store.put(record);  // Save the updated record
    }
  
    await transaction.done;
  };

const CatInfo = () => {
  const [catData, setCatData] = useState([]); 
  const [page, setPage] = useState(1); 
  const [favorites, setFavorites] = useState([]); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentPage, setCurrentPage] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(0);
  const [isVideoExiting, setIsVideoExiting] = useState(false);
  const observer = useRef();
  const [imageFile, setImageFile] = useState(null); 
  const [catFact, setCatFact] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation
 
 
  // Intersection Observer to trigger more loading as the user scrolls
 const lastCatElementRef = useCallback(node => {
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setPage(prevPage => prevPage + 1); // Load next page
    }
  });
  if (node) observer.current.observe(node);
}, []);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

   const toggleUploadModal = () => {
    setIsUploadModalOpen(!isUploadModalOpen);
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleFactInput = (e) => {
    setCatFact(e.target.value);
  };

  // Function to add uploaded image and fact to IndexedDB
  const handleUpload = async () => {
    if (!imageFile || !catFact) {
      alert("Please provide both an image and a fact");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(imageFile); 
    reader.onloadend = async () => {
      const imageBlob = new Blob([reader.result], { type: imageFile.type });

      // Save to IndexedDB (similar to saving fetched images)
      await saveToIndexedDB(imageBlob, catFact);

      // Refresh the grid after upload
      loadImagesFromDB();
    };
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

     // Clear all favorites
     const clearFavorites = async () => {
      await clearAllFavorites();  // Set all favorites to false in IndexedDB
      setFavorites([]);  // Clear favorites in the UI
    };
  
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
  
  const fetchCatData = async () => {
    try {
      for (let i = 0; i < 4; i++) {  // Fetch 4 cat facts and images at once
        const factResponse = await axios.get('https://catfact.ninja/fact');
        await fetchAndSaveImageAsBlob(factResponse.data.fact);  // Fetch image as blob and store
      }

      // Load cat images from IndexedDB after saving them
      loadImagesFromDB();
    } catch (error) {
      console.error('Error fetching cat data:', error);
    }
  };

    // Load all images from IndexedDB on page load
    const loadImagesFromDB = async () => {
      const allImages = await getAllFromIndexedDB();
      console.log("allImages", allImages);
      let catImages = allImages.map(img => ({
        ...img,
        imageUrl: URL.createObjectURL(img.imageBlob)  // Create a URL for the blob
      }));

      if (isInitialLoad) {
        catImages = shuffleArray(catImages);
        setIsInitialLoad(false); // Ensure shuffle happens only once
      }
        
      setCatData(catImages);
      setFavorites(catImages.filter(img => img.favorite));  // Filter only favorites
    };




    // Open modal with clicked image index
    const handleImageClick = (cat) => {
      setSelectedImage(cat.imageUrl);
      setSelectedImageId(cat.id);
      setIsModalOpen(true); // Open modal
    };

    // Close the modal
    const handleModalClose = () => {
      setIsModalOpen(false);
    };
  
    // Function to download the image
    const handleDownload = (imageUrl) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'cat_image.jpg'; // Filename for the download
      link.click();
    };

    // Report image (opens email client)
    const handleReportImage = () => {
      window.location.href = "mailto:complaints@cats.com?subject=I hate this cat because I'm a bad person;"
    };  

      // Handle next and previous arrow clicks
  const handleNextPage = () => {
    const maxPage = Math.floor(favorites.length / 5); // Maximum number of pages
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1); // Move to the next page
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1); // Move to the previous page
    }
  };

  const isFavorite = (imageId) => {
    return favorites.some(fav => fav.id === imageId);
  };

  const handleVideoEnd = () => {
    setIsVideoExiting(true); // Trigger the push-up animation

    // Remove the video overlay after the animation (1 second delay)
    setTimeout(() => {
      setIsVideoPlaying(false); // Hide video after animation completes
    }, 1000); // Match the CSS transition time
  };

   
  const handleAddToFavorites = async (imageId) => {
    const db = await dbPromise;
    const image = await db.get('favorites', imageId);
  
    if (image) {
      const newFavoriteStatus = !image.favorite; // Toggle favorite status
      image.favorite = newFavoriteStatus;
  
      // Update in IndexedDB
      await updateFavoriteInIndexedDB(imageId, newFavoriteStatus);
  
      // Regenerate blob URL for the updated image
      const newImageUrl = URL.createObjectURL(image.imageBlob);
  
      // Update catData to reflect the favorite status change
      setCatData((prevCatData) =>
        prevCatData.map((cat) =>
          cat.id === imageId ? { ...cat, favorite: newFavoriteStatus, imageUrl: newImageUrl } : cat
        )
      );
  
      // Update favorites state immediately
      if (newFavoriteStatus) {
        // Add to favorites and regenerate the image URL
        setFavorites((prevFavorites) => [...prevFavorites, { ...image, favorite: true, imageUrl: newImageUrl }]);
      } else {
        // Remove from favorites
        setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== imageId));
      }
      console.log("CLOSING MODAL");
      setIsModalOpen(false); 
    }
  };

  
  // On component mount, retrieve favorites from local storage or fetch new data
  useEffect(() => {
    loadImagesFromDB();  // Load images and favorites from IndexedDB
    fetchCatData(); 
  }, [page]);


     // Show loading state until we know if the user is authenticated or not
     if (loading) {
      return <div>Loading...</div>;
    }

  return (
   <div className="cat-app-container">

    
   {/* Video overlay that plays when the app loads */}
   {isVideoPlaying && (
           <div className={`video-overlay ${isVideoExiting ? 'video-exit' : ''}`}>
          <video
            className="intro-video"
            src="introvideo.mp4" // Make sure to provide the correct path to your video file
            autoPlay
            muted
            onEnded={handleVideoEnd} // Hide video when it finishes playing
          />
        </div>
      )}
      <div className='app-container'>
      {/* Title */}
      <h1 className="cat-app-title">Welcome to Cat App</h1>

      {/* Description */}
      <p className="cat-app-description">
        Browse our lovely selection of cat pictures and facts. Click on a picture to save, favorite, or report it!
      </p>

         {/* Favorites Bar */}
         <div className="favorites-container">
        <h3>Your Favorite Cats</h3>
        {favorites.length > 0 ? (
          <div className="favorites-carousel">
            {/* Left Arrow */}
            <button className="carousel-arrow left-arrow" onClick={handlePrevPage} disabled={currentPage === 0}>
              &lt;
            </button>

            {/* Thumbnails */}
            <div className="favorites-thumbnails">
              {favorites.slice(currentPage * 5, currentPage * 5 + 5).map((fav, index) => (
                
                <div key={index} className="favorite-thumbnail-container">
                {/* X button that appears on hover */}
                <button 
                  className="thumbnail-close" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the parent click from triggering
                    handleAddToFavorites(fav.id);
                  }}>
                  &times;
                </button>
                
                {/* Thumbnail Image */}
                <img
                  src={fav.imageUrl}
                  alt={`Favorite Cat ${index}`}
                  className="favorite-thumbnail"
                  onClick={() => handleImageClick(fav)}
                />
              </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button className="carousel-arrow right-arrow" onClick={handleNextPage} disabled={(currentPage + 1) * 5 >= favorites.length}>
              &gt;
            </button>
          </div>
        ) : (
          <p className="no-favorites">You have no favorite cats yet.</p>
        )}
      </div>

        {/* Clear Favorites Button */}
        <div className="cat-app-container">
        <p><button onClick={clearFavorites} className="clear-favorites-button">Clear Favorites</button>
        <button onClick={toggleUploadModal} className="upload-button"> Upload Cat Image
        </button>
        <button onClick={handleLogout} className="logout-button">Logout</button></p>
                
       
        </div>
     
      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="upload-modal-overlay">
          <div className="upload-modal-content">
            <button className="upload-modal-close" onClick={toggleUploadModal}>×</button>
            <div className="upload-modal-body">
              <h3>Upload Your Cat Picture and Fact</h3>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <input
                type="text"
                placeholder="Enter a cat fact"
                value={catFact}
                onChange={handleFactInput}
              />
              <button onClick={handleUpload} className="button-style">Upload</button>
            </div>
          </div>
        </div>
      )}
     

      {/* Grid of cat images and facts */}
      <div className="cat-grid">
        {catData.map((cat, index) => (
           <div 
           key={index} 
           className="cat-item"
           ref={catData.length === index + 1 ? lastCatElementRef : null} // Attach ref to the last item for lazy loading
           onClick={() => handleImageClick(cat)}> {/* Open modal on image click */}
            <div className="cat-item-inner">
              <div className="cat-front">
                <img 
                  src={cat.imageUrl} 
                  className="cat-image" 
                  loading="lazy" // Native lazy loading for images
                />
              </div>
              <div 
                  className="cat-back" 
                  style={{ backgroundImage: `url(${cat.imageUrl})` }}  /* Set the same image as background */
                >
                <p>{cat.fact}</p>
              </div>
            </div>
         </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedImage !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleModalClose}>×</button>
            <div className="modal-body">
              <img 
                src={selectedImage} 
                alt="Full-size cat" 
                className="modal-image" 
              />
              <div className="modal-actions">
                <p className="legend" color="black">This is the Full Sized Image</p>
                <br></br>
                <button onClick={() => handleDownload(selectedImage)} className="button-style">Download</button>
                <button onClick={() => handleAddToFavorites(selectedImageId)} className="button-style">  {isFavorite(selectedImageId) ? "Remove from Favorites" : 'Favorite'}</button>
                <button onClick={handleReportImage} className="button-style">Report</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading more indicator */}
      <div className="loading-indicator">Loading more...</div>
      </div>
    </div>
  );
};

export default CatInfo;
