


// import * as THREE from "three";
// import { useParams } from "react-router-dom";
// import { Canvas, useThree, useFrame } from "@react-three/fiber";
// import { Children, Suspense, useCallback, useEffect, useRef, useState } from "react";
// import { Bvh, Center, OrbitControls, useGLTF } from "@react-three/drei";
// import { EffectComposer, Outline, Selection, Select, ToneMapping } from "@react-three/postprocessing";

// function ControlsFollowModel({ modelRef }) {

//   const controlsRef = useRef();
//   return (
//     <OrbitControls
//       ref={controlsRef}
//       enablePan={false}
//       enableZoom
//       minPolarAngle={Math.PI / 2}
//       maxPolarAngle={Math.PI / 2}
//       onStart={() => {
//         const controls = controlsRef.current;
//         const root = modelRef.current;
//         if (!controls || !root) return;

//         const box = new THREE.Box3().setFromObject(root);
//         const center = box.getCenter(new THREE.Vector3());
//         controls.target.copy(center);
//         controls.update();
//       }}
//     />
//   );
// }


// function HoverSelect({ id, hoveredId, setHoverId, children }) {
//   const enter = (e) => {
//     e.stopPropagation();
//     if (hoveredId !== id) setHoverId(id);
//   };

//   const leave = (e) => {
//     e.stopPropagation();
//     if (hoveredId === id) setHoverId(null);
//   };

//   return (
//     <Select enabled={hoveredId === id}>
//       <group onPointerEnter={enter} onPointerLeave={leave}>
//         {children}
//       </group>
//     </Select>
//   );
// }


// export default function StationST10({className="", hoveredId, setHoverId, items}) {
//   const { id } = useParams();
//   const modelRef = useRef()
//   const partRefs = useRef({});

//   return (
//     <div className={`flex flex-col mt-9 w-full h-full min-h-0 ${className}`}>
//         <div className="w-full relative left-1/2 px-4 z-50 py-1 -translate-x-1/2 rounded-t-2xl bg-slate-600">Station {id}</div>
//         <div className="flex-1 min-h-0 w-full">

//     <Canvas camera={{ position: [1, 1, 1], fov: 80 }} className="rounded-b-2xl w-full min-h-100 bg-slate-900">
//         <ambientLight intensity={0.7} />
//         <directionalLight position={[1, 100, 30]} intensity={10} />


//     {/* Scene */}
//     <group ref={modelRef} rotation={[2.3, -0.4, 2.3]}>
//       <Suspense fallback={null}>
//         <Center>
//           {/* Outline only when hovered */}
//           <Selection>
          
//           <EffectComposer autoClear={false} multisampling={4}>
//           <Outline
//           edgeStrength={0.8}
//           blur={false}
//           visibleEdgeColor={0xffff00}
//           hiddenEdgeColor={0xffff00}/>
//           </EffectComposer>


//           {items.map(item=>(
//           <HoverSelect key={item.id} id={item.id}
//           hoveredId={hoveredId}
//           setHoverId={setHoverId}>
//           <item.Model/>
//           </HoverSelect>))}
//           </Selection>
          
//         </Center>
//       </Suspense>
//     </group>

//     {/* Postprocessing */}
//         <ControlsFollowModel modelRef={modelRef} />
//       </Canvas>
//         </div>
//     </div>
//   );
// }


//   const controlsRef = useRef();

// useEffect(() => {
//     const controls = controlsRef.current;
//     const root = modelRef.current;
//     if (!controls || !root) return;

//     // wait 1 frame so children from Suspense are mounted
//     requestAnimationFrame(() => {
//       const box = new THREE.Box3().setFromObject(root);
//       const center = box.getCenter(new THREE.Vector3());
//       controls.target.copy(center);
//       controls.update();
//     });
//   }, []);

//   return (
//     <OrbitControls
//       ref={controlsRef}
//       enablePan={false}
//       enableZoom={true}
//       minPolarAngle={Math.PI / 2}
//       maxPolarAngle={Math.PI / 2}
//     />
//   );
// }


// Object { x: 15.035469216831313, y: 33.588406105372826, z: 11.013187153956281 }

// function DebugThree() { 
//   const three = useRef(); 
//   useEffect(() => 
//     {if (three.current) {
//       console.log("useThree:", three.current)}},[]); 
//   return <OrbitControls ref={three} />; }


// function StationModel({modelRef, ...props}) {

//   const { nodes, materials } = useGLTF('/onload-transformed.glb')
//   return (
//     <group {...props} ref={modelRef} scale={1.3} dispose={null}>
//       <mesh geometry={nodes['AP727101290_Default<As_Machined>'].geometry} material={materials.PaletteMaterial001} 
//       position={[-1,-0.65, 0]} 
//       rotation={[1.5, 0, -1.5]} />
//     </group>
//     )
//   }

// function RobotDebug(){
//   const model=useGLTF("/models/Conveyor_L.glb")
//   useEffect(()=>{
//     console.log("scene children: ", model.scene.children)
//         console.log("nodes: ", model.nodes.group
//         )

//   })
// }

// function ControlsWithLog({modelRef}){
//   const {camera}=useThree()
//   const lastLogRef = useRef(0)
//   useEffect(()=>{
//     if (modelRef?.current) {
//     console.log("Current model location", modelRef.current.position);
//     console.log("Camera data :", camera.position)
//   } else {
//     console.log("model not ready")
//   }}, [modelRef.current])

//   const logNow=()=>{
//     const now = performance.now();
//     if (now - lastLogRef.current < 500) return; // 2 logs/sec max
//     lastLogRef.current = now;
//     console.log("Camera position:", camera.position);
    
//     if (modelRef?.current) {
//       console.log("Model local position:", modelRef.current.position);
//       console.log("Camera data :", camera.position.x)
//     } else {
//       console.log("Model not loaded yet");
//     }
//   }

//   return <OrbitControls onChange={logNow}/>
//   }


// function setHighlight(root, on) {
//     if (!root) return;
//     root.traverse((o) => {
//       if (!o.isMesh) return;
//       const mats = Array.isArray(o.material) ? o.material : [o.material];


//       mats.forEach((m) => {
//         if (!m) return;
//         console.log("material type:", m.type, "has emissive:", !!m.emissive, "has color:", !!m.color);

//         if ("emissive" in m) {
//           m.emissive.set(on ? "yellow" : "#000000");
//           m.emissiveIntensity = on ? 0.8 : 0;
//           m.needsUpdate = true;

//         }
//       });
//     });
//   }


  // highlight logic in one place
//   const prevHovered = useRef(null);
//   useEffect(() => {
//     if (prevHovered.current) {
//       setHighlight(partRefs.current[prevHovered.current], false);
//     }
//     if (hovered) {
//       setHighlight(partRefs.current[hovered], true);
//     }
//     prevHovered.current = hovered;

//     console.log(hovered ? `Hovered part: ${hovered}` : "Hover cleared");
//   }, [hovered]);


// useEffect(() => {

//   if (hovered) {
//     console.log("Hovered part:", hovered);
//   } else {
//     console.log("Hover cleared");
//   }
// }, [hovered]);


// bcrypt hash callback hell. 
// bcrypt.hash(password, hashRounds, async (err, hash) => {
//   await db.query(...);
// });

// separate the async db.query from bcrypt.hash
// const hash = await bcrypt.hash(password, hashRounds);

// await db.query(
//   "INSERT INTO users (email, password) VALUES ($1, $2)",
//   [email, hash]
// );
