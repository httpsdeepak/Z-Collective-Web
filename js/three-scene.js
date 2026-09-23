/**
 * Deepak Kumar Yadav Portfolio - 3D WebGL Background Scene
 * Built with Three.js
 */

// Global 3D Manager Namespace
const Portfolio3D = {
    // Three.js Core objects
    scene: null,
    camera: null,
    renderer: null,
    
    // Elements
    particles: null,
    floatingObjects: [],
    
    // State
    particleCount: 1500,
    targetMode: 'idle', // 'idle', 'programming', 'audio', 'modeling', 'security', 'music', 'gaming'
    currentColor: new THREE.Color('#00f2fe'),
    targetColor: new THREE.Color('#00f2fe'),
    
    // Interactions
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    scrollY: 0,
    targetScrollY: 0,
    
    // Init
    init() {
        const canvas = document.querySelector('#webgl');
        if (!canvas) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 12;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Add Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        this.scene.add(ambientLight);
        
        const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.5);
        dirLight1.position.set(5, 5, 5);
        this.scene.add(dirLight1);
        
        const dirLight2 = new THREE.DirectionalLight(0xff007f, 1.2);
        dirLight2.position.set(-5, -5, 5);
        this.scene.add(dirLight2);
        
        // Create 3D Assets
        this.createParticles();
        this.createFloatingMeshes();
        
        // Events
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('scroll', () => this.onScroll());
        
        // Start animation loop
        this.animate();
    },
    
    // Custom gradient circle particle texture
    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    },
    
    // Setup interactive background particles
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const originalPositions = new Float32Array(this.particleCount * 3);
        
        // Distribute points in a spherical shell
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            // Sphere placement coordinates
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            
            const r = 4.0 + Math.random() * 0.8; // Radius
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            positions[index] = x;
            positions[index + 1] = y;
            positions[index + 2] = z;
            
            originalPositions[index] = x;
            originalPositions[index + 1] = y;
            originalPositions[index + 2] = z;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
        
        // Glow Material
        const material = new THREE.PointsMaterial({
            size: 0.16,
            map: this.createParticleTexture(),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: this.currentColor
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    },
    
    // Create modern floating wireframe shapes
    createFloatingMeshes() {
        // Materials
        const createWireMaterial = (color) => {
            return new THREE.MeshPhysicalMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.35,
                roughness: 0.2,
                metalness: 0.8,
                emissive: color,
                emissiveIntensity: 0.4
            });
        };
        
        const blueMat = createWireMaterial(0x00f2fe);
        const pinkMat = createWireMaterial(0xff007f);
        
        // Icosahedron
        const icoGeom = new THREE.IcosahedronGeometry(1.5, 1);
        const icoMesh = new THREE.Mesh(icoGeom, blueMat);
        icoMesh.position.set(-6, -4, -2);
        this.scene.add(icoMesh);
        this.floatingObjects.push({ mesh: icoMesh, rx: 0.003, ry: 0.005, basePosition: new THREE.Vector3(-6, -4, -2) });
        
        // Torus Knot
        const torusGeom = new THREE.TorusKnotGeometry(1.0, 0.3, 64, 8);
        const torusMesh = new THREE.Mesh(torusGeom, pinkMat);
        torusMesh.position.set(6, -8, -3);
        this.scene.add(torusMesh);
        this.floatingObjects.push({ mesh: torusMesh, rx: 0.002, ry: 0.004, basePosition: new THREE.Vector3(6, -8, -3) });
        
        // Octahedron (Shield Center)
        const octGeom = new THREE.OctahedronGeometry(1.2, 0);
        const octMesh = new THREE.Mesh(octGeom, blueMat);
        octMesh.position.set(-4, -14, -1);
        this.scene.add(octMesh);
        this.floatingObjects.push({ mesh: octMesh, rx: 0.004, ry: 0.002, basePosition: new THREE.Vector3(-4, -14, -1) });
    },
    
    // Handle Window Resizing
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },
    
    // Capture mouse moves
    onMouseMove(e) {
        this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        this.targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    
    // Capture page scrolling
    onScroll() {
        // Map scroll height to coordinate change
        this.targetScrollY = window.scrollY;
    },
    
    // Set 3D visual mode based on interaction
    setMode(mode) {
        this.targetMode = mode;
        
        // Select custom target theme colors
        switch (mode) {
            case 'programming': // blue glow
                this.targetColor.set('#00f2fe');
                break;
            case 'audio': // purple glow
                this.targetColor.set('#9b51e0');
                break;
            case 'modeling': // cyan
                this.targetColor.set('#00ffd2');
                break;
            case 'security': // red
                this.targetColor.set('#ff3366');
                break;
            case 'music': // yellow
                this.targetColor.set('#ffcc00');
                break;
            case 'gaming': // green
                this.targetColor.set('#39ff14');
                break;
            case 'idle':
            default:
                this.targetColor.set('#00f2fe');
                break;
        }
    },
    
    // Main animation and rendering loop
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Easing interpolation for mouse movements
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;
        
        // Easing interpolation for scroll Parallax
        this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;
        
        // Camera parallax based on scroll & mouse moves
        this.camera.position.x = this.mouseX * 1.5;
        this.camera.position.y = -this.scrollY * 0.012 + (this.mouseY * 1.2);
        this.camera.lookAt(0, -this.scrollY * 0.012, -2);
        
        // Interpolate point cloud colors
        this.currentColor.lerp(this.targetColor, 0.05);
        this.particles.material.color = this.currentColor;
        
        // Animate particles based on current active state mode
        const posAttr = this.particles.geometry.attributes.position;
        const origAttr = this.particles.geometry.attributes.originalPosition;
        
        for (let i = 0; i < this.particleCount; i++) {
            const index = i * 3;
            
            const ox = origAttr.array[index];
            const oy = origAttr.array[index + 1];
            const oz = origAttr.array[index + 2];
            
            // Distance from center
            const r = Math.sqrt(ox*ox + oy*oy + oz*oz);
            
            // Target coordinates we will animate towards
            let tx = ox;
            let ty = oy;
            let tz = oz;
            
            switch (this.targetMode) {
                case 'programming':
                    // Grid shape morph
                    const gridIndexX = i % 40;
                    const gridIndexY = Math.floor(i / 40) % 40;
                    tx = (gridIndexX - 20) * 0.3;
                    ty = (gridIndexY - 20) * 0.3 - (this.scrollY * 0.01);
                    tz = Math.sin(time + gridIndexX * 0.2 + gridIndexY * 0.2) * 0.5 - 2;
                    break;
                    
                case 'audio':
                    // Sine-wave frequency shape
                    tx = ox * 1.5;
                    ty = Math.sin(ox * 1.5 + time * 6) * 1.5 - (this.scrollY * 0.01) + Math.cos(oz + time) * 0.3;
                    tz = oz * 0.8;
                    break;
                    
                case 'modeling':
                    // Highly structured concentrated grid
                    const factor = 1.0 + Math.sin(time * 2.5 + r) * 0.15;
                    tx = ox * 0.8 * factor;
                    ty = oy * 0.8 * factor;
                    tz = oz * 0.8 * factor;
                    break;
                    
                case 'security':
                    // Orbiting Shield Ring shape
                    const angle = (i / this.particleCount) * Math.PI * 2;
                    const ringRadius = 5.0 + Math.sin(time * 3 + angle * 5) * 0.25;
                    tx = Math.cos(angle * 3) * ringRadius;
                    ty = Math.sin(angle * 3) * ringRadius;
                    tz = (i % 10) * 0.1 - 0.5;
                    break;
                    
                case 'music':
                    // Acoustic vibrational pattern
                    const vib = Math.sin(time * 15 + ox * 3) * 0.18;
                    tx = ox + vib;
                    ty = oy + vib;
                    tz = oz + vib;
                    break;
                    
                case 'gaming':
                    // Spiral vortex particle acceleration
                    const helixAngle = (i * 0.02) + time * 3.5;
                    const hRadius = 1.5 + (i * 0.003);
                    tx = Math.cos(helixAngle) * hRadius;
                    ty = Math.sin(helixAngle) * hRadius;
                    tz = ((i - this.particleCount / 2) * 0.015);
                    break;
                    
                case 'idle':
                default:
                    // Soft organic breathing sphere
                    const pulse = Math.sin(time * 1.5 + r * 2.0) * 0.08;
                    tx = ox * (1 + pulse);
                    ty = oy * (1 + pulse);
                    tz = oz * (1 + pulse);
                    
                    // Add light rotation
                    const sinT = Math.sin(0.0005);
                    const cosT = Math.cos(0.0005);
                    origAttr.array[index] = ox * cosT - oz * sinT;
                    origAttr.array[index + 2] = ox * sinT + oz * cosT;
                    break;
            }
            
            // Linear interpolation to animate points smoothly
            posAttr.array[index] += (tx - posAttr.array[index]) * 0.06;
            posAttr.array[index + 1] += (ty - posAttr.array[index + 1]) * 0.06;
            posAttr.array[index + 2] += (tz - posAttr.array[index + 2]) * 0.06;
        }
        posAttr.needsUpdate = true;
        
        // Spin the global particle system slightly
        this.particles.rotation.y += 0.001;
        this.particles.rotation.x += 0.0005;
        
        // Rotate and float background objects
        this.floatingObjects.forEach((obj) => {
            obj.mesh.rotation.x += obj.rx;
            obj.mesh.rotation.y += obj.ry;
            
            // Floating micro-animation
            const floatOffset = Math.sin(time * 1.5 + obj.basePosition.x) * 0.35;
            obj.mesh.position.y = obj.basePosition.y + floatOffset;
            
            // Slight horizontal movement based on mouse
            obj.mesh.position.x = obj.basePosition.x + (this.mouseX * 0.5);
        });
        
        this.renderer.render(this.scene, this.camera);
    }
};

