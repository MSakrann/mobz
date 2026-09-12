import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

import type { WorkCard } from "@/data/work-projects";

export type MountHallOptions = {
  cards: WorkCard[];
  onNavigate: (href: string) => void;
  reducedMotion: boolean;
  section: HTMLElement;
  focusName: HTMLElement;
  focusNum: HTMLElement;
  focusTotal: HTMLElement;
  dots: HTMLElement[];
};

const P = {
  bgColor: "#000000",
  fogDensity: 0,
  skyTop: "#01002e",
  skyHorizon: "#000000",
  skyBottom: "#000000",
  skyGlow: 0,
  ringRadius: 8.5,
  cardW: 1.68,
  cardH: 2.74,
  cardCurve: 1,
  cardGap: 0.36,
  cardLift: 0.05,
  cornerRadius: 0.035,
  borderWidth: 0,
  borderColor: "#050505",
  borderOpacity: 1,
  hoverScale: 1.035,
  labelSize: 15,
  labelColor: "#d6d6d6",
  labelWeight: 500,
  labelTracking: 1,
  labelOffset: 0.2,
  labelOpacity: 0.68,
  fov: 67,
  camHeight: 2.02,
  autoSpin: 0.04,
  dragSpeed: 0.0085,
  inertiaDamp: 0.89,
  waterDeep: "#000000",
  waterTint: "#000000",
  reflBright: 0.25,
  rippleScale: 0.68,
  rippleDistort: 0.1,
  waterGlint: 0.04,
  fresnelPow: 2.1,
  reflScale: 1,
};

const TRAIL_N = 14;
const LABEL_SCALE = 0.008;
const FLY_MS = 1200;
const DRAG_PX = 12;

const hexToVec3 = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  );
};

function curvedCardGeo(w: number, h: number, R: number, curve: number) {
  const g = new THREE.PlaneGeometry(w, h, 28, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const d = x / R;
    const cx = R * Math.sin(d);
    const cz = R * (1 - Math.cos(d));
    pos.setX(i, x + (cx - x) * curve);
    pos.setZ(i, cz * curve);
  }
  pos.needsUpdate = true;
  return g;
}

function makeCardMaterial(map: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map },
      uAspect: { value: P.cardW / P.cardH },
      uImgAspect: { value: 4 / 3 },
      uRadius: { value: P.cornerRadius },
      uBorderW: { value: P.borderWidth },
      uBorderCol: { value: hexToVec3(P.borderColor) },
      uBorderOp: { value: P.borderOpacity },
    },
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `
      precision highp float;
      uniform sampler2D map; uniform float uAspect, uImgAspect, uRadius, uBorderW, uBorderOp; uniform vec3 uBorderCol; varying vec2 vUv;
      float sdRR(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r; }
      void main(){
        vec2 p = (vUv - 0.5); p.x *= uAspect;
        float d = sdRR(p, vec2(0.5 * uAspect, 0.5), uRadius);
        float aa = max(fwidth(d), 1e-4);
        float inside = 1.0 - smoothstep(0.0, aa, d);
        if(inside < 0.003) discard;
        vec2 s = uAspect > uImgAspect ? vec2(1.0, uImgAspect / uAspect) : vec2(uAspect / uImgAspect, 1.0);
        vec2 iuv = (vUv - 0.5) * s + 0.5;
        vec3 tex = texture2D(map, iuv).rgb;
        float border = smoothstep(-uBorderW - aa, -uBorderW + aa, d) * inside;
        vec3 col = mix(tex, uBorderCol, clamp(border, 0.0, 1.0) * uBorderOp);
        gl_FragColor = vec4(col, inside);
      }`,
  });
}

