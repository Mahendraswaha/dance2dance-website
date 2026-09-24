// src/utils/frameCache.js

const frameCache = [];
const frameCount = 240;
let isPreloading = false;
let isLoaded = false;
const callbacks = [];

const currentFrame = (index) => (
  `/gallery/sequence/frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

export const preloadFrames = (onProgress) => {
  if (isLoaded) {
    if (onProgress) onProgress(1);
    return frameCache;
  }

  if (onProgress) callbacks.push(onProgress);

  if (isPreloading) return frameCache;
  isPreloading = true;

  let loadedCount = 0;
  
  // Create the array to hold all images in the correct order
  for (let i = 0; i < frameCount; i++) {
    frameCache.push(new Image());
  }

  // Load the FIRST frame immediately (Critical for LCP)
  frameCache[0].src = currentFrame(0);
  frameCache[0].onload = () => {
    loadedCount++;
    callbacks.forEach(cb => cb(loadedCount / frameCount));

    // Only AFTER frame 1 is loaded (and LCP is satisfied), load the rest
    for (let i = 1; i < frameCount; i++) {
      frameCache[i].src = currentFrame(i);
      frameCache[i].onload = () => {
        loadedCount++;
        callbacks.forEach(cb => cb(loadedCount / frameCount));
        
        if (loadedCount === frameCount) {
          isLoaded = true;
        }
      };
    }
  };

  return frameCache;
};

export const getFrames = () => frameCache;
