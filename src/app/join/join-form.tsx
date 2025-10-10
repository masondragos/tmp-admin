"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRegisterEmployee } from "@/hooks/employee/use-register-employee";

// Zod schema for form validation
const registerSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function JoinForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const registerEmployee = useRegisterEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Check if token exists
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing invitation token");
      router.push("/");
    }
  }, [token, router]);

  const onSubmit = (data: RegisterFormData) => {
    if (!token) {
      toast.error("Invalid invitation token");
      return;
    }

    registerEmployee.mutate(
      { password: data.password, token },
      {
        onSuccess: () => {
          toast.success("Registration successful! You can now log in.");
          router.push("/");
        },
        onError: (error) => {
          toast.error(error.message || "Registration failed. Please try again.");
        },
      }
    );
  };

  // Don't render form if no token
  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Invitation
          </h1>
          <p className="text-gray-600 mb-4">
            This invitation link is invalid or has expired.
          </p>
          <Button onClick={() => router.push("/")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Registration
          </h1>
          <p className="text-gray-600">
            Set your password to join the team
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Field
                label="Password"
                error={errors.password?.message}
                isRequired={true}
              >
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={errors.password ? "border-red-500 focus:ring-red-500" : ""}
                />
              </Field>

              <Field
                label="Confirm Password"
                error={errors.confirmPassword?.message}
                isRequired={true}
              >
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}
                />
              </Field>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={registerEmployee.isPending}
              >
                {registerEmployee.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

