export default function Logo({ size = 26, className = '', mode = 'auto' }) {
  const getPageFill = () => {
    if (mode === 'light') return '#1C1917'
    if (mode === 'dark') return '#F5F5F4'
    return 'currentColor'
  }

  // Aspect ratio of the book mark: 376 / 236 ≈ 1.59
  const width = Math.round(size * (376 / 236))

  return (
    <svg
      width={width}
      height={size}
      viewBox="68 144 376 236"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bible logo"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Left Page */}
      <path
        d="M 86 170 C 134 154, 192 160, 244 176 L 244 336 C 192 320, 134 314, 86 330 C 78 332, 76 326, 76 318 L 76 182 C 76 174, 78 168, 86 170 Z"
        fill={getPageFill()}
      />
      
      {/* Right Page */}
      <path
        d="M 268 176 C 320 160, 378 154, 426 170 C 434 168, 436 174, 436 182 L 436 318 C 436 326, 434 332, 426 330 C 378 314, 320 320, 268 336 Z"
        fill={getPageFill()}
      />
      
      {/* Bookmark Ribbon */}
      <path
        d="M 250 150 L 262 150 L 262 372 L 256 362 L 250 372 Z"
        fill="var(--craft-orange, #E54F10)"
      />
    </svg>
  )
}
