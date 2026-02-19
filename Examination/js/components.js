// Custom A-Frame Components for VR Villa

// Loading Screen Component
AFRAME.registerComponent("loading-screen", {
  init: function () {
    const sceneEl = this.el.sceneEl;

    sceneEl.addEventListener("loaded", () => {
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        loadingScreen.style.display = "none";
      }
    });
  },
});

// Rotating Ceiling Fan Component
AFRAME.registerComponent("rotating-fan", {
  schema: {
    speed: { type: "number", default: 50 },
  },

  tick: function (time, timeDelta) {
    const rotation = this.el.getAttribute("rotation");
    rotation.y += this.data.speed * (timeDelta / 1000);
    this.el.setAttribute("rotation", rotation);
  },
});

// Swaying Tree/Plant Component
AFRAME.registerComponent("swaying", {
  schema: {
    speed: { type: "number", default: 1.0 },
    intensity: { type: "number", default: 5 },
  },

  init: function () {
    this.originalRotation = this.el.getAttribute("rotation").z;
  },

  tick: function (time) {
    const rotation = this.el.getAttribute("rotation");
    rotation.z =
      this.originalRotation +
      Math.sin((time / 1000) * this.data.speed) * this.data.intensity;
    this.el.setAttribute("rotation", rotation);
  },
});

// Floating/Bobbing Animation Component
AFRAME.registerComponent("bobbing", {
  schema: {
    speed: { type: "number", default: 1.0 },
    height: { type: "number", default: 0.1 },
  },

  init: function () {
    this.originalPosition = this.el.getAttribute("position").y;
  },

  tick: function (time) {
    const position = this.el.getAttribute("position");
    position.y =
      this.originalPosition +
      Math.sin((time / 1000) * this.data.speed) * this.data.height;
    this.el.setAttribute("position", position);
  },
});

// Teleport Controls for VR Navigation
AFRAME.registerComponent("teleport-controls", {
  init: function () {
    const el = this.el;

    // Add click-to-teleport functionality
    el.addEventListener("click", (evt) => {
      const camera = document.querySelector("[camera]");
      if (camera && evt.detail.intersection) {
        const point = evt.detail.intersection.point;
        const cameraPos = camera.getAttribute("position");
        camera.setAttribute("position", {
          x: point.x,
          y: cameraPos.y, // Keep camera height
          z: point.z,
        });
      }
    });
  },
});

// Pulsing Light Component
AFRAME.registerComponent("pulsing-light", {
  schema: {
    minIntensity: { type: "number", default: 0.5 },
    maxIntensity: { type: "number", default: 1.0 },
    speed: { type: "number", default: 1.0 },
  },

  tick: function (time) {
    const light = this.el.getAttribute("light");
    if (light) {
      const intensity =
        this.data.minIntensity +
        ((Math.sin((time / 1000) * this.data.speed) + 1) / 2) *
          (this.data.maxIntensity - this.data.minIntensity);
      this.el.setAttribute("light", "intensity", intensity);
    }
  },
});
