import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, registerSchema } from "@/lib/Form/loginRegisterSchema";
import { loginRegisterFields } from "@/lib/Form/loginRegisterFields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FormPageImage from "@/assets/Form/FormPage.webp";
import useConfirmationStore from "../../Contexts/ConfirmationStore";
import useAuthMutation from "@/hooks/tanstack/auth/useMutationAuth";
import { useState } from "react";

function HomeForm({ method }: { route: string; method: string }) {
  const { openConfirmation } = useConfirmationStore();
  const [pending, setPending] = useState(false);

  const isLogin = method === "login";
  const formSchema = isLogin ? loginSchema : registerSchema;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: isLogin
      ? { username: "", email: "", password: "" }
      : {
          username: "",
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          passwordConfirm: "",
        },
  });

  const navigate = useNavigate();
  const authMutation = useAuthMutation(isLogin, navigate, openConfirmation);

  const handleSubmit = (values: any) => {
    console.log(values);
    authMutation.mutate(values);
    setPending(authMutation.isPending);
  };

  const formFields = isLogin ? loginRegisterFields.login : loginRegisterFields.register;

  return (
    <div className="flex h-dvh items-center justify-center p-4">
      <div className="flex h-full max-h-[900px] w-full max-w-[800px] items-center justify-center">
        <Card
          className={`h-full w-full items-center p-4 md:flex ${isLogin ? "h-full" : "h-auto md:h-full"}`}
        >
          <div className={`md:h-full md:w-1/2 ${isLogin ? "h-2/5 sm:h-1/2" : ""}`}>
            <img
              src={FormPageImage}
              className={`h-4/5 w-full rounded-lg object-cover sm:h-full ${isLogin ? "" : "hidden md:block"}`}
            />
          </div>
          <div className={`md:h-full md:w-1/2 ${isLogin ? "h-3/5 sm:h-1/2" : ""}`}>
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
              <CardContent className="scrollbar flex flex-col gap-y-2 px-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-row">
                    {formFields.map((field) =>
                      isLogin &&
                      ["first_name", "last_name", "passwordConfirm"].includes(field.name) ? null : (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={
                            field.name as
                              | "username"
                              | "password"
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
                      ),
                    )}
                    <div className="flex w-full justify-between">
                      <Button type="submit" variant="outline" disabled={pending}>
                        {isLogin ? "Login" : "Register"}
                      </Button>
                      <Button variant="outline" onClick={() => navigate("/")}>
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
