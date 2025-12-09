import Logo from "@/components/logo"
import Link from "next/link"

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Link href="/" className="fixed top-3 left-1"><Logo height={30} width={50}/></Link>
      {children}
    </>
  )
}
