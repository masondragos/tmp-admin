import z from "zod";

// Login Schema
export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
  });
  
  export type LoginFormData = z.infer<typeof loginSchema>;