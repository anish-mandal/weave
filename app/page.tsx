'use client'

import LinkButton from "@/components/link-button";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <main className="m-5">
      <div className="flex gap-5">
        <h1 className="font-bold text-[clamp(3rem,15vw,12rem)] leading-none font-display">weave</h1>
      </div>
      <hr/>
      <p className="font-display text-2xl mt-3">Connect. Create. Collaborate.{" "}
        <LinkButton icon={
            <Logo height={30} width={30} />
          } href="/auth/login" variant="outline">
          Start Weaving
        </LinkButton>
      </p>
    </main>
  );
}
