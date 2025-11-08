import Link from "next/link";

export default function Home() {
  return (<div className="m-5">
    <h1 className="font-bold text-[clamp(3rem,15vw,12rem)] leading-none">weave</h1>
    <hr/>
    <p className="font-display text-2xl mt-3">Connect. Create. Collaborate. <Link href="/auth"><button className="border border-b-white px-3 rounded-full cursor-pointer">Sign Up</button></Link>
</p>
    </div>);
}
