'use client'

import Link from "next/link";
import { Button } from "./ui/button";

interface LinkButtonProps {
  href: string,
  children: React.ReactNode,
  className?: string,
  icon?: React.ReactNode | string,
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}

export default function LinkButton({ href, children, className = "", icon, variant }: LinkButtonProps) {
  return (
    <Link href={href} className={className}>
      {
          <Button variant={variant}>{icon ? icon : null} {children}</Button>
      }
    </Link>
  )
}
