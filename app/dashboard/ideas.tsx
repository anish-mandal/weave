"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

type IGetIdeaBody = {
  _id: string,
  title: string,
  description: string,
  likes: number,
  status: "draft" | "published" | "archived",
  createdAt: string,
  updatedAt: string
}[]

export interface IGetIdea extends IResponse {
  body: IGetIdeaBody
}

function useIdeas() {
  const { data, error, isLoading } = useSWR<IGetIdea>("/api/me/ideas", fetcher<IGetIdea>);

  return {
    data: data?.body ?? [],
    error,
    isLoading,
  }
}


export default function Ideas() {
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
      <div className="grid gap-2 mb-20">
        {ideas.map((ele, index) => (
          <Card key={index} className="max-w-6xl bg-transparent">
            <CardHeader>
              <CardTitle className="flex w-full justify-between">

                <span className="text-sm"> Updated {" "}
                  <time dateTime={new Date(ele.updatedAt).toISOString()}>{formatDistanceToNow(ele.updatedAt, { addSuffix: true })}</time>
                </span>
                <span className="text-right">
                  {ele.status == "published" ? (
                    <Badge variant="default" className="bg-green-300"><CheckCircle />{ele.status}</Badge>
                  ) : (
                    <Badge variant="outline">{ele.status}</Badge>
                  )}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <CardTitle>
                <Button variant="link" className="sm:text-2xl text-md" onClick={() => {
                  setIndex(index);
                  setOpen(true);
                }}>{ele.title}</Button>
              </CardTitle>
            </CardContent>

            {/** Maybe in Future
          <CardFooter>
            <p className="flex flex-row gap-2"><ThumbsUp /> {ele.likes}</p>
          </CardFooter>
          */}
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
