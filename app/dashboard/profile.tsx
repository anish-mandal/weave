import Avatar from "boring-avatars"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSWR from "swr"
import IResponse from "@/types/response";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "./fetcher";

interface ILogOut extends IResponse {
  body: {}
}

function useLogOut(toLogOut: boolean) {
  const {data, error, isLoading} = useSWR<ILogOut>(toLogOut ? "/api/auth/logout" : null, fetcher<ILogOut>);
  const isSuccess = data?.type === "success" ? true : false;

  return {
    error,
    isLoading,
    isSuccess
  }
}

export default function Profile() {
  const [toLogOut, setToLogOut] = useState<boolean>(false);
  const router = useRouter();
  const { error, isLoading, isSuccess } = useLogOut(toLogOut);

  useEffect(() => {
    if (error) {
      return
    }

    if (!isLoading && isSuccess) {
      router.replace("/")
    }
  }, [router, isSuccess, error, isLoading])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar name="anish-mandal" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-destructive hover:bg-destructive" onClick={() => setToLogOut(true)}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
