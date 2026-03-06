import * as THREE from "three";
import { useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useEffect, Suspense, useMemo, useRef } from "react";
import { Center, OrbitControls } from "@react-three/drei";
import { EffectComposer, Outline, ToneMapping } from "@react-three/postprocessing";

function ControlsFollowModel({ modelRef }) {
  const controlsRef = useRef();

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      onStart={() => {
        const controls = controlsRef.current;
        const root = modelRef.current;
        if (!controls || !root) return;

        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        controls.target.copy(center);
        controls.update();
      }}
    />
  );
}

// Collect all meshes under an Object3D
function collectMeshes(object) {
  const meshes = [];
  object.traverse((mesh) => {
    if (mesh.isMesh) meshes.push(mesh);

  });
  return meshes;
}

export default function StationData({ 
  partForm, 
  selectedId, 
  setSelectedId, 
  items }) 
  {
  const { id } = useParams();
  const modelRef = useRef();

  // id -> Mesh[]
  const itemMeshesRef = useRef(new Map());

 useEffect(() => {
  if (modelRef.current) {
  }
});
  
  const outlineSelection = useMemo(() => {
    if (selectedId==null) return [];
    return itemMeshesRef.current.get(selectedId) ?? [];
  }, [selectedId]);

  return (
    <div className={`flex flex-1 flex-col min-h-0 w-full`}>
      <div className="w-full relative left-1/2 px-4 py-1 -translate-x-1/2 rounded-t-2xl bg-slate-600">
        Station {id}
      </div>
      <div className="flex flex-1">
        <Canvas
          camera={{ position: [1, 1, 1], fov: 80 }}
          className="flex rounded-b-2xl w-full bg-slate-900"
          onPointerMissed={()=>setSelectedId?.(null)}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[1, 100, 30]} intensity={10} />

          <EffectComposer autoClear={false} multisampling={4}>
            <Outline
              selection={outlineSelection}
              edgeStrength={0.8}
              blur={false}
              visibleEdgeColor={0xffff00}
              hiddenEdgeColor={0xffff00}
            />
            <ToneMapping />
          </EffectComposer>

          <group ref={modelRef} rotation={[2.3, -0.4, 2.3]}>
            <Suspense fallback={null}>
              <Center>
                  {items.map((item) => (
                    <group
                      key={item.id}
                      ref={(obj) => {
                        if (!obj) {
                          itemMeshesRef.current.delete(item.id);
                         return;
                        }
                        // store all meshes under this item
                        itemMeshesRef.current.set(item.id, collectMeshes(obj));
                      }}
                      onPointerDown={(e)=>{
                        e.stopPropagation();
                        setSelectedId?.(item.id)
                        partForm?.(item.id)}}   
                    >
                      <item.Model />
                    </group>
                  ))}    
              </Center>
            </Suspense>
          </group>

          <ControlsFollowModel modelRef={modelRef} />
        </Canvas>
      </div>
    </div>
  );
}
