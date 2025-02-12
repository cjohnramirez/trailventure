"use client";
import { useState } from "react";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

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
import { loginSchema, registerSchema } from "@/lib/Form/loginRegisterSchema";
import { loginRegisterFields } from "@/lib/Form/loginRegisterFields";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginPageImage from "../../assets/LoginPage.jpg";

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

    try {
      const res = await api.post(
        route,
        isLogin
          ? { username: values.username, password: values.password }
          : values,
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full md:h-screen max-w-[800px] items-center p-4 md:flex md:max-h-[700px]">
        <div className="hidden md:block h-full w-1/2">
          <img
            src={LoginPageImage}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
        <div className="md:w-1/2">
          <div className="flex h-full flex-col justify-center">
            <CardHeader className="px-8">
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
            <CardContent className="scrollbar flex flex-col gap-y-2 md:overflow-auto px-8">
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
