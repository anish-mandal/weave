"use client";

import Logo from "@/components/logo";
import Link from "next/link";
import Ideas from "./ideas";
import IdeaInput from "./input";
import Profile from "./profile";
import { Separator } from "@/components/ui/separator";
import useSWR from "swr";
import Response from "@/types/response"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Trending from "./trending";
import SuggestedBuilder from "./suggested-builder";
import { TrendingUp } from "lucide-react";

interface IGetUser extends Response {
  body: {
    user: {
      userName: string,
      fullName: string,
      email: string
    }
  }
}

function useUser() {
  const fetcher = (url: string) => fetch(url).then(res => res.json() as Promise<IGetUser>);
  const { data, error, isLoading } = useSWR<IGetUser>("/api/me", fetcher);
  const isLoggedIn = data?.type === "success" ? true : false;

  return {
    data,
    error,
    isLoading,
    isLoggedIn
  }
}

export default function Dashboard() {
  const router = useRouter();
  const { error, isLoading, isLoggedIn } = useUser();

  useEffect(() => {
    if (error) {
      return
    }

    if (!isLoading && !isLoggedIn) {
      router.replace("/auth/login")
    }
  }, [isLoading, isLoggedIn, router])

  if (isLoading)
    return (
      <>Loading!</>
    )

  return (
    <div>
      <menu className="fixed w-screen border-b px-5 py-3 top-0 flex justify-between items-center bg-background z-50">
        <Link href="/dashboard">
          <Logo height={30} width={30} />
        </Link>
        <Profile />
      </menu>
      <div className="max-w-4xl mx-auto flex flex-col justify-center p-2 gap-5">
        <IdeaInput />
        <Separator className="my-4" />

      </div>
      <div className="flex justify-center gap-5 mx-auto mb-20">
        <div className="flex flex-col gap-2 max-w-sm">
          <h1 className="font-bold text-xl">Your Ideas</h1>
          <Ideas />
        </div>
        <div className="flex flex-col gap-3 outline p-5 rounded-xl shadow-lg shadow-neutral-900">
          <h1 className="flex text-xl font-bold gap-3">Trending Ideas <TrendingUp /></h1>
          <Trending />
        </div>
        <SuggestedBuilder />
      </div>
    </div>
  );
}

