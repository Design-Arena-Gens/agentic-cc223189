import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import WatchParts from './WatchParts'
import Controls from './Controls'

export default function WatchMechanism() {
  const [speed, setSpeed] = useState(1)
  const [running, setRunning] = useState(true)
  const [exploded, setExploded] = useState(0)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  const [highlightPart, setHighlightPart] = useState<string | null>(null)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={30}
          maxPolarAngle={Math.PI * 0.9}
          minPolarAngle={0.1}
        />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} />

        <Environment preset="studio" />

        <WatchParts
          speed={speed}
          running={running}
          exploded={exploded}
          selectedPart={selectedPart}
          highlightPart={highlightPart}
          showLabels={showLabels}
        />

        <gridHelper args={[20, 20, '#333', '#111']} position={[0, -3, 0]} />
      </Canvas>

      <Controls
        speed={speed}
        setSpeed={setSpeed}
        running={running}
        setRunning={setRunning}
        exploded={exploded}
        setExploded={setExploded}
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        onHover={setHighlightPart}
      />
    </div>
  )
}
