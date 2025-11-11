"use client"

import Link from "next/link";
import Image from "next/image";
import LinkButton from "@/components/LinkButton";

export default function Auth() {
  return (
    <>
      <Link href="/" className="absolute top-5 left-5 text-lg font-bold font-display">
        <Image src="/logo.svg" height={50} width={50} alt="Logo" />
      </Link>

      <div className="grid place-content-center grid-flow-col min-h-screen gap-3">
        <LinkButton href="/auth/signup" className="text-2xl">Sign Up</LinkButton>
        <LinkButton href="/auth/login" className="text-2xl">Log In</LinkButton>
      </div>
    </>
  )
}
