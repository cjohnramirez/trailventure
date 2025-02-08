"use client";
import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, registerSchema } from "@/lib/loginRegisterSchema";
import { loginRegisterFields } from "@/lib/loginRegisterFields";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginPageImage from "../assets/LoginPage.jpg";
import { ModeToggle } from "./mode-toggle";

function HomeForm({ route, method }: { route: string; method: string }) {
  const [_loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const isLogin = method === "login";
  const name = isLogin ? "Login" : "Register";

  const formSchema = name === "Login" ? loginSchema : registerSchema;

  const form = isLogin
    ? useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
        },
      })
    : useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          passwordConfirm: "",
        },
      });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("handleSubmit triggered");
    setLoading(true);

    if ("passwordConfirm" in values) {
      const { passwordConfirm, ...filteredValues } = values;
      values = { ...filteredValues };
    }

    console.log({ values });

    try {
      const res = await api.post(
        route,
        isLogin
          ? { username: values.username, password: values.password }
          : values
      );
      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  const formFields = isLogin
    ? loginRegisterFields.login
    : loginRegisterFields.register;

  return (
    <div className="flex h-screen items-center justify-center w-full p-4">
      <Card className="flex h-full items-center p-4">
        <div className="h-full w-1/2 p-4">
          <img
            src={LoginPageImage}
            className="h-full rounded-xl object-cover"
          />
        </div>
        <div className="grid h-full grid-rows-[1fr_80%_1fr] py-4 pr-4 w-1/2">
          <div className="flex justify-end">
            <ModeToggle />
          </div>
          <div className="flex h-full flex-col justify-center">
            <CardHeader>
              <CardTitle>
                {isLogin ? "Login to Proceed" : "Create an Account"}
              </CardTitle>
              <CardDescription>
                {isLogin ? (
                  <div>
                    Don't have an account?&nbsp;
                    <Link to="/register" className="underline">
                      Register
                    </Link>
                  </div>
                ) : (
                  <div>
                    Do you have an existing account?&nbsp;
                    <Link to="/login" className="underline">
                      Login
                    </Link>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                    console.log("Form validation errors: ", errors);
                  })}
                  className="flex-row"
                >
                  {formFields.map((field) => {
                    if (
                      isLogin &&
                      (field.name === "first_name" ||
                        field.name === "last_name" ||
                        field.name === "passwordConfirm")
                    ) {
                      return null;
                    }
                    return (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={
                          field.name as
                            | "password"
                            | "username"
                            | "first_name"
                            | "last_name"
                            | "email"
                            | "passwordConfirm"
                        }
                        render={({ field: formField }) => (
                          <FormItem className="pb-4">
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={field.placeholder}
                                type={field.type}
                                {...formField}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    );
                  })}
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default HomeForm;
