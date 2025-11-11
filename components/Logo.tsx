'use client'

interface LogoProps {
  height: number;
  width: number;
  className?: string;
}

export default function Logo({ height, width, className = "" }: LogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 243 227" fill="none" xmlns="http://www.w3.org/2000/svg" className={`stroke-black dark:stroke-white ${className}`}>
      <path d="M11.757 22.0589C11.757 22.0589 347.743 201.059 122.476 201.059C-102.791 201.059 230.757 22.0589 230.757 22.0589" strokeWidth="50"/>
    </svg>
  );
}
