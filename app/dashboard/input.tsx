"use client"

import { Field, FieldGroup } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea
} from "@/components/ui/input-group"
import { ArrowRight } from "lucide-react"
import { Formik } from "formik"
import { object, string } from "yup"

interface IIdeas {
  title: string,
  description: string
}

const ideaCreationSchema = object<IIdeas>({
  title: string().required("Title is required"),
  description: string().required("Description is required")
})

export default function IdeaInput() {
  return (
    <div className="mt-44">
      <h1 className="text-center text-2xl font-extrabold tracking-tight text-balance mb-5 sm:text-4xl">
        What do you want to create?
      </h1>
      <Formik initialValues={{ title: "", description: "" }} validationSchema={ideaCreationSchema} onSubmit={() => {}}>
      {({ values, errors, touched, handleBlur, handleChange }) => (
        <FieldGroup className="gap-2">
          <Field>
            <InputGroup>
              <InputGroupInput
                name="title"
                required
                placeholder="Enter a short, catchy title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur} />
            </InputGroup>
          </Field>

          <Field>
            <InputGroup>
              <InputGroupTextarea
                name="description"
                required
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe your idea briefly"
                className={`${ values.description.length > 200 ? "min-h-52" : null} bg-transparent transition-all`} />

              <InputGroupAddon align="block-end">
                <InputGroupButton variant="default" className="rounded-full ml-auto" size="icon-sm"><ArrowRight /></InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      )}
      </Formik>
    </div>
  )
}

