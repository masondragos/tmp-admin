import z from "zod";

export const lenderEmployeeSchema = z.object({
    name: z.string().min(1,"Name is required"),
    email: z.string().min(1, "Email is required"),
})

export type lenderEmployeeFormData = z.infer<typeof lenderEmployeeSchema>;