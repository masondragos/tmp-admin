import { z } from "zod";

export const employeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required"),
})

export type employeeFormData = z.infer<typeof employeeSchema>;