import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

interface WatchPartsProps {
  speed: number
  running: boolean
  exploded: number
  selectedPart: string | null
  highlightPart: string | null
  showLabels: boolean
}

function Label({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Text
      position={position}
      fontSize={0.3}
      color="white"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.05}
      outlineColor="#000"
    >
      {text}
    </Text>
  )
}

export default function WatchParts({
  speed,
  running,
  exploded,
  selectedPart,
  highlightPart,
  showLabels,
}: WatchPartsProps) {
  const mainspringRef = useRef<THREE.Group>(null)
  const barrelRef = useRef<THREE.Mesh>(null)
  const escapeWheelRef = useRef<THREE.Group>(null)
  const balanceWheelRef = useRef<THREE.Group>(null)
  const thirdWheelRef = useRef<THREE.Group>(null)
  const fourthWheelRef = useRef<THREE.Group>(null)
  const centerWheelRef = useRef<THREE.Group>(null)
  const minuteHandRef = useRef<THREE.Mesh>(null)
  const hourHandRef = useRef<THREE.Mesh>(null)
  const secondHandRef = useRef<THREE.Mesh>(null)
  const palletForkRef = useRef<THREE.Group>(null)

  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (!running) return

    timeRef.current += delta * speed

    // Balance wheel oscillation (300 BPH = 5 Hz, realistic mechanical watch)
    const balanceSpeed = 5 * 2 * Math.PI
    const balanceAngle = Math.sin(timeRef.current * balanceSpeed) * 0.6
    if (balanceWheelRef.current) {
      balanceWheelRef.current.rotation.z = balanceAngle
    }

    // Pallet fork oscillation (synced with balance wheel)
    if (palletForkRef.current) {
      palletForkRef.current.rotation.z = Math.sin(timeRef.current * balanceSpeed) * 0.3
    }

    // Escape wheel (ticks with balance wheel)
    const escapeTicksPerSecond = 5
    const escapeAngle = Math.floor(timeRef.current * escapeTicksPerSecond) * (Math.PI / 15)
    if (escapeWheelRef.current) {
      escapeWheelRef.current.rotation.z = -escapeAngle
    }

    // Fourth wheel (seconds wheel) - 1 rotation per minute
    if (fourthWheelRef.current) {
      fourthWheelRef.current.rotation.z = -(timeRef.current / 10) * Math.PI * 2
    }

    // Second hand
    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = -(timeRef.current / 10) * Math.PI * 2
    }

    // Third wheel - gear ratio
    if (thirdWheelRef.current) {
      thirdWheelRef.current.rotation.z = (timeRef.current / 80) * Math.PI * 2
    }

    // Center wheel (minute wheel) - 1 rotation per hour
    if (centerWheelRef.current) {
      centerWheelRef.current.rotation.z = (timeRef.current / 600) * Math.PI * 2
    }

    // Minute hand
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = (timeRef.current / 600) * Math.PI * 2
    }

    // Hour hand - 1 rotation per 12 hours
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = (timeRef.current / 7200) * Math.PI * 2
    }

    // Barrel (mainspring housing) - slow rotation
    if (barrelRef.current) {
      barrelRef.current.rotation.z = (timeRef.current / 1200) * Math.PI * 2
    }
  })

  const getMaterial = (partName: string, baseColor: string) => {
    const isSelected = selectedPart === partName
    const isHighlighted = highlightPart === partName
    const color = isSelected ? '#ffff00' : isHighlighted ? '#ff8800' : baseColor
    return (
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.2}
        emissive={isSelected || isHighlighted ? color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : isHighlighted ? 0.2 : 0}
      />
    )
  }

  // Gear tooth generator
  const createGearGeometry = (radius: number, teeth: number, thickness: number) => {
    const shape = new THREE.Shape()
    const toothHeight = radius * 0.15
    const toothWidth = (Math.PI * 2 * radius) / teeth / 2

    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2
      const nextAngle = ((i + 0.4) / teeth) * Math.PI * 2
      const nextAngle2 = ((i + 0.6) / teeth) * Math.PI * 2
      const nextAngle3 = ((i + 1) / teeth) * Math.PI * 2

      const x1 = Math.cos(angle) * radius
      const y1 = Math.sin(angle) * radius
      const x2 = Math.cos(nextAngle) * (radius + toothHeight)
      const y2 = Math.sin(nextAngle) * (radius + toothHeight)
      const x3 = Math.cos(nextAngle2) * (radius + toothHeight)
      const y3 = Math.sin(nextAngle2) * (radius + toothHeight)
      const x4 = Math.cos(nextAngle3) * radius
      const y4 = Math.sin(nextAngle3) * radius

      if (i === 0) shape.moveTo(x1, y1)
      else shape.lineTo(x1, y1)
      shape.lineTo(x2, y2)
      shape.lineTo(x3, y3)
      shape.lineTo(x4, y4)
    }
    shape.closePath()

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }

  const gearGeometries = useMemo(() => ({
    escape: createGearGeometry(0.6, 15, 0.1),
    fourth: createGearGeometry(0.8, 20, 0.15),
    third: createGearGeometry(1.0, 24, 0.15),
    center: createGearGeometry(1.2, 28, 0.2),
  }), [])

  const explodeOffset = exploded

  return (
    <group>
      {/* Base plate */}
      <mesh position={[0, -0.5 - explodeOffset * 2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4, 4, 0.3, 32]} />
        {getMaterial('base', '#1a1a1a')}
      </mesh>
      {showLabels && <Label text="Base Plate" position={[0, -0.3 - explodeOffset * 2, 4.5]} />}

      {/* Mainspring barrel */}
      <group ref={mainspringRef} position={[0, 0.5 + explodeOffset * 3, 0]}>
        <mesh ref={barrelRef} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.8, 32]} />
          {getMaterial('barrel', '#2a4a2a')}
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.0, 16]} />
          {getMaterial('barrel', '#1a1a1a')}
        </mesh>
      </group>
      {showLabels && <Label text="Mainspring Barrel" position={[0, 1.5 + explodeOffset * 3, 2]} />}

      {/* Center wheel (minute wheel) */}
      <group ref={centerWheelRef} position={[0, 0.1 + explodeOffset * 1, 0]}>
        <mesh geometry={gearGeometries.center} rotation={[Math.PI / 2, 0, 0]} castShadow>
          {getMaterial('center-wheel', '#c0c0c0')}
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          {getMaterial('center-wheel', '#8a8a8a')}
        </mesh>
      </group>
      {showLabels && <Label text="Center Wheel" position={[0, 0.5 + explodeOffset * 1, 1.5]} />}

      {/* Third wheel */}
      <group ref={thirdWheelRef} position={[2.2, 0.2 + explodeOffset * 1.2, 0]}>
        <mesh geometry={gearGeometries.third} rotation={[Math.PI / 2, 0, 0]} castShadow>
          {getMaterial('third-wheel', '#b8a060')}
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.25, 16]} />
          {getMaterial('third-wheel', '#8a7040')}
        </mesh>
      </group>
      {showLabels && <Label text="Third Wheel" position={[2.2, 0.6 + explodeOffset * 1.2, 1.2]} />}

      {/* Fourth wheel (seconds wheel) */}
      <group ref={fourthWheelRef} position={[-2, 0.3 + explodeOffset * 1.4, 0]}>
        <mesh geometry={gearGeometries.fourth} rotation={[Math.PI / 2, 0, 0]} castShadow>
          {getMaterial('fourth-wheel', '#c08040')}
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.25, 16]} />
          {getMaterial('fourth-wheel', '#906030')}
        </mesh>
      </group>
      {showLabels && <Label text="Fourth Wheel" position={[-2, 0.7 + explodeOffset * 1.4, 1]} />}

      {/* Escape wheel */}
      <group ref={escapeWheelRef} position={[-1.5, 0.4 + explodeOffset * 1.6, 2]}>
        <mesh geometry={gearGeometries.escape} rotation={[Math.PI / 2, 0, 0]} castShadow>
          {getMaterial('escape-wheel', '#d04040')}
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.15, 12]} />
          {getMaterial('escape-wheel', '#a03030')}
        </mesh>
      </group>
      {showLabels && <Label text="Escape Wheel" position={[-1.5, 0.8 + explodeOffset * 1.6, 3]} />}

      {/* Pallet fork */}
      <group ref={palletForkRef} position={[-0.5, 0.5 + explodeOffset * 1.7, 2]}>
        <mesh position={[0, 0, 0.4]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.8]} />
          {getMaterial('pallet-fork', '#e05050')}
        </mesh>
        <mesh position={[-0.1, 0, 0.8]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.15]} />
          {getMaterial('pallet-fork', '#e05050')}
        </mesh>
        <mesh position={[0.1, 0, 0.8]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.15]} />
          {getMaterial('pallet-fork', '#e05050')}
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
          {getMaterial('pallet-fork', '#c04040')}
        </mesh>
      </group>
      {showLabels && <Label text="Pallet Fork" position={[-0.5, 0.9 + explodeOffset * 1.7, 3.2]} />}

      {/* Balance wheel */}
      <group ref={balanceWheelRef} position={[1, 0.6 + explodeOffset * 2, 2]}>
        <mesh castShadow>
          <torusGeometry args={[0.7, 0.08, 16, 32]} />
          {getMaterial('balance-wheel', '#4080ff')}
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
          {getMaterial('balance-wheel', '#3060d0')}
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.35,
              0,
              Math.sin((i * Math.PI) / 2) * 0.35,
            ]}
            rotation={[0, (i * Math.PI) / 2, 0]}
            castShadow
          >
            <boxGeometry args={[0.05, 0.2, 0.7]} />
            {getMaterial('balance-wheel', '#5090ff')}
          </mesh>
        ))}
        {/* Balance spring (hairspring) */}
        <mesh position={[0, -0.15, 0]}>
          <torusGeometry args={[0.4, 0.02, 8, 32, Math.PI * 5]} />
          {getMaterial('balance-wheel', '#6090ff')}
        </mesh>
      </group>
      {showLabels && <Label text="Balance Wheel" position={[1, 1.2 + explodeOffset * 2, 3]} />}

      {/* Dial */}
      <mesh position={[0, 0.7 + explodeOffset * 2.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[3, 3, 0.1, 64]} />
        {getMaterial('dial', '#f5f5f5')}
      </mesh>
      {showLabels && <Label text="Dial" position={[0, 1.0 + explodeOffset * 2.5, 3.5]} />}

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 12
        const radius = 2.5
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              0.75 + explodeOffset * 2.5,
              Math.sin(angle) * radius,
            ]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.12, 8]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
        )
      })}

      {/* Hour hand */}
      <mesh
        ref={hourHandRef}
        position={[0, 0.78 + explodeOffset * 2.6, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.12, 0.08, 1.5]} />
        {getMaterial('hour-hand', '#1a1a1a')}
      </mesh>
      {showLabels && <Label text="Hour Hand" position={[0, 1.2 + explodeOffset * 2.6, 1.8]} />}

      {/* Minute hand */}
      <mesh
        ref={minuteHandRef}
        position={[0, 0.8 + explodeOffset * 2.7, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.1, 0.08, 2.2]} />
        {getMaterial('minute-hand', '#2a2a2a')}
      </mesh>
      {showLabels && <Label text="Minute Hand" position={[0, 1.3 + explodeOffset * 2.7, 2.5]} />}

      {/* Second hand */}
      <mesh
        ref={secondHandRef}
        position={[0, 0.82 + explodeOffset * 2.8, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.06, 0.08, 2.4]} />
        {getMaterial('second-hand', '#ff3333')}
      </mesh>
      {showLabels && <Label text="Second Hand" position={[0, 1.4 + explodeOffset * 2.8, 2.7]} />}

      {/* Center pin */}
      <mesh position={[0, 0.85 + explodeOffset * 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Crystal (watch glass) */}
      <mesh position={[0, 1.2 + explodeOffset * 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.2, 3.2, 0.2, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          metalness={0}
          roughness={0}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      {showLabels && <Label text="Crystal" position={[0, 1.6 + explodeOffset * 3.5, 3.5]} />}
    </group>
  )
}
