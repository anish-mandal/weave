"use client"

import { Formik, Form } from "formik";
import Link from "next/link";
import Logo from "@/components/Logo";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";

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

      router.replace("/auth/login");
      resolve(null);
    } catch (err) {
      toast.error("Something went wrong");
      resolve(null);
    }
  });
}

export default function Auth() {
  const router = useRouter()

  return (
    <>
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">

       <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
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

            {({ isSubmitting, isValid, handleChange, handleBlur, values, errors, touched }) => (
              <Form>
                <FieldGroup>

                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fullName} />
                    <FieldError>
                      {touched.fullName && errors.fullName ? errors.fullName : null}
                    </FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="m@example.com"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email} />
                    <FieldError>
                      {touched.email && errors.email ? errors.email : null}
                    </FieldError>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.dateOfBirth.toLocaleString()} />
                    <FieldError>
                      {touched.dateOfBirth && errors.dateOfBirth ? (<>{errors.dateOfBirth}</>) : ""}
                    </FieldError>
                  </Field>

                  <FieldGroup className="grid grid-cols-3 gap-4">
                    <Field>
                      <FieldLabel>Code</FieldLabel>
                      <Select value={values.phoneCode}>
                        <SelectTrigger>
                          <SelectValue placeholder="+91" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+91">+91</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field className="col-span-2">
                      <FieldLabel htmlFor="phone">Number</FieldLabel>
                      <Input
                        type="tel"
                        id="phone"
                        placeholder="9876543210"
                        name="phoneNumber"
                        onChange={handleChange}
                        required
                        onBlur={handleBlur}
                        value={values.phoneNumber} />
                      <FieldError className="col-span-full">
                        {touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : null}
                      </FieldError>
                    </Field>

                  </FieldGroup>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      id="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required />

                    <FieldError>
                      {touched.password && errors.password ? errors.password : null}
                    </FieldError>
                  </Field>

                  <FieldGroup>
                    <Button type="submit" disabled={isSubmitting || !isValid}>Submit</Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <Link href="/auth/login">Log In</Link>
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
  <Toaster toastOptions={{ style: { borderRadius: '10px', background: '#333', color: '#fff', }, }} />
  </>
  )
}
