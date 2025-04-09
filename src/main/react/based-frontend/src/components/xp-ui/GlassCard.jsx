export default function GlassCard({ children, className = "" }) {
  return (
    <div className={`backdrop-blur-md bg-white/10 dark:bg-black/90 border border-purple-400/60 dark:border-purple-400/60 rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  );
}


// This component creates a glass-like card with a blurred background and a white tint.  