// 3D Object for Contact Divider: Cybersecurity Network & Dark Web Graph
const Contact3D = {
    scene: null,
    camera: null,
    renderer: null,
    group: null,
    nodes: [],
    nodeCount: 32,
    maxDistance: 1.3,
    
    // Geometry & meshes
    pointsGeometry: null,
    points: null,
    linesGeometry: null,
    lines: null,
    
    init() {
        const canvas = document.querySelector('#contact-3d-canvas');
        if (!canvas) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        this.camera.position.z = 4.4;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Group containing the network graph
        this.group = new THREE.Group();
        this.scene.add(this.group);
        
        // Initialize network nodes
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            const pos = new THREE.Vector3(
                (Math.random() - 0.5) * 2.8,
                (Math.random() - 0.5) * 2.0,
                (Math.random() - 0.5) * 2.0
            );
            
            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005
            );
            
            // Matches website theme: 35% nodes are dark web threats (neon pink), 65% are secure nodes (neon cyan)
            const isThreat = Math.random() < 0.35;
            const color = isThreat ? new THREE.Color('#ff007f') : new THREE.Color('#00f2fe');
            
            this.nodes.push({
                pos,
                vel,
                isThreat,
                color
            });
        }
        
        // Create points buffer
        this.pointsGeometry = new THREE.BufferGeometry();
        this.updatePointsGeometry();
        
        const pTexture = Portfolio3D.createParticleTexture();
        const pointsMaterial = new THREE.PointsMaterial({
            size: 0.18,
            vertexColors: true,
            transparent: true,
            map: pTexture,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.points = new THREE.Points(this.pointsGeometry, pointsMaterial);
        this.group.add(this.points);
        
        // Create lines buffer
        this.linesGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        
        this.lines = new THREE.LineSegments(this.linesGeometry, lineMaterial);
        this.group.add(this.lines);
        
        // Add double glowing light sources matching theme colors
        const cyanLight = new THREE.PointLight(0x00f2fe, 1.5, 6);
        cyanLight.position.set(-2, 2, 2);
        this.scene.add(cyanLight);
        
        const pinkLight = new THREE.PointLight(0xff007f, 1.5, 6);
        pinkLight.position.set(2, -2, 2);
        this.scene.add(pinkLight);
        
        window.addEventListener('resize', () => this.onResize());
        
        // Animate loop
        this.animate();
    },
    
    // Updates node positions in buffer
    updatePointsGeometry() {
        const positions = new Float32Array(this.nodeCount * 3);
        const colors = new Float32Array(this.nodeCount * 3);
        
        for (let i = 0; i < this.nodeCount; i++) {
            const node = this.nodes[i];
            positions[i * 3] = node.pos.x;
            positions[i * 3 + 1] = node.pos.y;
            positions[i * 3 + 2] = node.pos.z;
            
            colors[i * 3] = node.color.r;
            colors[i * 3 + 1] = node.color.g;
            colors[i * 3 + 2] = node.color.b;
        }
        
        this.pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.pointsGeometry.attributes.position.needsUpdate = true;
        this.pointsGeometry.attributes.color.needsUpdate = true;
    },
    
    // Calculate and draw links dynamically based on proximity and mouse position
    updateNetworkLines() {
        const linePositions = [];
        const lineColors = [];
        
        // 1. Draw static grid links between nodes
        for (let i = 0; i < this.nodeCount; i++) {
            for (let j = i + 1; j < this.nodeCount; j++) {
                const nodeA = this.nodes[i];
                const nodeB = this.nodes[j];
                
                const dist = nodeA.pos.distanceTo(nodeB.pos);
                
                if (dist < this.maxDistance) {
                    linePositions.push(nodeA.pos.x, nodeA.pos.y, nodeA.pos.z);
                    linePositions.push(nodeB.pos.x, nodeB.pos.y, nodeB.pos.z);
                    
                    lineColors.push(nodeA.color.r, nodeA.color.g, nodeA.color.b);
                    lineColors.push(nodeB.color.r, nodeB.color.g, nodeB.color.b);
                }
            }
        }
        
        // 2. Project mouse pointer coordinate in group context and draw interactive connection threads
        const mouseLocal = new THREE.Vector3(
            Portfolio3D.mouseX * 1.8,
            Portfolio3D.mouseY * 1.3,
            0
        );
        const mouseInGroup = mouseLocal.clone().applyMatrix4(this.group.matrixWorld.clone().invert());
        
        // Connect cursor to closest 3 nodes to show active cyber-probing tracking
        const sortedNodes = [...this.nodes].map(node => {
            return { node, dist: node.pos.distanceTo(mouseInGroup) };
        }).sort((a, b) => a.dist - b.dist);
        
        const maxTrackDist = 1.6;
        for (let k = 0; k < Math.min(3, sortedNodes.length); k++) {
            const target = sortedNodes[k];
            if (target.dist < maxTrackDist) {
                linePositions.push(mouseInGroup.x, mouseInGroup.y, mouseInGroup.z);
                linePositions.push(target.node.pos.x, target.node.pos.y, target.node.pos.z);
                
                // Bright white connection laser fading to theme cyan or pink
                lineColors.push(1.0, 1.0, 1.0);
                lineColors.push(target.node.color.r, target.node.color.g, target.node.color.b);
            }
        }
        
        const posFloat = new Float32Array(linePositions);
        const colFloat = new Float32Array(lineColors);
        
        this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(posFloat, 3));
        this.linesGeometry.setAttribute('color', new THREE.BufferAttribute(colFloat, 3));
        this.linesGeometry.attributes.position.needsUpdate = true;
        this.linesGeometry.attributes.color.needsUpdate = true;
    },
    
    onResize() {
        const canvas = document.querySelector('#contact-3d-canvas');
        if (!canvas) return;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    },
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Local boundaries
        const boundsX = 1.6;
        const boundsY = 1.2;
        const boundsZ = 1.2;
        
        // Projected mouse in group coordinates for physics force
        const mouseLocal = new THREE.Vector3(
            Portfolio3D.mouseX * 1.8,
            Portfolio3D.mouseY * 1.3,
            0
        );
        const mouseInGroup = mouseLocal.clone().applyMatrix4(this.group.matrixWorld.clone().invert());
        
        // Physics force parameters
        const forceRadius = 0.85; // Distance to react to mouse
        const forceStrength = 0.05;
        
        // Move and apply physics to nodes
        for (let i = 0; i < this.nodeCount; i++) {
            const node = this.nodes[i];
            
            // Standard drift
            node.pos.add(node.vel);
            
            // Mouse push force (repulsion)
            const toNode = new THREE.Vector3().subVectors(node.pos, mouseInGroup);
            const dist2D = Math.sqrt(toNode.x * toNode.x + toNode.y * toNode.y); // Use 2D distance for flat screen hover
            
            if (dist2D < forceRadius && dist2D > 0.01) {
                const dir = toNode.normalize();
                const pushForce = (1.0 - dist2D / forceRadius) * forceStrength;
                node.pos.addScaledVector(dir, pushForce);
            }
            
            // Boundary bounce checks
            if (Math.abs(node.pos.x) > boundsX) {
                node.vel.x *= -1;
                node.pos.x = Math.sign(node.pos.x) * boundsX;
            }
            if (Math.abs(node.pos.y) > boundsY) {
                node.vel.y *= -1;
                node.pos.y = Math.sign(node.pos.y) * boundsY;
            }
            if (Math.abs(node.pos.z) > boundsZ) {
                node.vel.z *= -1;
                node.pos.z = Math.sign(node.pos.z) * boundsZ;
            }
        }
        
        // Recalculate mesh graphs
        this.updatePointsGeometry();
        this.updateNetworkLines();
        
        // Slow autonomous rotation
        this.group.rotation.y += 0.0015;
        this.group.rotation.x += 0.0005;
        
        // Gentle rotation tracking mouse position
        const targetRotY = Portfolio3D.mouseX * 0.4;
        const targetRotX = Portfolio3D.mouseY * 0.25;
        
        this.group.rotation.y += (targetRotY - this.group.rotation.y) * 0.05;
        this.group.rotation.x += (targetRotX - this.group.rotation.x) * 0.05;
        
        this.renderer.render(this.scene, this.camera);
    }
};

