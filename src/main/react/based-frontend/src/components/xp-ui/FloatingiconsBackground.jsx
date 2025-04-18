import { BookIcon } from "lucide-react"
import { motion } from "framer-motion"

const randomFloatBooks = Array.from({ length: 50 }).map((_, i) => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${14 + Math.random() * 20}px`,
  blur: `${Math.random() * 2}px`,
  // Spiral animation parameters
  spiralRadius: `${10 + Math.random() * 15}px`,
  spiralSpeed: `${15 + Math.random() * 20}s`,
  rotationSpeed: `${20 + Math.random() * 40}s`,
  delay: Math.random() * 5,
  hue: Math.floor(Math.random() * 60) - 30, // -30 to +30 degree hue shift
}))

export default function FloatingIconsBackground() {
  return (
    <div className="absolute inset-0 min-h-screen pointer-events-none overflow-hidden">
      {randomFloatBooks.map((b, i) => (
        <motion.div
          key={i}
          className="absolute text-purple-500/50"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            filter: `blur(${b.blur})`,
            color: `hsl(${270 + b.hue}, 190%, 70%, 0.4)`,
          }}
          animate={{
            x: [0, b.spiralRadius, 0, -b.spiralRadius, 0],
            y: [0, b.spiralRadius, 0, -b.spiralRadius, 0],
            rotate: 360,
          }}
          transition={{
            x: {
              duration: parseFloat(b.spiralSpeed),
              repeat: Infinity,
              ease: "easeInOut",
              delay: b.delay
            },
            y: {
              duration: parseFloat(b.spiralSpeed),
              repeat: Infinity,
              ease: "easeInOut",
              delay: b.delay
            },
            rotate: {
              duration: parseFloat(b.rotationSpeed),
              repeat: Infinity,
              ease: "linear",
              delay: b.delay
            }
          }}
        >
          <BookIcon className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  )
}