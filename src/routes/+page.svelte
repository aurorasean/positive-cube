<script lang="ts">
	import { tweened } from "svelte/motion";
	import { texts } from "$lib/texts";
	import { ContentManager, type ContentItem } from "$lib/contentManager";

	import * as SC from "svelte-cubed";
	import { onMount } from "svelte";

	import * as THREE from "three";
	import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
	import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
	import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
	import { linear, quartInOut } from "svelte/easing";
	
	let defaultStartHover = -0.5;
	let defaultRotationTimer = 500;
	let defaultEndHover = 0.01;
	let hoverPosition = tweened(defaultStartHover, {
		duration: 100,
		easing: linear,
	});
	let rotationPosition = tweened(THREE.MathUtils.degToRad(15), {
		duration: defaultRotationTimer,
		easing: linear,
	});

	let isPlaying = false;
	let model: GLTF;
	let modelHover: THREE.Mesh;
	let label: THREE.Mesh;
	let hourGlass: THREE.Mesh;

	let font: Font;
	let camera: any;
	let labelText = "The\nPositive\nCube";
	let canvas: SC.Canvas;
	let isHovered = false;
	let contentManager = ContentManager.getInstance();
	let currentContent: ContentItem | null = null;
	
	$: cubeZoom = 6;
	$: mainCubePosition = [0, 0, 0] as [number, number, number];
	$: cubePos = [0, 0, $hoverPosition] as [number, number, number];
	$: cubeRotation = [0, $rotationPosition, 0] as [number, number, number];
	$: threeCamera = camera?.$$.ctx[camera?.$$.ctx.length - 1];
	$: hourGlassPos = [0, 0.0, 0.6] as [number, number, number];
	let defaultLabelposition = 0.95;
	$: labelPosition = [0, 0, defaultLabelposition] as [number, number, number];
	
	let hourGlassRoationTween = tweened(THREE.MathUtils.degToRad(0), {
		duration: 1000,
		easing: quartInOut,
	});
	$: hourGlassRotation = [0, 0, $hourGlassRoationTween] as [
		number,
		number,
		number,
	];

	function loadGLTF() {
		const loader = new GLTFLoader();
		return loader.loadAsync("./Cube-Test.glb");
	}
	
	function loadGLTFHover() {
		const loader = new GLTFLoader();
		return loader.loadAsync("./Cube-Test_hover.glb");
	}
	
	const loadLabel = (
		textValue: string = labelText,
		color: number = 0x00ff00,
	) => {
		const labelgeo = new TextGeometry(textValue, {
			font: font,
			size: 0.1,
			depth: 0.001,
		});
		const labelmat = new THREE.MeshBasicMaterial({ color: color });
		labelgeo.center();
		labelgeo.computeBoundingSphere();

		label = new THREE.Mesh(labelgeo, labelmat);
	};

	$: font, labelText, loadLabel();

	const fontLoader = new FontLoader();
	const loadFont = () => {
		fontLoader.load(
			"./helvetiker_regular.typeface.json",
			function (fontValue) {
				font = fontValue;
			},
		);
	};

	const loadHourGlassMesh = () => {
		const geometry = new THREE.PlaneGeometry(1, 1);
		const texture = new THREE.TextureLoader().load("hour-glass-1.png");
		texture.minFilter = THREE.NearestFilter;
		texture.magFilter = THREE.NearestFilter;

		const material = new THREE.MeshBasicMaterial({
			side: THREE.DoubleSide,
			transparent: true,
			map: texture,
		});
		const plane = new THREE.Mesh(geometry, material);
		hourGlass = plane;
	};

	onMount(() => {
		window.addEventListener("resize", handleWindowSize);
		handleWindowSize();

		loadGLTFHover().then((_model) => {
			var material2 = new THREE.MeshLambertMaterial({
				color: 0x00ff22,
				transparent: true,
				opacity: 0.1,
			});
			_model.scene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = material2;
					modelHover = child;
				}
			});
		});
		
		loadFont();
		loadGLTF().then((_model) => (model = _model));
		loadHourGlassMesh();
	});

	let isInCanvas = false;

	const handleMouseEnter = (e: MouseEvent) => {
		isInCanvas = true;
	};
	
	const handleMouseLeave = (e: MouseEvent) => {
		isInCanvas = false;
	};

	const setToDefault = () => {
		let elem = canvas.$$.ctx[1];
		elem.style.cursor = "default";
	};
	
	const setToPoint = () => {
		let elem = canvas.$$.ctx[1];
		elem.style.cursor = "pointer";
	};

	const handleEvent = (clientX: number, clientY: number) => {
		if (!isInCanvas || !threeCamera || !model || isPlaying) {
			return false;
		}

		const raycaster = new THREE.Raycaster();
		const pointerV2 = getMouseCordsAsV2(clientX, clientY);
		raycaster.setFromCamera(pointerV2, threeCamera);
		const intersects = raycaster.intersectObjects([model.scene]);
		if (intersects.length > 0) {
			hoverPosition.set(defaultEndHover);
			setToPoint();
			isHovered = true;
			return true;
		} else {
			hoverPosition.set(defaultStartHover);
			setToDefault();
			isHovered = false;
			return false;
		}
	};

	const getMouseCordsAsV2 = (clientX: number, clientY: number) => {
		let elem = canvas.$$.ctx[1];
		let x = (clientX / elem.clientWidth) * 2 - 1;
		let y = -(clientY / elem.clientHeight) * 2 + 1;
		return new THREE.Vector2(x, y);
	};
	
	const handleMouseMove = (e: MouseEvent) => {
		handleEvent(e.clientX, e.clientY);
	};

	const setLabelBackToDefault = () => {
		loadLabel();
		currentContent = null;
	};
	let timeoutReset = null;
	const handleRandomSelector = () => {
		isPlaying = true;
		hoverPosition.set(defaultStartHover);
	    if(timeoutReset) {
			clearTimeout(timeoutReset)
		}
		showThinking(() => {
			// Get random content from the content manager
			currentContent = contentManager.getRandomContent();
			animateTheTextOneCharAtATime(() => {
				isPlaying = false;
				// Calculate total animation duration and add display time
				const textLength = currentContent ? contentManager.formatContentForDisplay(currentContent, 17).length : 0;
				const animationDuration = textLength * 50; // 50ms per character
				const displayTime = 8000; // 8 seconds to read
				
				timeoutReset = setTimeout(() => {
					setLabelBackToDefault();
				}, displayTime); // Only wait for display time since animation is already complete
			});
		});
	};
	
	const showThinking = (nextFunction: Function) => {
		labelPosition[2] = 0.6;
		hourGlassPos[2] = defaultLabelposition;
		hourGlassRoationTween.set(THREE.MathUtils.degToRad(90)).then(() => {
			hourGlassRoationTween.set(THREE.MathUtils.degToRad(0)).then(() => {
				hourGlassRoationTween
					.set(THREE.MathUtils.degToRad(-90))
					.then(() => {
						hourGlassRoationTween
							.set(THREE.MathUtils.degToRad(0))
							.then(() => {
								hourGlassPos[2] = 0.6;
								labelPosition[2] = defaultLabelposition;
								nextFunction();
							});
					});
			});
		});
	};
	
	const handleWindowSize = () => {
		if (window.innerWidth < 600) {
			cubeZoom = 7;
		} else if (window.innerWidth < 800) {
			cubeZoom = 6;
		} else {
			cubeZoom = 5;
		}
		cubeZoom = window.innerWidth < 600 ? 7 : 6;
	};
	
	const animateTheTextOneCharAtATime = (nextFunction: Function) => {
		if (!currentContent) return;
		
		const textValue = contentManager.formatContentForDisplay(currentContent, 17);
		const textEmpty = textValue.replace(/./g, " ");
		const contentColor = currentContent.color; // Store the color to avoid null access
		
		for (let i = 0; i <= textValue.length; i++) {
			setTimeout(() => {
				loadLabel(
					textValue.substring(0, i) + textEmpty.substring(i),
					contentColor, // Use stored color instead of accessing currentContent.color
				);
				if (i === textValue.length) {
					nextFunction();
				}
			}, i * 50); // Slightly faster animation
		}
	};

	let touchStartTime = 0;
	let isTouchedStill = false;
	
	const handleTouchStart = (e: TouchEvent) => {
		isInCanvas = true;
		touchStartTime = Date.now();
		isTouchedStill = true;
		const inBlock = handleEvent(e.touches[0].clientX, e.touches[0].clientY);

		setTimeout(() => {
			if (isTouchedStill && inBlock && !isPlaying) {
				handleRandomSelector();
			}
		}, 500);
	};
	
	const handleTouchEnd = (e: TouchEvent) => {
		isInCanvas = false;
		isTouchedStill = false;
	};
	
	const handleTouchMove = (e: TouchEvent) => {
		handleEvent(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
	};
	
	const handleMouseClick = (e: MouseEvent) => {
		if (isHovered && !isPlaying) {
			handleRandomSelector();
		}
	};
</script>

<div style="display: flex; flex-direction: column">
	<div style="z-index: 1; display: none">
		<input type="text" bind:value={labelText} />
		<button on:click={() => hoverPosition.set(defaultEndHover)}>click 1</button>
		<button on:click={() => hoverPosition.set(defaultStartHover)}>click 0</button>
		<p>Scale: {$hoverPosition}</p>
	</div>
	
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		id="canvas"
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
		on:mousemove={handleMouseMove}
		on:mousedown={handleMouseClick}
		on:touchstart={handleTouchStart}
		on:touchend={handleTouchEnd}
		on:touchmove={handleTouchMove}
	>
		<SC.Canvas
			bind:this={canvas}
			antialias
			background={new THREE.Color("white")}
			stencil
		>
			{#if model}
				<SC.Primitive
					object={model.scene}
					position={mainCubePosition}
					rotation={cubeRotation}
				>
					{#if hourGlass}
						<SC.Primitive
							object={hourGlass}
							position={hourGlassPos}
							rotation={hourGlassRotation}
						/>
					{/if}
					{#if modelHover}
						<SC.Primitive object={modelHover} position={cubePos} />
					{/if}

					{#if label}
						<SC.Primitive object={label} position={labelPosition} />
					{/if}
				</SC.Primitive>
			{/if}
			
			<SC.PerspectiveCamera bind:this={camera} position={[1, 1, 3]} />
			<SC.OrbitControls
				enablePan={false}
				maxPolarAngle={1.6}
				minPolarAngle={1}
				maxDistance={cubeZoom}
				minDistance={cubeZoom}
				dampingFactor={0.1}
				enableDamping={true}
			/>
			<SC.AmbientLight intensity={1} />
			<SC.DirectionalLight intensity={2} position={[-2, 3, 2]} />
		</SC.Canvas>
	</div>
</div>