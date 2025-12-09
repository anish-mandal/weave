"use client"

import { Formik, Form } from "formik";
import Link from "next/link";
import { object, string } from "yup";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FieldError, FieldGroup, FieldLabel, Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";

const LoginSchema = object({
  email: string().email("Please enter a valid email").required("Required"),
  password: string().min(8, "Minimum 8 characters").required("Required")
})

async function loginUser(
  values: { email: string; password: string },
  router: ReturnType<typeof useRouter>
) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Login failed");
      return null;
    }

    router.push("/dashboard");
    return data;
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
    return null;
  }
}


export default function Auth() {
  const router = useRouter();

  return (
    <>
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
          </CardHeader>

        <CardContent>
          <Formik
            initialValues={{
              email: "",
              password: ""
            }}
            validationSchema={LoginSchema}
            onSubmit={values => loginUser(values, router)}>
            {({ isSubmitting, isValid, values, errors, touched, handleChange, handleBlur }) => (
              <Form className="flex flex-col gap-3">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      placeholder="m@example.com"
                      value={values.email}
                      type="email"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur} />
                    <FieldError>{touched.email && errors.email ? errors.email : null}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      id="password"
                      name="password"
                      value={values.password}
                      placeholder="Password"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur} />
                    <FieldError>{touched.password && errors.password ? errors.password : null}</FieldError>
                  </Field>

                  <FieldGroup>
                    <Field>
                      <Button type="submit" disabled={isSubmitting || !isValid}>Login</Button>
                    </Field>

                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <Link href="/auth/signup">Sign up</Link>
                    </FieldDescription>
                  </FieldGroup>
                </FieldGroup>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
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
