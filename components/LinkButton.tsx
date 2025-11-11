'use client'

import Link from "next/link";

interface LinkButtonProps {
  href: string,
  children: React.ReactNode,
  className?: string,
  icon?: React.ReactNode | string
}

export default function LinkButton({ href, children, className = "", icon }: LinkButtonProps) {
  return (
    <Link href={href} className={
      `${icon ? "inline-flex gap-2" : null} border border-zinc-700 rounded-2xl dark:bg-neutral-800 cursor-pointer px-2 py-2 transition-all hover:rounded-lg ${className}`
    }>
      {
        icon ? (
          <>{icon} {children}</>
        ) : children
      }
    </Link>
  )
}
