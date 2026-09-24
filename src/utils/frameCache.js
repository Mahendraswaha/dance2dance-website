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

    // Only AFTER frame 1 is loaded (and LCP is satisfied), load the rest without blocking the main thread
    let currentIndex = 1;
    const batchSize = 10;

    const loadNextBatch = () => {
      const end = Math.min(currentIndex + batchSize, frameCount);
      for (let i = currentIndex; i < end; i++) {
        frameCache[i].src = currentFrame(i);
        frameCache[i].onload = () => {
          loadedCount++;
          callbacks.forEach(cb => cb(loadedCount / frameCount));
          
          if (loadedCount === frameCount) {
            isLoaded = true;
          }
        };
      }
      currentIndex = end;
      if (currentIndex < frameCount) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNextBatch);
        } else {
          setTimeout(loadNextBatch, 10);
        }
      }
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadNextBatch);
    } else {
      setTimeout(loadNextBatch, 10);
    }
  };

  return frameCache;
};

export const getFrames = () => frameCache;
