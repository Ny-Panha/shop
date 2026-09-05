/**
 * Custom GLSL Shaders for ThreeUI 3D Components
 */

// 1. Liquid Metal Shader (Chrome Mercury fluid simulation with Fresnel specular reflection)
export const LiquidMetalShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uDistortion;

    // Simplex noise approximation
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Calculate fluid ripple displacement
      float noise = snoise(position * 1.5 + vec3(uTime * 0.4));
      vec3 newPosition = position + normal * (noise * uDistortion);
      
      vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uRoughness;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      vec3 normal = normalize(vNormal);

      // Fresnel reflection factor
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
      
      // Iridescent chromatic reflection
      vec3 chrome = mix(uColorA, uColorB, fresnel);
      
      // Specular shine
      vec3 lightDir = normalize(vec3(1.0, 2.0, 2.0));
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 32.0 / (uRoughness + 0.01));

      vec3 finalColor = chrome + vec3(spec * 0.85);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// 2. Semantic Bloom Particle Shader
export const ParticleBloomShader = {
  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    attribute float aScale;
    attribute vec3 aRandom;
    varying vec3 vColor;

    void main() {
      vec3 pos = position;
      
      // Gentle cosmic wave
      pos.x += sin(uTime * 0.5 + aRandom.x * 6.28) * 0.4;
      pos.y += cos(uTime * 0.4 + aRandom.y * 6.28) * 0.4;
      pos.z += sin(uTime * 0.6 + aRandom.z * 6.28) * 0.4;

      // Mouse repulsion / attraction field
      float dist = distance(pos.xy, uMouse * 8.0);
      if (dist < 4.0) {
        float force = (4.0 - dist) * 0.6;
        pos.xy += normalize(pos.xy - uMouse * 8.0) * force;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Distance attenuation - subtle small stardust particles
      gl_PointSize = aScale * (18.0 / -mvPosition.z);
      
      // Color interpolation based on position
      vColor = mix(vec3(0.0, 0.9, 0.6), vec3(0.2, 0.7, 1.0), sin(pos.x * 0.2 + uTime) * 0.5 + 0.5);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      // Soft radial circular particle
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      float alpha = smoothstep(0.5, 0.05, dist);
      // Subtle background opacity so text is 100% clean and readable
      gl_FragColor = vec4(vColor, alpha * 0.35);
    }
  `
};