export function mountMirrorHall(
  host: HTMLElement,
  opts: MountHallOptions,
): () => void {
  const { cards, onNavigate, reducedMotion, section } = opts;
  const mobile = window.matchMedia("(pointer: coarse)").matches;
  const canvas = document.createElement("canvas");
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: false,
    powerPreference: mobile ? "low-power" : "high-performance",
    failIfMajorPerformanceCaveat: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const DPR = renderer.getPixelRatio();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(P.bgColor);
  scene.fog = new THREE.FogExp2(P.bgColor, P.fogDensity);

  const skyUniforms = {
    uTop: { value: hexToVec3(P.skyTop) },
    uHorizon: { value: hexToVec3(P.skyHorizon) },
    uBottom: { value: hexToVec3(P.skyBottom) },
    uGlow: { value: P.skyGlow },
  };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(180, 32, 24),
    new THREE.ShaderMaterial({
      uniforms: skyUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
      fragmentShader: `precision highp float; uniform vec3 uTop, uHorizon, uBottom; uniform float uGlow; varying vec3 vP;
        void main(){
          float h = normalize(vP).y;
          vec3 col = mix(uBottom, uHorizon, smoothstep(-0.25, 0.02, h));
          col = mix(col, uTop, smoothstep(0.02, 0.72, h));
          col += uHorizon * exp(-pow(h * 7.0, 2.0)) * uGlow;
          gl_FragColor = vec4(max(col, 0.0), 1.0);
        }`,
    }),
  );
  sky.renderOrder = -1;
  scene.add(sky);

  const camera = new THREE.PerspectiveCamera(P.fov, 1, 0.1, 220);
  camera.position.set(0, P.camHeight, 0.001);
  const lookTarget = new THREE.Vector3(0, 1.15, -P.ringRadius);
  camera.lookAt(lookTarget);

  {
    const N = mobile ? 180 : 700;
    const pos = new Float32Array(N * 3);
    let seed = 1234.5;
    const rnd = () => {
      seed = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return seed - Math.floor(seed);
    };
    for (let i = 0; i < N; i++) {
      const r = 70 + rnd() * 80;
      const th = rnd() * Math.PI * 2;
      const ph = (rnd() * 0.6 + 0.2) * Math.PI;
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          color: 0x8899bb,
          size: 0.35,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
        }),
      ),
    );
  }

  const carousel = new THREE.Group();
  scene.add(carousel);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const loader = new THREE.TextureLoader();
  const texCache: Record<string, THREE.Texture> = {};
  const cardMeshes: THREE.Mesh[] = [];
  const cardMats: THREE.ShaderMaterial[] = [];
  const cardLabels: { el: HTMLDivElement; obj: CSS3DObject }[] = [];
  let RING_N = 0;

  const css3d = new CSS3DRenderer();
  css3d.domElement.className = "css3d";
  css3d.domElement.style.pointerEvents = "none";
  section.appendChild(css3d.domElement);

  function getTex(src: string) {
    if (texCache[src]) return texCache[src];
    const t = loader.load(src, (tt) => {
      const asp = tt.image.width / tt.image.height;
      for (const m of cardMats) {
        if (m.uniforms.map.value === tt) m.uniforms.uImgAspect.value = asp;
      }
    });
    t.anisotropy = maxAniso;
    t.colorSpace = THREE.NoColorSpace;
    texCache[src] = t;
    return t;
  }

  const circ = 2 * Math.PI * P.ringRadius;
  const N = Math.max(cards.length, Math.floor(circ / (P.cardW + P.cardGap)));
  RING_N = N;
  const cardY = P.cardLift + P.cardH / 2;
  for (let i = 0; i < N; i++) {
    const cd = cards[i % cards.length];
    const a = (i / N) * Math.PI * 2;
    const g = new THREE.Group();
    g.position.set(Math.sin(a) * P.ringRadius, cardY, Math.cos(a) * P.ringRadius);
    g.rotation.y = a + Math.PI;
    g.userData = { scale: 1, card: cd };

    const realMat = makeCardMaterial(getTex(cd.img));
    cardMats.push(realMat);
    const img = new THREE.Mesh(
      curvedCardGeo(P.cardW, P.cardH, P.ringRadius, P.cardCurve),
      realMat,
    );
    img.userData.card = g;
    g.add(img);
    cardMeshes.push(img);

    if (cd.href && !cd.comingSoon) {
      const hit = document.createElement("a");
      hit.className = "card-hit";
      hit.href = cd.href;
      hit.setAttribute("aria-label", cd.title);
      hit.style.width = `${P.cardW * 100}px`;
      hit.style.height = `${P.cardH * 100}px`;
      hit.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (dragging || flying) return;
        if (reducedMotion) {
          onNavigate(cd.href!);
          return;
        }
        flyThrough(img, cd.href!);
      });
      const hitObj = new CSS3DObject(hit);
      hitObj.scale.setScalar(0.01);
      hitObj.position.set(0, 0, 0.04);
      g.add(hitObj);
    }

    const el = document.createElement("div");
    el.className = "card-label";
    el.textContent = cd.title;
    const lobj = new CSS3DObject(el);
    lobj.scale.setScalar(LABEL_SCALE);
    lobj.position.set(0, P.cardH / 2 + P.labelOffset, 0.02);
    g.add(lobj);
    cardLabels.push({ el, obj: lobj });
    carousel.add(g);
  }

  const trail = Array.from(
    { length: TRAIL_N },
    () => new THREE.Vector3(0, 0, -1000),
  );
  const reflectRT = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });
  const reflectCam = new THREE.PerspectiveCamera();
  const textureMatrix = new THREE.Matrix4();
  const wu = {
    tReflect: { value: reflectRT.texture },
    uTexMatrix: { value: textureMatrix },
    uTime: { value: 0 },
    uCamPos: { value: new THREE.Vector3() },
    uDeep: { value: hexToVec3(P.waterDeep) },
    uTint: { value: hexToVec3(P.waterTint) },
    uReflBright: { value: P.reflBright },
    uRipScale: { value: P.rippleScale },
    uRipDistort: { value: P.rippleDistort },
    uGlint: { value: P.waterGlint },
    uFresnel: { value: P.fresnelPow },
    uTrail: { value: trail },
  };
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 240),
    new THREE.ShaderMaterial({
      uniforms: wu,
      vertexShader: `precision highp float; uniform mat4 uTexMatrix; varying vec4 vRefl; varying vec3 vWpos;
        void main(){ vec4 wp = modelMatrix * vec4(position,1.); vWpos = wp.xyz; vRefl = uTexMatrix * vec4(position,1.);
          gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `
        precision highp float;
        #define TRAIL_N ${TRAIL_N}
        uniform sampler2D tReflect; uniform float uTime, uReflBright, uRipScale, uRipDistort, uGlint, uFresnel;
        uniform vec3 uCamPos, uDeep, uTint; uniform vec3 uTrail[TRAIL_N];
        varying vec4 vRefl; varying vec3 vWpos;
        void wave(vec2 p, vec2 d, float k, float w, float a, inout vec2 grad){ grad += a * k * cos(dot(d,p)*k + uTime*w) * d; }
        void main(){
          vec2 p = vWpos.xz; vec2 grad = vec2(0.0); float A = uRipScale;
          wave(p, normalize(vec2( 1.0, 0.35)), 1.7, 1.30, 0.045*A, grad);
          wave(p, normalize(vec2(-0.6, 1.0 )), 2.4, 1.05, 0.034*A, grad);
          wave(p, normalize(vec2( 0.4,-1.0 )), 3.6, 1.70, 0.022*A, grad);
          wave(p, normalize(vec2(-1.0,-0.2 )), 5.1, 2.20, 0.013*A, grad);
          float crest = 0.0;
          for(int i=0;i<TRAIL_N;i++){
            vec3 e = uTrail[i]; float age = uTime - e.z;
            if(age > 0.0 && age < 2.4){
              float d = distance(p, e.xy); float rad = age * 2.1;
              float band = exp(-pow((d - rad) * 3.2, 2.0)); float decay = (1.0 - age / 2.4);
              vec2 dir = d > 1e-4 ? (p - e.xy) / d : vec2(0.0);
              grad += dir * (-sin((d - rad) * 9.0) * 9.0 * band * decay * 0.010 * A);
              crest += cos((d - rad) * 9.0) * band * decay;
            }
          }
          vec3 N = normalize(vec3(-grad.x, 1.0, -grad.y));
          vec3 V = normalize(uCamPos - vWpos);
          vec2 ruv = vRefl.xy / vRefl.w; ruv += N.xz * uRipDistort;
          vec3 refl = texture2D(tReflect, clamp(ruv, 0.001, 0.999)).rgb * uReflBright;
          float fres = 0.02 + 0.95 * pow(1.0 - clamp(dot(V, N), 0.0, 1.0), uFresnel);
          vec3 deep = mix(uDeep, uTint, 0.25 + 0.25 * N.y);
          vec3 col = mix(deep, refl, fres);
          vec3 gdir = normalize(vec3(0.2, 1.0, -0.3)); vec3 H = normalize(gdir + V);
          float spec = pow(clamp(dot(N, H), 0.0, 1.0), 200.0);
          col += vec3(0.36, 0.5, 0.7) * spec * uGlint;
          col += refl * max(crest, 0.0) * 0.09;
          float dist = length(vWpos.xz - uCamPos.xz);
          col = mix(col, uDeep, smoothstep(14.0, 50.0, dist));
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  const _rN = new THREE.Vector3();
  const _rW = new THREE.Vector3();
  const _cW = new THREE.Vector3();
  const _rot = new THREE.Matrix4();
  const _la = new THREE.Vector3();
  const _vw = new THREE.Vector3();
  const _tg = new THREE.Vector3();
  const _q = new THREE.Vector4();
  const _cl = new THREE.Vector4();
  const _pl = new THREE.Plane();

  function updateReflection() {
    _rW.setFromMatrixPosition(water.matrixWorld);
    _cW.setFromMatrixPosition(camera.matrixWorld);
    _rot.extractRotation(water.matrixWorld);
    _rN.set(0, 0, 1).applyMatrix4(_rot);
    _vw.subVectors(_rW, _cW);
    if (_vw.dot(_rN) > 0) return;
    _vw.reflect(_rN).negate().add(_rW);
    _rot.extractRotation(camera.matrixWorld);
    _la.set(0, 0, -1).applyMatrix4(_rot).add(_cW);
    _tg.subVectors(_rW, _la).reflect(_rN).negate().add(_rW);
    reflectCam.position.copy(_vw);
    reflectCam.up.set(0, 1, 0).applyMatrix4(_rot).reflect(_rN);
    reflectCam.lookAt(_tg);
    reflectCam.far = camera.far;
    reflectCam.updateMatrixWorld();
    reflectCam.projectionMatrix.copy(camera.projectionMatrix);
    textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    textureMatrix.multiply(reflectCam.projectionMatrix);
    textureMatrix.multiply(reflectCam.matrixWorldInverse);
    textureMatrix.multiply(water.matrixWorld);
    _pl.setFromNormalAndCoplanarPoint(_rN, _rW).applyMatrix4(reflectCam.matrixWorldInverse);
    _cl.set(_pl.normal.x, _pl.normal.y, _pl.normal.z, _pl.constant);
    const p = reflectCam.projectionMatrix;
    _q.x = (Math.sign(_cl.x) + p.elements[8]) / p.elements[0];
    _q.y = (Math.sign(_cl.y) + p.elements[9]) / p.elements[5];
    _q.z = -1;
    _q.w = (1 + p.elements[10]) / p.elements[14];
    _cl.multiplyScalar(2.0 / _cl.dot(_q));
    p.elements[2] = _cl.x;
    p.elements[6] = _cl.y;
    p.elements[10] = _cl.z + 1.0;
    p.elements[14] = _cl.w;
    water.visible = false;
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(reflectRT);
    renderer.clear();
    renderer.render(scene, reflectCam);
    renderer.setRenderTarget(prev);
    water.visible = true;
  }

  let dragging = false;
  let lastX = 0;
  let spinVel = 0;
  let downX = 0;
  let downY = 0;
  let flying = false;
  let disposed = false;
  let running = true;
  const mouseTarget = new THREE.Vector2();
  const mouse = new THREE.Vector2();
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let hovered: THREE.Object3D | null = null;
  const _ro = new THREE.Vector3();
  const _rd = new THREE.Vector3();

  function size() {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    css3d.setSize(w, h);
    reflectRT.setSize(
      Math.floor(w * DPR * P.reflScale),
      Math.floor(h * DPR * P.reflScale),
    );
  }

  function pointerToWater(cx: number, cy: number) {
    const rect = host.getBoundingClientRect();
    ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 - 1);
    raycaster.setFromCamera(ndc, camera);
    _ro.copy(raycaster.ray.origin);
    _rd.copy(raycaster.ray.direction);
    if (_rd.y > -1e-4) return null;
    const t = (0 - _ro.y) / _rd.y;
    if (t <= 0 || t > 80) return null;
    return { x: _ro.x + _rd.x * t, z: _ro.z + _rd.z * t };
  }

  let trailHead = 0;
  let lastRx = 1e9;
  let lastRz = 1e9;
  function dropRipple(cx: number, cy: number) {
    const p = pointerToWater(cx, cy);
    if (!p) return;
    if (Math.hypot(p.x - lastRx, p.z - lastRz) < 0.14) return;
    trail[trailHead].set(p.x, p.z, wu.uTime.value);
    trailHead = (trailHead + 1) % TRAIL_N;
    lastRx = p.x;
    lastRz = p.z;
  }

  function localNdc(e: PointerEvent) {
    const rect = section.getBoundingClientRect();
    mouseTarget.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 - 1,
    );
  }

  function liveHrefFromGroup(group: THREE.Object3D | null) {
    const card = group?.userData.card as WorkCard | undefined;
    if (!card?.href || card.comingSoon) return null;
    return card.href;
  }

  function updateHover() {
    if (dragging || flying) {
      hovered = null;
      canvas.classList.remove("-over-live");
      host.classList.remove("-over-live");
      return;
    }
    raycaster.setFromCamera(mouseTarget, camera);
    const hit = raycaster.intersectObjects(cardMeshes, false)[0];
    hovered = hit ? (hit.object.userData.card as THREE.Object3D) : null;
    const overLive = Boolean(liveHrefFromGroup(hovered));
    canvas.classList.toggle("-over-live", overLive);
    host.classList.toggle("-over-live", overLive);
  }

  opts.focusTotal.textContent = String(cards.length).padStart(2, "0");
  let focusIdx = -1;
  function syncFocus() {
    if (!RING_N) return;
    let slot = Math.round(((Math.PI - carousel.rotation.y) / (2 * Math.PI)) * RING_N);
    slot = ((slot % RING_N) + RING_N) % RING_N;
    const idx = slot % cards.length;
    if (idx === focusIdx) return;
    focusIdx = idx;
    opts.focusName.textContent = cards[idx].title;
    opts.focusNum.textContent = String(idx + 1).padStart(2, "0");
    opts.dots.forEach((d, i) => d.classList.toggle("-on", i === idx));
    opts.focusName.classList.remove("-swap");
    void opts.focusName.offsetWidth;
    opts.focusName.classList.add("-swap");
  }

  function syncLabels() {
    const y = P.cardH / 2 + P.labelOffset;
    for (const L of cardLabels) {
      L.obj.position.y = y;
      const s = L.el.style;
      s.fontSize = `${P.labelSize}px`;
      s.color = P.labelColor;
      s.fontWeight = String(P.labelWeight);
      s.letterSpacing = `${P.labelTracking}px`;
      s.opacity = String(P.labelOpacity);
    }
  }

  function hitCard(e: PointerEvent) {
    localNdc(e);
    raycaster.setFromCamera(mouseTarget, camera);
    return raycaster.intersectObjects(cardMeshes, false)[0];
  }

  function flyThrough(mesh: THREE.Mesh, href: string) {
    if (flying) return;
    flying = true;
    spinVel = 0;
    hovered = null;

    mesh.updateWorldMatrix(true, false);
    const start = camera.position.clone();
    const cardPos = new THREE.Vector3();
    mesh.getWorldPosition(cardPos);

    // Card +Z faces the ring center (the camera). Fly the opposite way: into the face.
    const into = new THREE.Vector3();
    mesh.getWorldDirection(into);
    into.negate();
    const toCard = cardPos.clone().sub(start);
    if (into.dot(toCard) < 0) into.negate();
    into.normalize();

    // Stop just beyond the surface so we never turn around inside the ring.
    const end = cardPos.clone().add(into.clone().multiplyScalar(0.28));
    const aim = cardPos.clone().add(into.clone().multiplyScalar(40));
    const look0 = lookTarget.clone();
    const t0 = performance.now();

    const step = () => {
      if (disposed) return;
      const u = Math.min(1, (performance.now() - t0) / FLY_MS);
      const ease = u * u * (3 - 2 * u);
      camera.position.lerpVectors(start, end, ease);
      lookTarget.lerpVectors(look0, aim, Math.min(1, ease * 1.6));
      camera.lookAt(lookTarget);
      const fade = String(1 - u * u);
      renderer.domElement.style.opacity = fade;
      css3d.domElement.style.opacity = fade;
      if (u < 1) requestAnimationFrame(step);
      else onNavigate(href);
    };
    step();
  }

  function tryOpen(e: PointerEvent) {
    const hit = hitCard(e);
    if (!hit) return;
    const group = hit.object.userData.card as THREE.Group;
    const href = liveHrefFromGroup(group);
    if (!href) return;
    if (reducedMotion) {
      onNavigate(href);
      return;
    }
    flyThrough(hit.object as THREE.Mesh, href);
  }

  let pressed = false;
  let pointerId: number | null = null;

  const onDown = (e: PointerEvent) => {
    if (flying || e.button !== 0) return;
    pressed = true;
    dragging = false;
    pointerId = e.pointerId;
    lastX = e.clientX;
    downX = e.clientX;
    downY = e.clientY;
    localNdc(e);
    dropRipple(e.clientX, e.clientY);
  };

  const onMove = (e: PointerEvent) => {
    localNdc(e);
    dropRipple(e.clientX, e.clientY);
    if (!pressed || flying || e.pointerId !== pointerId) return;

    const absX = Math.abs(e.clientX - downX);
    const absY = Math.abs(e.clientY - downY);

    if (!dragging) {
      if (absX < DRAG_PX && absY < DRAG_PX) return;
      // Vertical motion is page scroll — don't steal the gesture.
      if (absY >= absX) {
        pressed = false;
        pointerId = null;
        return;
      }
      dragging = true;
      spinVel = 0;
      canvas.classList.add("-dragging");
      canvas.setPointerCapture(e.pointerId);
      section.classList.add("-nudged");
    }

    const dx = e.clientX - lastX;
    lastX = e.clientX;
    const d = -dx * P.dragSpeed;
    carousel.rotation.y += d;
    spinVel = d;
  };

  const onUp = (e: PointerEvent) => {
    if (!pressed || e.pointerId !== pointerId) return;
    const wasDragging = dragging;
    pressed = false;
    dragging = false;
    pointerId = null;
    canvas.classList.remove("-dragging");
    if (canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    if (!wasDragging && !flying) tryOpen(e);
  };

  section.addEventListener("pointerdown", onDown);
  section.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  const ro = new ResizeObserver(size);
  ro.observe(host);
  size();

  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !disposed && running && raf === 0) frame();
  });
  io.observe(section);

  requestAnimationFrame(() => section.classList.add("-ready"));

  let prevT = performance.now();
  let raf = 0;
  function frame() {
    if (disposed || !running || !visible) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const dt = Math.min((now - prevT) / 1000, 0.05);
    prevT = now;
    const t = now / 1000;
    if (!dragging && !flying) {
      carousel.rotation.y += spinVel + P.autoSpin * dt;
      spinVel *= P.inertiaDamp;
    }
    if (!flying) updateHover();
    syncFocus();
    for (const g of carousel.children) {
      const tgt = g === hovered ? P.hoverScale : 1;
      g.userData.scale += (tgt - g.userData.scale) * Math.min(1, dt * 12);
      g.scale.setScalar(g.userData.scale);
    }
    if (!flying) {
      mouse.lerp(mouseTarget, 0.06);
      camera.position.x = mouse.x * 0.35;
      camera.position.y = P.camHeight + mouse.y * 0.18;
      camera.lookAt(lookTarget);
    }
    wu.uTime.value = t;
    wu.uCamPos.value.copy(camera.position);
    if (!mobile) updateReflection();
    renderer.render(scene, camera);
    syncLabels();
    css3d.render(scene, camera);
  }
  frame();

  return () => {
    disposed = true;
    running = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    section.removeEventListener("pointerdown", onDown);
    section.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    renderer.dispose();
    reflectRT.dispose();
    css3d.domElement.remove();
    canvas.remove();
  };
}
