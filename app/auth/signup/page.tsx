"use client"

import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import Logo from "@/components/Logo";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignUpSchema = Yup.object({
  fullName: Yup.string().max(100, "Too Long").min(2, "Too Short").required("Required").matches(/^[\p{L}][\p{L}'\- ]*$/u, "Enter a valid name"),
  email: Yup.string().email("Please enter a valid email").required("Required"),
  dateOfBirth: Yup.date().max(Date(), "Please enter a valid date of birth").required("Required"),
  phoneCode: Yup.mixed().oneOf(["+91"] as const),
  phoneNumber: Yup.string().min(10, "Please enter a valid phone number").required("Required").matches(/^\d{10}$/, "Please enter a valid phone number"),
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

async function signUpSubmit(values: Yup.InferType<typeof SignUpSchema>, router: ReturnType<typeof useRouter>) {
  return new Promise(async (resolve) => {
    try {
      const userName = values.fullName.split(" ").join(".")

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName: userName,
          fullName: values.fullName,
          email: values.email,
          dateOfBirth: new Date(values.dateOfBirth).toISOString(),
          phoneCode: values.phoneCode,
          phoneNumber: values.phoneNumber,
          password: values.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        resolve(null);
        return;
      }

      toast.success("Account created successfully!");
      router.replace("/auth/login");
      resolve(null);

    } catch (err) {
      toast.error("Something went wrong");
      resolve(null);
    }
  });
}


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
  const router = useRouter()

  return (
    <>

    <Link href="/">
      <Logo height={50} width={50} className="absolute left-2 top-3" />
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
          dateOfBirth: new Date(),
          phoneCode: "+91",
          phoneNumber: "",
          password: ""
        }}
        validationSchema={SignUpSchema}
        onSubmit={values => signUpSubmit(values, router)}>

        {({ isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-3">
            <FormField name="fullName" label="Full Name">
              <Field name="fullName" />
            </FormField>

            <FormField name="email" label="Email">
              <Field name="email" />
            </FormField>

            <FormField name="dateOfBirth" label="Date of Birth">
              <Field type="date" name="dateOfBirth" />
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
                  <Field name="phoneNumber" className="w-full" />
                </label>
              </div>

              <ErrorMessage name="phoneNumber">
                {msg => (<small>{msg}</small>)}
              </ErrorMessage>
            </label>

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