// 3D Object for Footer: Interactive 3D Hacker at Desk wearing Anonymous Mask
const FooterMask3D = {
    scene: null,
    camera: null,
    renderer: null,
    group: null,
    
    // Animated components
    headGroup: null,
    armL: null,
    armR: null,
    screenLight: null,
    
    // Atmospheric particles
    particlesGeometry: null,
    particlesCount: 35,
    particleData: [],
    
    init() {
        const canvas = document.querySelector('#footer-mask-canvas');
        if (!canvas) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup (wider perspective to capture the desk scene)
        this.camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        this.camera.position.set(0, 0.2, 3.4);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Main group containing the desk setup
        this.group = new THREE.Group();
        this.scene.add(this.group);
        
        // Colors
        const cyan = 0x00f2fe;
        const pink = 0xff007f;
        const darkBase = 0x04040a;
        
        // --- 1. The Cyber Desk ---
        const deskGeom = new THREE.BoxGeometry(2.2, 0.05, 1.0);
        const deskMat = new THREE.MeshStandardMaterial({
            color: darkBase,
            roughness: 0.1,
            metalness: 0.9
        });
        const desk = new THREE.Mesh(deskGeom, deskMat);
        desk.position.y = -0.55;
        this.group.add(desk);
        
        // Glowing cyan outline edge for desk
        const deskWireMat = new THREE.MeshBasicMaterial({ color: cyan, wireframe: true });
        const deskWire = new THREE.Mesh(deskGeom, deskWireMat);
        desk.add(deskWire);
        
        // Desk Legs (4 neon cyber legs)
        const legGeom = new THREE.BoxGeometry(0.03, 0.6, 0.03);
        const legMat = new THREE.MeshBasicMaterial({ color: cyan });
        
        // Front legs
        const legFL = new THREE.Mesh(legGeom, legMat);
        legFL.position.set(-0.9, -0.3, 0.35);
        desk.add(legFL);
        
        const legFR = new THREE.Mesh(legGeom, legMat);
        legFR.position.set(0.9, -0.3, 0.35);
        desk.add(legFR);
        
        // Back legs
        const legBL = new THREE.Mesh(legGeom, legMat);
        legBL.position.set(-0.9, -0.3, -0.35);
        desk.add(legBL);
        
        const legBR = new THREE.Mesh(legGeom, legMat);
        legBR.position.set(0.9, -0.3, -0.35);
        desk.add(legBR);
        
        // --- 2. Cyber Chair ---
        const chairBackGeom = new THREE.BoxGeometry(0.55, 0.9, 0.08);
        const chairMat = new THREE.MeshStandardMaterial({
            color: 0x060612,
            roughness: 0.5,
            metalness: 0.8
        });
        const chairBack = new THREE.Mesh(chairBackGeom, chairMat);
        chairBack.position.set(0, 0.1, -0.48);
        chairBack.rotation.x = 0.06;
        this.group.add(chairBack);
        
        // Chair neon pink trim
        const chairWireMat = new THREE.MeshBasicMaterial({ color: pink, wireframe: true });
        const chairWire = new THREE.Mesh(chairBackGeom, chairWireMat);
        chairBack.add(chairWire);
        
        const headrestGeom = new THREE.BoxGeometry(0.38, 0.22, 0.08);
        const headrest = new THREE.Mesh(headrestGeom, chairMat);
        headrest.position.set(0, 0.54, 0);
        chairBack.add(headrest);
        
        const headrestWire = new THREE.Mesh(headrestGeom, chairWireMat);
        headrest.add(headrestWire);
        
        // --- 3. The Hacker Torso (Hooded figure body) ---
        const torsoGeom = new THREE.ConeGeometry(0.36, 0.75, 6);
        const torsoMat = new THREE.MeshStandardMaterial({
            color: 0x080812,
            roughness: 0.85,
            metalness: 0.1
        });
        const torso = new THREE.Mesh(torsoGeom, torsoMat);
        torso.position.set(0, -0.22, -0.28);
        torso.rotation.x = 0.14; // Lean forward
        this.group.add(torso);
        
        // Holographic Pink wireframe torso shell
        const torsoWireMat = new THREE.MeshBasicMaterial({
            color: pink,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const torsoWire = new THREE.Mesh(torsoGeom, torsoWireMat);
        torso.add(torsoWire);
        
        // --- 4. The Head Group (Hoodie hood + Anonymous mask) ---
        this.headGroup = new THREE.Group();
        this.headGroup.position.set(0, 0.35, -0.2);
        this.group.add(this.headGroup);
        
        // Base Face Block (black out inside the hood)
        const faceGeom = new THREE.SphereGeometry(0.18, 12, 12);
        const faceMat = new THREE.MeshBasicMaterial({ color: 0x020205 });
        const face = new THREE.Mesh(faceGeom, faceMat);
        this.headGroup.add(face);
        
        // Hoodie Hood (enveloping back of head)
        const hoodGeom = new THREE.SphereGeometry(0.22, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.72);
        const hood = new THREE.Mesh(hoodGeom, torsoMat);
        hood.position.set(0, 0.04, -0.05);
        hood.rotation.x = -0.35;
        this.headGroup.add(hood);
        
        const hoodWire = new THREE.Mesh(hoodGeom, torsoWireMat);
        hood.add(hoodWire);
        
        // --- 5. Mini Anonymous Mask (attached forward) ---
        const maskGeom = new THREE.SphereGeometry(0.18, 12, 10, 0, Math.PI);
        maskGeom.scale(1.0, 1.25, 0.65);
        const maskMat = new THREE.MeshPhysicalMaterial({
            color: 0x020208,
            transparent: true,
            opacity: 0.8,
            roughness: 0.1,
            metalness: 0.8,
            clearcoat: 1.0,
            side: THREE.DoubleSide
        });
        const mask = new THREE.Mesh(maskGeom, maskMat);
        mask.position.set(0, 0, 0.05);
        mask.rotation.y = -Math.PI / 2; // Face forward
        this.headGroup.add(mask);
        
        // Mask details
        const maskWireMat = new THREE.MeshBasicMaterial({ color: cyan, wireframe: true });
        const maskWire = new THREE.Mesh(maskGeom, maskWireMat);
        mask.add(maskWire);
        
        // Pink glowing slit eyes
        const eyeGeom = new THREE.BoxGeometry(0.04, 0.01, 0.02);
        const eyeMat = new THREE.MeshBasicMaterial({ color: pink });
        
        const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
        leftEye.position.set(-0.06, 0.04, 0.1);
        
        const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
        rightEye.position.set(0.06, 0.04, 0.1);
        this.headGroup.add(leftEye, rightEye);
        
        // Eyebrows (Cyan arches)
        const browGeom = new THREE.BoxGeometry(0.05, 0.005, 0.01);
        const browMat = new THREE.MeshBasicMaterial({ color: cyan });
        
        const leftBrow = new THREE.Mesh(browGeom, browMat);
        leftBrow.position.set(-0.06, 0.075, 0.1);
        leftBrow.rotation.z = 0.15;
        
        const rightBrow = new THREE.Mesh(browGeom, browMat);
        rightBrow.position.set(0.06, 0.075, 0.1);
        rightBrow.rotation.z = -0.15;
        this.headGroup.add(leftBrow, rightBrow);
        
        // Curled Mustache / Smile
        const mustacheGeom = new THREE.TorusGeometry(0.065, 0.007, 4, 10, Math.PI / 2);
        const mustacheMat = new THREE.MeshBasicMaterial({ color: pink });
        const mustache = new THREE.Mesh(mustacheGeom, mustacheMat);
        mustache.position.set(0, -0.04, 0.1);
        mustache.rotation.z = Math.PI;
        this.headGroup.add(mustache);
        
        // Goatee
        const goateeGeom = new THREE.ConeGeometry(0.02, 0.06, 4);
        const goateeMat = new THREE.MeshBasicMaterial({ color: cyan });
        const goatee = new THREE.Mesh(goateeGeom, goateeMat);
        goatee.position.set(0, -0.11, 0.095);
        goatee.rotation.x = Math.PI;
        this.headGroup.add(goatee);
        
        // --- 6. Laptop Rig ---
        const laptopGroup = new THREE.Group();
        laptopGroup.position.set(0, -0.52, 0.12);
        this.group.add(laptopGroup);
        
        // Laptop base
        const lBaseGeom = new THREE.BoxGeometry(0.48, 0.018, 0.32);
        const laptopBaseMat = new THREE.MeshStandardMaterial({ color: 0x06060f, roughness: 0.4 });
        const lBase = new THREE.Mesh(lBaseGeom, laptopBaseMat);
        laptopGroup.add(lBase);
        
        // Keyboard glow grid
        const kbdGeom = new THREE.PlaneGeometry(0.42, 0.24);
        const kbdMat = new THREE.MeshBasicMaterial({
            color: cyan,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const kbd = new THREE.Mesh(kbdGeom, kbdMat);
        kbd.rotation.x = -Math.PI / 2;
        kbd.position.y = 0.01;
        laptopGroup.add(kbd);
        
        // Screen base tilt
        const screenGroup = new THREE.Group();
        screenGroup.position.set(0, 0.01, -0.15);
        screenGroup.rotation.x = -0.42; // Tilt back
        laptopGroup.add(screenGroup);
        
        // Screen shell/lid
        const lidGeom = new THREE.BoxGeometry(0.48, 0.32, 0.014);
        const lid = new THREE.Mesh(lidGeom, laptopBaseMat);
        lid.position.y = 0.16;
        screenGroup.add(lid);
        
        // Glowing cyan screen panel
        const panelGeom = new THREE.PlaneGeometry(0.44, 0.28);
        const panelMat = new THREE.MeshBasicMaterial({ color: cyan });
        const panel = new THREE.Mesh(panelGeom, panelMat);
        panel.position.set(0, 0.16, 0.008);
        screenGroup.add(panel);
        
        // Code overlay text mesh representation
        const codeGeom = new THREE.PlaneGeometry(0.42, 0.26);
        const codeMat = new THREE.MeshBasicMaterial({
            color: darkBase,
            transparent: true,
            opacity: 0.85,
            wireframe: true
        });
        const code = new THREE.Mesh(codeGeom, codeMat);
        code.position.set(0, 0.16, 0.01);
        screenGroup.add(code);
        
        // Light emission from laptop code screen casting onto hacker
        this.screenLight = new THREE.PointLight(cyan, 3.5, 3);
        this.screenLight.position.set(0, 0.2, 0.28);
        screenGroup.add(this.screenLight);
        
        // --- 7. Holographic AR Screens (Sci-Fi Hud overlays) ---
        const holoGeom1 = new THREE.PlaneGeometry(0.5, 0.3);
        const holoMat1 = new THREE.MeshBasicMaterial({
            color: cyan,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide
        });
        const holoScreen1 = new THREE.Mesh(holoGeom1, holoMat1);
        holoScreen1.position.set(-0.45, 0.08, 0.25);
        holoScreen1.rotation.set(-0.2, 0.42, 0);
        this.group.add(holoScreen1);
        
        const holoGridMat = new THREE.MeshBasicMaterial({ color: cyan, wireframe: true, transparent: true, opacity: 0.45 });
        const holoGrid1 = new THREE.Mesh(holoGeom1, holoGridMat);
        holoScreen1.add(holoGrid1);
        
        const holoScreen2 = new THREE.Mesh(holoGeom1, holoMat1);
        holoScreen2.position.set(0.45, 0.08, 0.25);
        holoScreen2.rotation.set(-0.2, -0.42, 0);
        this.group.add(holoScreen2);
        
        const holoGrid2 = new THREE.Mesh(holoGeom1, holoGridMat);
        holoScreen2.add(holoGrid2);
        
        // --- 8. Hacker Arms (glowing lines typing) ---
        const armGeom = new THREE.BoxGeometry(0.035, 0.035, 0.36);
        const armMat = new THREE.MeshBasicMaterial({ color: cyan });
        
        this.armL = new THREE.Mesh(armGeom, armMat);
        this.armL.position.set(-0.22, -0.38, -0.06);
        this.armL.rotation.set(-0.25, 0.2, 0);
        this.group.add(this.armL);
        
        this.armR = new THREE.Mesh(armGeom, armMat);
        this.armR.position.set(0.22, -0.38, -0.06);
        this.armR.rotation.set(-0.25, -0.2, 0);
        this.group.add(this.armR);
        
        // --- 9. Atmospheric Cyber-Dust Stream ---
        const particlePositions = new Float32Array(this.particlesCount * 3);
        this.particleData = [];
        
        for (let i = 0; i < this.particlesCount; i++) {
            const px = (Math.random() - 0.5) * 2.2;
            const py = -0.55 + Math.random() * 1.5;
            const pz = (Math.random() - 0.5) * 1.5;
            
            particlePositions[i * 3] = px;
            particlePositions[i * 3 + 1] = py;
            particlePositions[i * 3 + 2] = pz;
            
            this.particleData.push({
                pos: new THREE.Vector3(px, py, pz),
                speedY: 0.004 + Math.random() * 0.007,
                speedX: (Math.random() - 0.5) * 0.002
            });
        }
        
        this.particlesGeometry = new THREE.BufferGeometry();
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const pTexture = Portfolio3D.createParticleTexture();
        const pMat = new THREE.PointsMaterial({
            size: 0.07,
            color: cyan,
            transparent: true,
            opacity: 0.7,
            map: pTexture,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const particlesSystem = new THREE.Points(this.particlesGeometry, pMat);
        this.group.add(particlesSystem);
        
        // --- Ambient Scene Lighting ---
        const ambientLight = new THREE.AmbientLight(0x060614);
        this.scene.add(ambientLight);
        
        const pinkFillLight = new THREE.PointLight(pink, 1.4, 6);
        pinkFillLight.position.set(2, 1.5, -2); // Backlight
        this.scene.add(pinkFillLight);
        
        // Window events
        window.addEventListener('resize', () => this.onResize());
        
        // Run animation
        this.animate();
    },
    
    onResize() {
        const canvas = document.querySelector('#footer-mask-canvas');
        if (!canvas) return;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    },
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.0012;
        
        // 1. Hacker typing motion (alternating arm typing twitch)
        if (this.armL) {
            this.armL.position.y = -0.38 + Math.sin(time * 16) * 0.012;
            this.armL.rotation.z = Math.sin(time * 10) * 0.05;
        }
        if (this.armR) {
            this.armR.position.y = -0.38 + Math.cos(time * 14) * 0.012;
            this.armR.rotation.z = Math.cos(time * 12) * -0.05;
        }
        
        // 2. Head motion (natural coder head tilts)
        if (this.headGroup) {
            this.headGroup.rotation.y = Math.sin(time * 1.6) * 0.04;
            this.headGroup.rotation.x = Math.cos(time * 0.7) * 0.02;
        }
        
        // 3. Screen glow terminal light flicker
        if (this.screenLight) {
            this.screenLight.intensity = 3.0 + Math.sin(time * 28) * 0.6 + Math.random() * 0.25;
        }
        
        // 4. Update rising cyber-dust particles
        if (this.particlesGeometry) {
            const positions = this.particlesGeometry.attributes.position.array;
            for (let i = 0; i < this.particlesCount; i++) {
                const p = this.particleData[i];
                p.pos.y += p.speedY;
                p.pos.x += p.speedX;
                
                // Reset particles if they float off screen bounds
                if (p.pos.y > 1.0) {
                    p.pos.y = -0.55;
                    p.pos.x = (Math.random() - 0.5) * 2.2;
                }
                
                positions[i * 3] = p.pos.x;
                positions[i * 3 + 1] = p.pos.y;
                positions[i * 3 + 2] = p.pos.z;
            }
            this.particlesGeometry.attributes.position.needsUpdate = true;
        }
        
        // 5. Front-facing cursor tracking (only interacts with mouse pointer)
        const targetRotY = Portfolio3D.mouseX * 0.55;
        const targetRotX = Portfolio3D.mouseY * 0.28;
        
        this.group.rotation.y += (targetRotY - this.group.rotation.y) * 0.08;
        this.group.rotation.x += (targetRotX - this.group.rotation.x) * 0.08;
        
        this.renderer.render(this.scene, this.camera);
    }
};
