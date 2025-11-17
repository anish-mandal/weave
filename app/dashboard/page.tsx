"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type IResponse from "@/types/response";

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface ApiResponse extends IResponse {
  body: { user: User }
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url);

  if (res.status === 401) {
    const error = new Error("Unauthorized");
    (error as any).status = 401;
    throw error;
  }

  return res.json();
};

export default function Dashboard() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR("/api/me", fetcher, {
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (error && (error as any).status === 401) {
      router.push("/auth/login");
    }
  }, [error, router]);

  if (isLoading) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Something went wrong.</div>;
  }

  const user: User = data?.body?.user!;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-5 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {user.fullName}
        </h2>
        <p>Email: {user.email}</p>
        <p>User ID: {user.id}</p>
      </div>

      <br />

      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/auth/logout");

          if (!res.ok) {
            console.error("Logout failed");
            return;
          }

          router.push("/auth/login");
          } catch (err) {
          console.error("Logout error:", err);
          }
          }}
          className="hover:bg-red-400"
        >Logout</button>

    </div>
  );
}

