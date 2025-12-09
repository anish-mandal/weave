"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function PasswordInput(props: React.ComponentPropsWithoutRef<typeof InputGroupInput>) {
  const [hidden, setHidden] = useState(true);

  return (
      <InputGroup>
        <InputGroupInput type={hidden ? "password" : "text"} {...props}/>
        <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary" size="icon-xs" onClick={() => setHidden(!hidden)}>
              {hidden ? (<EyeOff />) : (<Eye />)}
            </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
  )
}

