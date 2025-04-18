import { BookIcon } from "lucide-react"

const randomFloatBooks = Array.from({ length: 25 }).map((_, i) => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${14 + Math.random() * 20}px`,
//   opacity: `0.${Math.floor(Math.random() * 3) + 1}`, // 0.1 - 0.3
  blur: `${Math.random() * 2}px`,
  x: `${Math.random() * 60 - 30}px`,
  y: `${Math.random() * 60 - 30}px`,
  r: `${Math.random() * 60 - 30}deg`,
  duration: `${15 + Math.random() * 10}s`,
}))

export default function FloatingIconsBackground() {
  return (
    <div className="absolute inset-0 min-h-screen pointer-events-none overflow-hidden">
      {randomFloatBooks.map((b, i) => (
        <BookIcon
          key={i}
          className="absolute float-random text-purple-500/50"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            filter: `blur(${b.blur})`,
            "--x": b.x,
            "--y": b.y,
            "--r": b.r,
            "--duration": b.duration,
          }}
        />
      ))}
    </div>
  )
}
