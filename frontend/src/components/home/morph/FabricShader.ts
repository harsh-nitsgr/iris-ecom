import * as THREE from 'three';

export const FabricShaderMaterial = {
  uniforms: {
    tDiffuse1: { value: null }, // Raw Fabric Texture
    tDiffuse2: { value: null }, // Finished Cloth Texture
    progress: { value: 0.0 },   // Morphing progress (0 to 1)
    foldAmount: { value: 0.0 }, // Intensity of the folds (0 to 1)
    time: { value: 0.0 },       // For subtle wave animations
    resolution: { value: new THREE.Vector2(1, 1) }
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float progress;
    uniform float foldAmount;
    uniform float time;

    // Simple noise function for fabric waves
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i); // Avoid truncation effects in permutation
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vUv = uv;
      
      // Base folding mechanism based on progress
      // At progress 0 (raw fabric) -> small subtle wave
      // At progress 0.5 (folding) -> intense wrinkling
      // At progress 1.0 (dress) -> flat or shaped
      
      float noiseVal = snoise(uv * 5.0 + time * 0.5);
      
      // Calculate depth offset
      float zOffset = 0.0;
      zOffset += noiseVal * 0.1 * (1.0 - progress); // Subtle raw fabric wave
      
      // Intense folding in the middle
      float foldPeak = smoothstep(0.0, 0.5, progress) * (1.0 - smoothstep(0.5, 1.0, progress));
      float deepFold = snoise(uv * 2.0 - time) * 0.5 * foldPeak;
      
      zOffset += deepFold * foldAmount;

      vec3 newPosition = position;
      newPosition.z += zOffset;

      // Add a slight perspective bend during fold
      float bend = sin(uv.x * 3.14159) * foldPeak * foldAmount * 0.4;
      newPosition.y -= bend;
      newPosition.x += bend * (uv.y - 0.5);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse1;
    uniform sampler2D tDiffuse2;
    uniform float progress;
    uniform float foldAmount;

    void main() {
      vec4 tex1 = texture2D(tDiffuse1, vUv);
      vec4 tex2 = texture2D(tDiffuse2, vUv);
      
      // Smoothly mix between the two textures based on progress
      // Add a slight darkened edge effect during folding
      float foldPeak = smoothstep(0.0, 0.5, progress) * (1.0 - smoothstep(0.5, 1.0, progress));
      vec4 mixedColor = mix(tex1, tex2, smoothstep(0.3, 0.7, progress));
      
      // Fake shadows based on folding
      float shadow = 1.0 - (foldPeak * 0.3 * foldAmount);
      
      gl_FragColor = vec4(mixedColor.rgb * shadow, mixedColor.a);
    }
  `
};
