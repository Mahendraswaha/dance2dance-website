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
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
      loadedCount++;
      const progress = loadedCount / frameCount;
      callbacks.forEach(cb => cb(progress));
      
      if (loadedCount === frameCount) {
        isLoaded = true;
      }
    };
    frameCache.push(img);
  }

  return frameCache;
};

export const getFrames = () => frameCache;
