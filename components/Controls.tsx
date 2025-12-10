import { useState } from 'react'

interface ControlsProps {
  speed: number
  setSpeed: (speed: number) => void
  running: boolean
  setRunning: (running: boolean) => void
  exploded: number
  setExploded: (exploded: number) => void
  selectedPart: string | null
  setSelectedPart: (part: string | null) => void
  showLabels: boolean
  setShowLabels: (show: boolean) => void
  onHover: (part: string | null) => void
}

const parts = [
  { id: 'barrel', name: 'Mainspring Barrel', desc: 'Stores energy from winding' },
  { id: 'center-wheel', name: 'Center Wheel', desc: 'Drives minute hand, 1 rev/hour' },
  { id: 'third-wheel', name: 'Third Wheel', desc: 'Intermediary gear in train' },
  { id: 'fourth-wheel', name: 'Fourth Wheel', desc: 'Seconds wheel, 1 rev/minute' },
  { id: 'escape-wheel', name: 'Escape Wheel', desc: 'Regulates energy release' },
  { id: 'pallet-fork', name: 'Pallet Fork', desc: 'Locks/unlocks escape wheel' },
  { id: 'balance-wheel', name: 'Balance Wheel', desc: 'Oscillates at 300 BPH (5Hz)' },
  { id: 'hour-hand', name: 'Hour Hand', desc: 'Shows hours' },
  { id: 'minute-hand', name: 'Minute Hand', desc: 'Shows minutes' },
  { id: 'second-hand', name: 'Second Hand', desc: 'Shows seconds' },
  { id: 'dial', name: 'Dial', desc: 'Watch face' },
  { id: 'base', name: 'Base Plate', desc: 'Main mounting plate' },
]

export default function Controls({
  speed,
  setSpeed,
  running,
  setRunning,
  exploded,
  setExploded,
  selectedPart,
  setSelectedPart,
  showLabels,
  setShowLabels,
  onHover,
}: ControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <h1 style={styles.title}>3D Mechanical Watch</h1>
          <button
            style={styles.toggleButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {isExpanded && (
          <>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Animation</h3>
              <div style={styles.controlGroup}>
                <button
                  style={{...styles.button, ...(running ? styles.buttonActive : {})}}
                  onClick={() => setRunning(!running)}
                >
                  {running ? '⏸ Pause' : '▶ Play'}
                </button>
              </div>
              <div style={styles.controlGroup}>
                <label style={styles.label}>Speed: {speed.toFixed(1)}x</label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  style={styles.slider}
                />
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>View</h3>
              <div style={styles.controlGroup}>
                <label style={styles.label}>Explode: {exploded.toFixed(1)}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={exploded}
                  onChange={(e) => setExploded(parseFloat(e.target.value))}
                  style={styles.slider}
                />
              </div>
              <div style={styles.controlGroup}>
                <button
                  style={{...styles.button, ...(showLabels ? styles.buttonActive : {})}}
                  onClick={() => setShowLabels(!showLabels)}
                >
                  {showLabels ? '🏷 Labels On' : '🏷 Labels Off'}
                </button>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Components</h3>
              <div style={styles.partsList}>
                {parts.map((part) => (
                  <div
                    key={part.id}
                    style={{
                      ...styles.partItem,
                      ...(selectedPart === part.id ? styles.partItemSelected : {}),
                    }}
                    onClick={() => setSelectedPart(selectedPart === part.id ? null : part.id)}
                    onMouseEnter={() => onHover(part.id)}
                    onMouseLeave={() => onHover(null)}
                  >
                    <div style={styles.partName}>{part.name}</div>
                    <div style={styles.partDesc}>{part.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Camera Controls</h3>
              <div style={styles.info}>
                <div>• Rotate: Left click + drag</div>
                <div>• Pan: Right click + drag</div>
                <div>• Zoom: Scroll wheel</div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>About</h3>
              <div style={styles.info}>
                Realistic mechanical watch movement with authentic gear ratios and timing.
                The balance wheel oscillates at 300 beats per hour (5Hz), typical of
                mechanical watches. Energy flows from the mainspring barrel through the
                gear train to the escapement, which regulates the release of energy.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    zIndex: 1000,
  },
  panel: {
    pointerEvents: 'auto',
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '350px',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
    color: '#fff',
  },
  toggleButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  controlGroup: {
    marginBottom: '12px',
  },
  button: {
    width: '100%',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  buttonActive: {
    background: 'rgba(100, 150, 255, 0.3)',
    borderColor: 'rgba(100, 150, 255, 0.5)',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    color: '#ccc',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  partsList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  partItem: {
    padding: '10px',
    marginBottom: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  partItemSelected: {
    background: 'rgba(255, 255, 0, 0.2)',
    borderColor: 'rgba(255, 255, 0, 0.5)',
  },
  partName: {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '4px',
    color: '#fff',
  },
  partDesc: {
    fontSize: '11px',
    color: '#999',
  },
  info: {
    fontSize: '12px',
    lineHeight: '1.6',
    color: '#aaa',
  },
}
