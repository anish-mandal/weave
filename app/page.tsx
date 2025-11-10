import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="m-5">
      <div className="flex gap-5">
        <Image src="/weave-logo.svg" alt="Weave Logo" width={150} height={100} className="" />
        <h1 className="font-bold text-[clamp(3rem,15vw,12rem)] leading-none">weave</h1>
      </div>
      <hr/>
      <p className="font-display text-2xl mt-3">Connect. Create. Collaborate.{" "}
        <Link href="/auth"><button className="text-2xl">Sign Up</button></Link>
      </p>
    </div>
  );
}
