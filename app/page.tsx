'use client'

import Link from "next/link";
import Image from "next/image";
import LinkButton from "@/components/LinkButton";

export default function Home() {
  return (
    <main className="m-5">
      <div className="flex gap-5">
        <h1 className="font-bold text-[clamp(3rem,15vw,12rem)] leading-none">weave</h1>
      </div>
      <hr/>
      <p className="font-display text-2xl mt-3">Connect. Create. Collaborate.{" "}
        <LinkButton icon={
            <Image src="/logo.svg" alt="Logo" width={30} height={30} />
          } href="/auth" className="">
          Start Weaving
        </LinkButton>
      </p>
    </main>
  );
}
