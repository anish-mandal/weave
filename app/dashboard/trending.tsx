"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerTitle, DrawerHeader } from "@/components/ui/drawer"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns";
import useSWR from "swr";
import fetcher from "./fetcher";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Lightbulb } from "lucide-react";
import IResponse from "@/types/response";
import { Item, ItemTitle, ItemContent, ItemDescription, ItemMedia } from "@/components/ui/item";
import Avatar from "boring-avatars";

type IGetIdeaBody = {
  _id: string,
  title: string,
  description: string,
  likes: number,
  author: {
    fullName: string,
    userName: string,
    email: string
  }
  status: "draft" | "published" | "archived",
  createdAt: string,
  updatedAt: string
}[]

export interface IGetIdea extends IResponse {
  body: IGetIdeaBody
}

function useIdeas() {
  const { data, error, isLoading } = useSWR<IGetIdea>("/api/ideas", fetcher<IGetIdea>);

  return {
    data: data?.body ?? [],
    error,
    isLoading,
  }
}


export default function Trending() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { data: ideas, error, isLoading } = useIdeas();

  if (isLoading)
    return "Loading!"

  if (error)
    return error

  if (!ideas || ideas.length === 0) {
    return (
      <>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lightbulb />
            </EmptyMedia>

            <EmptyTitle>No Ideas posted yet</EmptyTitle>
            <EmptyDescription>Create new Ideas using the above fields.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </>
    )
  }

  return (
    <>
      <div className="grid gap-2">
        {ideas.map((ele, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <Item className="p-0">
                <ItemMedia>
                  <Avatar name={ele.author.fullName} />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle>
                    {ele.author.fullName}
                  </ItemTitle>
                  <ItemContent>
                    {ele.author.email}
                  </ItemContent>
                </ItemContent>
              </Item>
            </CardHeader>

            <CardContent>
              <CardTitle className="truncate">
                <Button variant="link" className="sm:text-xl text-md" onClick={() => {
                  setIndex(index);
                  setOpen(true);
                }}>{ele.title}</Button>
              </CardTitle>
            </CardContent>
          </Card>
        ))}

      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="max-w-sm w-full mx-auto">
            <DrawerHeader>
              <DrawerTitle>{ideas[index].title}</DrawerTitle>
            </DrawerHeader>

            <p className="pb-10">
              {ideas[index].description}
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
