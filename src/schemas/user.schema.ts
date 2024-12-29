import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const UserListSchema = z.array(UserSchema);

export const UserCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  age: z.number(),
  location: z.array(z.number()).min(2).max(2),
  preferredRange: z.number(),
  preferredAgeMin: z.number(),
  preferredAgeMax: z.number(),
}).strict();

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
}).strict();

export const UserUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  age: z.string().optional(),
  locationLng: z.string().optional(),
  locationLat: z.string().optional(),
  preferredRange: z.string().optional(),
  preferredAgeMin: z.string().optional(),
  preferredAgeMax: z.string().optional(),
  photoId: z.string().optional(),
  isPremium: z.enum(["true", "false"]).optional(),
}).strict();

export type IUserLogin = z.infer<typeof UserLoginSchema>;
