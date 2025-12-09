"use client";

import { Item, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle, ItemFooter } from "@/components/ui/item";
import Avatar from "boring-avatars";

const builder = [
  {
    name: "Anish Mandal",
    email: "anish@example.com",
    description: "This is about Anish Mandal.",
  },
  {
    name: "Antriksh Singh Jagwan",
    email: "antriksh@example.com",
    description: "This is about Antriksh."
  }
]

export default function SuggestedBuilder() {
  return (
    <div className="flex flex-col gap-3">
      {builder.map((ele, index) => (
        <div key={index}>
          <Item variant="outline">
            <ItemMedia>
              <Avatar name={ele.name} />
            </ItemMedia>

            <ItemContent>
              <ItemTitle>
                {ele.name}
              </ItemTitle>
              <ItemDescription>
                {ele.email}
              </ItemDescription>
            </ItemContent>

            <ItemFooter>
              <ItemDescription>
                {ele.description}
              </ItemDescription>
            </ItemFooter>
          </Item>
        </div>
      ))}
    </div>
  )
}
