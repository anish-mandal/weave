"use client"

import LinkButton from "@/components/link-button";
import Link from "next/link";
import Logo from "@/components/logo";

export default function Auth() {
  return (
    <>
      <Link href="/">
        <Logo height={50} width={50} className="absolute left-2 top-3" />
      </Link>
      <div className="grid place-content-center grid-flow-col min-h-screen gap-3">
        <LinkButton href="/auth/signup" className="text-2xl">Sign Up</LinkButton>
        <LinkButton href="/auth/login" className="text-2xl">Log In</LinkButton>
      </div>
    </>
  )
}
