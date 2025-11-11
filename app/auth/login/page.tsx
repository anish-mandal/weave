"use client"

import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

const LoginSchema = Yup.object({
  email: Yup.string().email("Please enter a valid email").required("Required"),
  password: Yup.string().min(8, "Minimum 8 characters").required("Required")
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
      <Image src="/logo.svg" height={50} width={50} alt="Logo" />
    </Link>
    <div className="flex justify-center items-center h-screen">
      <div className="border border-zinc-600 rounded-xl p-5">

      <div className="font-bold">
        Log In
      </div>
      <small>Enter your account information to login.</small>
      <br />

      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        validationSchema={LoginSchema}
        onSubmit={values => {

          return new Promise((resolve, _) => {
            console.log(values)
            toast('Nothing Happened',
              {
                icon: '👏',
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              }
            );
            resolve(null)
          })

        }}>
        {({ isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-3">
            <FormField name="email" label="Email">
              <Field name="email" />
            </FormField>


            <FormField name="password" label="Password">
              <Field type="password" name="password" />
            </FormField>

            <button type="submit" disabled={isSubmitting || !isValid}>
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
