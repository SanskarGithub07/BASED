export default function GlassCard({ children }) {
    return (
      <div className="backdrop-blur-md bg-white/10 border border-purple-400/30 rounded-2xl shadow-xl p-8 w-full max-w-md backdrop-saturate-200
">
        {children}
      </div>
    )
  }
  
// This component creates a glass-like card with a blurred background and a white tint.  