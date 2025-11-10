"use client"

import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

const SignUpSchema = Yup.object({
  fullName: Yup.string().max(100, "Too Long").min(2, "Too Short").required("Required").matches(/^[\p{L}][\p{L}'\- ]*$/u, "Enter a valid name"),
  email: Yup.string().email("Please enter a valid email").required("Required"),
  phoneCode: Yup.mixed().oneOf(["+91"] as const),
  phone: Yup.string().min(10, "Please enter a valid phone number").required("Required").matches(/^\d{10}$/, "Enter a valid phone number"),
  password: Yup.string().min(8, "Minimum 8 characters").required("Required").test({
    name: "is-strong",
    test(value, ctx) {
      if (!/[A-Z]/.test(value)) return ctx.createError({ message: "Must include a uppercase letter" });
      if (!/[a-z]/.test(value)) return ctx.createError({ message: "Must include a lowercase letter" });
      if (!/\d/.test(value)) return ctx.createError({ message: "Must include a number" });
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return ctx.createError({ message: "Must include a special character" });
      return true;
    }
  })
})

interface FormFieldProps {
  name: string;
  label: string;
  children: React.ReactNode;
}

function FormField({ name, label, children }: FormFieldProps) {
  return (
    <label>
      <span className="text-xs font-bold ml-0.5">{label}</span><br />
      {children}<br/>
      <ErrorMessage name={name}>
        {msg => (
          <small>{msg}</small>
        )}
      </ErrorMessage>
    </label>
  )
}

export default function Auth() {
  return (
    <>
    <Link href="/" className="absolute top-5 left-5 text-lg font-bold font-display">
      <Image src="/weave-logo.svg" height={50} width={50} alt="Weave Logo" />
    </Link>
    <div className="flex justify-center items-center h-screen">
      <div className="border border-zinc-600 rounded-xl p-5">

      <div className="font-bold">
        Sign Up
      </div>
      <small>Enter your information to create your account.</small>
      <br />

      <Formik
        initialValues={{
          fullName: "",
          email: "",
          phoneCode: "+91",
          phone: "",
          password: ""
        }}
        validationSchema={SignUpSchema}
        onSubmit={values => {
          console.log(values)
          toast.success("Nothing happened", {
            duration: 4000,
            icon: "👏"
          })
        }}>
        {({ errors, touched, isSubmitting }) => (
          <Form className="flex flex-col gap-3">
            <FormField name="fullName" label="Full Name">
              <Field name="fullName" />
            </FormField>

            <FormField name="email" label="Email">
              <Field name="email" />
            </FormField>

            <label>
              <div className="flex w-full gap-2">
                <label className="flex flex-col flex-1 mb-1">
                  <span className="font-bold mb-1">Code</span>
                  <Field name="phoneCode" as="select">
                    <option value="+91">+91</option>
                  </Field>
                </label>

                <label className="flex flex-col w-full flex-3">
                  <span className="text-right font-bold mb-1">Phone</span>
                  <Field name="phone" className="w-full" />
                </label>
              </div>

              <ErrorMessage name="phone">
                {msg => (<small>{msg}</small>)}
              </ErrorMessage>
            </label>

            <FormField name="password" label="Password">
              <Field type="password" name="password" />
            </FormField>

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  </div>
  <Toaster toastOptions={{
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  }} />
  </>
  )
}
