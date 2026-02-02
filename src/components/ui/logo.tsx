export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="50" className="fill-primary" />
      <text
        x="50"
        y="70"
        textAnchor="middle"
        className="fill-primary-foreground"
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '70px',
          fontWeight: 400,
        }}
      >
        d
      </text>
    </svg>
  );
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="w-10 h-10" />
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-medium text-primary tracking-tight">dot</span>
        <span className="text-lg font-medium text-primary tracking-tight -mt-1">payments</span>
      </div>
    </div>
  );
}
