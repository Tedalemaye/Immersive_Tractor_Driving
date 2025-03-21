console.log("Script.js loaded!");

// Create tractor video
const video = document.createElement("video");
video.src = "tractor2.mp4"; // Ensure this file exists
video.loop = true;
video.autoplay = true;
video.muted = true;
video.style.position = "absolute";
video.style.top = "0";
video.style.left = "0";
document.body.appendChild(video);

// Create a canvas to overlay user video
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
document.body.appendChild(canvas);

// Start webcam
const userVideo = document.createElement("video");
userVideo.setAttribute("playsinline", true); // Fix for mobile browsers
userVideo.style.position = "absolute";
userVideo.style.top = "0";
userVideo.style.left = "0";
console.log("Requesting webcam access...");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log("Webcam access granted!");
    userVideo.srcObject = stream;
    userVideo.play().then(() => {
      console.log("Webcam is playing...");
    }).catch(err => console.error("Error playing webcam:", err));
  })
  .catch(err => console.error("Webcam access error:", err));

// Ensure canvas matches video size
video.onloadeddata = () => {
  console.log("Tractor video loaded!");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  drawFrame();
};

// Variables to control zoom effect
let zoomScale = 1;  // Initial zoom scale
const zoomSpeed = 1; // Adjust speed of zooming (try smaller values)
const maxZoomScale = 2; // Maximum zoom scale (limit zoom)

function drawFrame() {
  if (userVideo.readyState >= 2) {  // Ensure video is loaded before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw tractor video in the background
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply the zoom effect by scaling the webcam video
    ctx.save();  // Save the current context state
    ctx.scale(zoomScale, zoomScale);  // Apply the scaling factor

    // Draw the user video on top (adjust position for the "driver seat")
    ctx.drawImage(userVideo, (canvas.width / 2 - 50) / zoomScale, (canvas.height - 800) / zoomScale, 160 / zoomScale, 200 / zoomScale);

    ctx.restore(); // Restore the context to its original state
  } else {
    console.warn("Waiting for webcam video to load...");
  }

  // Gradually increase the zoom scale for the zoom-in effect
  if (zoomScale < maxZoomScale) {
    zoomScale += zoomSpeed;  // Gradually zoom in
  }

  requestAnimationFrame(drawFrame);
}
