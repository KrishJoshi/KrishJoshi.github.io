import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  color: string;
  icon?: string;
}

interface Connection {
  from: string;
  to: string;
  color: string;
  dashed?: boolean;
}

interface Architecture {
  name: string;
  nodes: Node[];
  connections: Connection[];
}

const architectures: Architecture[] = [
  {
    name: "AWS Serverless (Climatise)",
    nodes: [
      { id: 'cf', label: 'CloudFront', x: 50, y: 15, color: '#6366f1' },
      { id: 'apigw', label: 'API Gateway', x: 50, y: 30, color: '#6366f1' },
      { id: 'lambda', label: 'Lambda', sublabel: 'Node.js', x: 30, y: 50, color: '#10b981' },
      { id: 'bedrock', label: 'Bedrock', sublabel: 'Claude AI', x: 70, y: 50, color: '#f59e0b', icon: 'dashed' },
      { id: 'dynamo', label: 'DynamoDB', x: 50, y: 75, color: '#a855f7' },
    ],
    connections: [
      { from: 'cf', to: 'apigw', color: '#6366f1' },
      { from: 'apigw', to: 'lambda', color: '#10b981' },
      { from: 'apigw', to: 'bedrock', color: '#f59e0b', dashed: true },
      { from: 'lambda', to: 'dynamo', color: '#a855f7' },
      { from: 'bedrock', to: 'dynamo', color: '#a855f7' },
    ]
  },
  {
    name: "Kubernetes Microservices (Tesco)",
    nodes: [
      { id: 'lb', label: 'Load Balancer', x: 50, y: 15, color: '#10b981' },
      { id: 'eks', label: 'EKS Cluster', x: 50, y: 30, color: '#10b981' },
      { id: 'auth', label: 'Auth Pod', sublabel: 'React SSR', x: 20, y: 55, color: '#6366f1' },
      { id: 'account', label: 'Account', sublabel: 'Node.js', x: 50, y: 55, color: '#6366f1' },
      { id: 'profile', label: 'Profile', sublabel: 'TypeScript', x: 80, y: 55, color: '#6366f1' },
      { id: 'postgres', label: 'PostgreSQL', x: 50, y: 80, color: '#a855f7' },
    ],
    connections: [
      { from: 'lb', to: 'eks', color: '#10b981' },
      { from: 'eks', to: 'auth', color: '#6366f1' },
      { from: 'eks', to: 'account', color: '#6366f1' },
      { from: 'eks', to: 'profile', color: '#6366f1' },
      { from: 'auth', to: 'postgres', color: '#a855f7' },
      { from: 'account', to: 'postgres', color: '#a855f7' },
      { from: 'profile', to: 'postgres', color: '#a855f7' },
    ]
  },
  {
    name: "FAPI Banking Stack (CaspianOne)",
    nodes: [
      { id: 'fapi', label: 'FAPI 2.0 Gateway', x: 50, y: 15, color: '#f59e0b' },
      { id: 'oauth', label: 'OAuth2 / OIDC', x: 50, y: 30, color: '#f59e0b' },
      { id: 'authlambda', label: 'Auth λ', sublabel: 'TypeScript', x: 30, y: 50, color: '#10b981' },
      { id: 'banklambda', label: 'Banking λ', sublabel: 'Node.js', x: 70, y: 50, color: '#10b981' },
      { id: 'aurora', label: 'Aurora', x: 35, y: 75, color: '#a855f7' },
      { id: 'redis', label: 'Redis', x: 65, y: 75, color: '#ef4444' },
    ],
    connections: [
      { from: 'fapi', to: 'oauth', color: '#f59e0b' },
      { from: 'oauth', to: 'authlambda', color: '#10b981' },
      { from: 'oauth', to: 'banklambda', color: '#10b981' },
      { from: 'authlambda', to: 'aurora', color: '#a855f7' },
      { from: 'banklambda', to: 'redis', color: '#ef4444' },
    ]
  },
  {
    name: "Full-Stack Platform (Cisco/Chase)",
    nodes: [
      { id: 'react', label: 'React App', x: 50, y: 15, color: '#06b6d4' },
      { id: 'nextjs', label: 'Next.js SSR', x: 30, y: 35, color: '#06b6d4' },
      { id: 'rn', label: 'React Native', x: 70, y: 35, color: '#06b6d4' },
      { id: 'express', label: 'Express API', x: 50, y: 50, color: '#8b5cf6' },
      { id: 'mongo', label: 'MongoDB', x: 35, y: 70, color: '#a855f7' },
      { id: 'pg', label: 'PostgreSQL', x: 65, y: 70, color: '#10b981' },
    ],
    connections: [
      { from: 'react', to: 'nextjs', color: '#06b6d4' },
      { from: 'react', to: 'rn', color: '#06b6d4' },
      { from: 'nextjs', to: 'express', color: '#8b5cf6' },
      { from: 'rn', to: 'express', color: '#8b5cf6' },
      { from: 'express', to: 'mongo', color: '#a855f7' },
      { from: 'express', to: 'pg', color: '#10b981' },
    ]
  }
];

function getNodePosition(nodeId: string, arch: Architecture) {
  const node = arch.nodes.find(n => n.id === nodeId);
  return node ? { x: node.x, y: node.y } : { x: 50, y: 50 };
}

export default function ArchitectureDiagram() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentArch = architectures[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % architectures.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl h-[340px] overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg className="w-full h-full" viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="400" height="340" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Architecture Name - morphing text */}
      <div className="absolute top-4 left-4 z-20">
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentArch.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-[10px] font-mono text-slate-400"
            >
              {currentArch.name}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* SVG Container for Connections */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connections that morph */}
        {currentArch.connections.map((conn, i) => {
          const from = getNodePosition(conn.from, currentArch);
          const to = getNodePosition(conn.to, currentArch);

          return (
            <motion.line
              key={`conn-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={conn.color}
              strokeWidth="0.3"
              strokeDasharray={conn.dashed ? "1,1" : "0"}
              initial={false}
              animate={{
                x1: from.x,
                y1: from.y,
                x2: to.x,
                y2: to.y,
                stroke: conn.color,
                opacity: 0.5
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          );
        })}

        {/* Animated Particles */}
        <g filter="url(#glow)">
          {currentArch.connections.slice(0, 3).map((conn, i) => {
            const from = getNodePosition(conn.from, currentArch);
            const to = getNodePosition(conn.to, currentArch);

            return (
              <motion.circle
                key={`particle-${i}`}
                r="0.4"
                fill={conn.color}
                initial={false}
                animate={{
                  cx: [from.x, to.x, from.x],
                  cy: [from.y, to.y, from.y],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* Nodes - morphing positions and text */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {currentArch.nodes.map((node, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute"
            initial={false}
            animate={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div
              className={`px-3 py-2 rounded-lg backdrop-blur-sm border ${
                node.icon === 'dashed' ? 'border-dashed' : ''
              } hover:scale-105 transition-transform cursor-pointer`}
              style={{
                backgroundColor: `${node.color}20`,
                borderColor: `${node.color}80`,
                minWidth: node.sublabel ? '72px' : '60px'
              }}
            >
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${node.id}-label`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="text-[10px] font-mono font-semibold whitespace-nowrap"
                      style={{ color: node.color }}
                    >
                      {node.label}
                    </div>
                    {node.sublabel && (
                      <div
                        className="text-[7px] font-mono mt-0.5 whitespace-nowrap"
                        style={{ color: `${node.color}b3` }}
                      >
                        {node.sublabel}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
