import { motion } from 'framer-motion'

const NODES = [
  { id: 'root',     cx: 300, cy: 55,  label: 'Input Data' },
  { id: 'classify', cx: 160, cy: 155, label: 'Classify' },
  { id: 'analyze',  cx: 440, cy: 155, label: 'Analyze' },
  { id: 'modela',   cx: 80,  cy: 265, label: 'Model A' },
  { id: 'modelb',   cx: 240, cy: 265, label: 'Model B' },
  { id: 'validate', cx: 360, cy: 265, label: 'Validate' },
  { id: 'deploy',   cx: 520, cy: 265, label: 'Deploy' },
  { id: 'output',   cx: 300, cy: 370, label: 'Insight' },
]

const EDGES = [
  ['root',     'classify'],
  ['root',     'analyze'],
  ['classify', 'modela'],
  ['classify', 'modelb'],
  ['analyze',  'validate'],
  ['analyze',  'deploy'],
  ['modela',   'output'],
  ['modelb',   'output'],
  ['validate', 'output'],
  ['deploy',   'output'],
]

function getNode(id) {
  return NODES.find(n => n.id === id)
}

const edgeVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: i => ({
    pathLength: 1,
    opacity: 0.5,
    transition: { delay: i * 0.07, duration: 0.7, ease: 'easeInOut' },
  }),
}

const nodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: i => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.06 + 0.25, type: 'spring', stiffness: 220, damping: 14 },
  }),
}

const ELECTRIC = '#64FFDA'
const NAVY_LIGHT = '#112240'
const SLATE = '#8892B0'

export function AlgorithmVisual() {
  return (
    <motion.svg
      viewBox="0 0 600 430"
      className="w-full max-w-lg"
      initial="hidden"
      animate="visible"
      aria-hidden="true"
    >
      {/* Subtle grid background */}
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(100,255,218,0.04)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="600" height="430" fill="url(#grid)" rx="8" />

      {/* Edges */}
      {EDGES.map(([from, to], i) => {
        const a = getNode(from)
        const b = getNode(to)
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={a.cx}
            y1={a.cy}
            x2={b.cx}
            y2={b.cy}
            stroke={ELECTRIC}
            strokeWidth="1.5"
            strokeLinecap="round"
            custom={i}
            variants={edgeVariants}
          />
        )
      })}

      {/* Nodes */}
      {NODES.map((node, i) => {
        const isTerminal = node.id === 'root' || node.id === 'output'
        return (
          <motion.g key={node.id} custom={i} variants={nodeVariants}>
            {/* Outer glow ring */}
            <circle cx={node.cx} cy={node.cy} r="26" fill="rgba(100,255,218,0.04)" />

            {/* Main circle */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r="18"
              fill={NAVY_LIGHT}
              stroke={ELECTRIC}
              strokeWidth={isTerminal ? 2 : 1.5}
            />

            {/* Center dot */}
            <circle cx={node.cx} cy={node.cy} r="3" fill={ELECTRIC} opacity="0.7" />

            {/* Label */}
            <text
              x={node.cx}
              y={node.cy + 34}
              textAnchor="middle"
              fill={SLATE}
              fontSize="9"
              fontFamily="Inter, system-ui, sans-serif"
              letterSpacing="0.5"
            >
              {node.label}
            </text>

            {/* Pulse ring for terminal nodes */}
            {isTerminal && (
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="18"
                fill="none"
                stroke={ELECTRIC}
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
                style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
              />
            )}
          </motion.g>
        )
      })}

      {/* Data flow particle (animated dot along edges) */}
      <motion.circle
        r="3"
        fill={ELECTRIC}
        opacity="0.8"
        initial={{ offsetDistance: '0%', opacity: 0 }}
        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1.5 }}
        style={{
          offsetPath: `path("M 300 55 L 160 155 L 300 370")`,
          offsetRotate: '0deg',
        }}
      />
    </motion.svg>
  )
}
