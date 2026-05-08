export default function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`fade-in${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}