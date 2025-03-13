import { useState } from "react";
import api from "../../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, registerSchema } from "@/lib/Form/loginRegisterSchema";
import { loginRegisterFields } from "@/lib/Form/loginRegisterFields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginPageImage from "@/assets/Form/LoginPage.jpg";
import useConfirmationStore from "../../Contexts/ConfirmationStore";

function HomeForm({ route, method }: { route: string; method: string }) {
  const [_loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { openConfirmation } = useConfirmationStore();

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
    if ("passwordConfirm" in values) {
      const { passwordConfirm, ...filteredValues } = values as {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        passwordConfirm: string;
        role?: string;
      };
      filteredValues.role = "customer";

      values = { ...filteredValues };
    }

    try {
      const res = await api.post(
        route,
        isLogin ? { username: values.username, password: values.password } : values,
      );

      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        openConfirmation({
          title: "Login Successful!",
          description: "Redirecting to homepage...",
          cancelLabel: "Go immediately!",
          actionLabel: "Delete",
          onAction: () => {},
          onCancel: () => {},
        });
      } else {
        navigate("/login");
      }
    } catch (error) {
      openConfirmation({
        title: "Login Failed",
        description: "Incorrect username or password",
        cancelLabel: "Cancel",
        actionLabel: "Go to Home",
        onAction: () => {
          navigate("/");
        },
        onCancel: () => {},
      });
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  const formFields = isLogin ? loginRegisterFields.login : loginRegisterFields.register;

  return (
    <div className="flex h-dvh items-center justify-center p-4">
      <div className="flex h-full max-h-[900px] w-full max-w-[800px] items-center justify-center">
        <Card className="h-full w-full items-center p-4 md:flex">
          <div
            className={`md:h-full md:w-1/2 ${isLogin ? "h-2/5 sm:h-1/2" : "h-1/6 pb-8 md:pb-0"}`}
          >
            <img src={LoginPageImage} className="h-full w-full rounded-lg object-cover" />
          </div>
          <div className={`md:h-full md:w-1/2 ${isLogin ? "h-3/5 sm:h-1/2" : "h-5/6"}`}>
            <div className="flex h-full flex-col justify-center">
              <CardHeader className="px-8 text-center">
                <CardTitle>{isLogin ? "Login to Proceed" : "Create an Account"}</CardTitle>
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
              <CardContent className="scrollbar mb-10 flex flex-col gap-y-2 px-8 pb-10 md:overflow-auto">
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
                    <div className="flex w-full justify-between">
                      <Button type="submit" variant={"outline"}>
                        {isLogin ? "Login" : "Register"}
                      </Button>
                      <Button variant={"outline"} onClick={() => navigate("/")}>
                        Go to Home
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default HomeForm;
