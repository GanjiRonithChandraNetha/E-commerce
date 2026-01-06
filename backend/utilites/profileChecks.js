import { z } from "zod";

export const userProfileSchema = z.object({
  mobile_number: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/, "Invalid mobile number"),
  name: z.string().min(1).max(50),
  profile_pic: z.string().optional().nullable(),
  email: z.string().email()
}).strip();

export const userEditProfileSchema = z.object({
  mobileNumber: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/, "Invalid mobile number").optional(),
  name: z.string().min(1).max(50).optional(),
  email:z.string().email().optional()
}).strict();