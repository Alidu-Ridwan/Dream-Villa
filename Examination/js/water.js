AFRAME.registerComponent('water-wobble', {
    schema: {
        color: { type: 'color', default: '#00BFFF' },
        speed: { type: 'number', default: 1.0 },
        opacity: { type: 'number', default: 0.8 }
    },

    init: function () {
        const data = this.data;
        const el = this.el;

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                color: { value: new THREE.Color(data.color) },
                opacity: { value: data.opacity }
            },
            vertexShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
          vUv = uv;
          vec3 pos = position;
          // Simple wave effect: distort Z based on X and Y and time
          float wave = sin(pos.x * 2.0 + time) * 0.1 + cos(pos.y * 1.5 + time) * 0.1;
          pos.z += wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        uniform float time;
        varying vec2 vUv;
        void main() {
          // Add some simple highlights based on UVs mimicking reflection/caustics
          float strength = 0.5 + 0.5 * sin(vUv.x * 20.0 + vUv.y * 20.0 + time * 3.0);
          vec3 finalColor = color + vec3(strength * 0.1);
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
            transparent: true,
            side: THREE.DoubleSide
        });

        // Apply the material to the mesh
        const mesh = el.getObject3D('mesh');
        if (mesh) {
            mesh.material = this.material;
        } else {
            el.addEventListener('model-loaded', () => {
                el.getObject3D('mesh').material = this.material;
            });
        }
    },

    tick: function (time, timeDelta) {
        if (this.material) {
            this.material.uniforms.time.value = time / 1000 * this.data.speed;
        }
    }
});
