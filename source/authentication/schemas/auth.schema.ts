import { z } from "zod";

/**
 * Role enum schema matching Prisma User model
 */
export const RoleSchema = z.enum(["ADMIN", "LIBRARIAN", "STUDENT"], {
  required_error: "Rol alanı zorunludur",
  invalid_type_error: "Geçersiz rol seçimi",
});

/**
 * User registration schema
 */
export const RegisterUserSchema = z.object({
  name: z
    .string({ required_error: "İsim alanı zorunludur" })
    .min(2, "İsim en az 2 karakter olmalı")
    .max(100, "İsim en fazla 100 karakter olabilir")
    .trim(),
  email: z
    .string({ required_error: "Email alanı zorunludur" })
    .min(1, "Email boş olamaz")
    .email("Geçerli bir email adresi girin")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Şifre alanı zorunludur" })
    .min(6, "Şifre en az 6 karakter olmalı")
    .max(128, "Şifre en fazla 128 karakter olabilir")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir"
    ),
  role: RoleSchema,
});

/**
 * User login schema
 */
export const LoginUserSchema = z.object({
  email: z
    .string({ required_error: "Email alanı zorunludur" })
    .min(1, "Email boş olamaz")
    .email("Geçerli bir email adresi girin")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Şifre alanı zorunludur" })
    .min(1, "Şifre boş olamaz"),
});

/**
 * User update schema (partial update allowed)
 */
export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(100, "İsim en fazla 100 karakter olabilir")
    .trim()
    .optional(),
  email: z
    .string()
    .email("Geçerli bir email adresi girin")
    .toLowerCase()
    .trim()
    .optional(),
  role: RoleSchema.optional(),
});

/**
 * Change password schema
 */
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Mevcut şifre alanı zorunludur" })
      .min(1, "Mevcut şifre boş olamaz"),
    newPassword: z
      .string({ required_error: "Yeni şifre alanı zorunludur" })
      .min(6, "Yeni şifre en az 6 karakter olmalı")
      .max(128, "Yeni şifre en fazla 128 karakter olabilir")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Yeni şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir"
      ),
    confirmPassword: z.string({ required_error: "Şifre onayı zorunludur" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

/**
 * Password reset request schema
 */
export const PasswordResetRequestSchema = z.object({
  email: z
    .string({ required_error: "Email alanı zorunludur" })
    .min(1, "Email boş olamaz")
    .email("Geçerli bir email adresi girin")
    .toLowerCase()
    .trim(),
});

/**
 * Password reset confirmation schema
 */
export const PasswordResetConfirmSchema = z
  .object({
    token: z
      .string({ required_error: "Token alanı zorunludur" })
      .min(1, "Token boş olamaz")
      .uuid("Geçersiz token formatı"),
    newPassword: z
      .string({ required_error: "Yeni şifre alanı zorunludur" })
      .min(6, "Yeni şifre en az 6 karakter olmalı")
      .max(128, "Yeni şifre en fazla 128 karakter olabilir")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Yeni şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir"
      ),
    confirmPassword: z.string({ required_error: "Şifre onayı zorunludur" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

/**
 * User query parameters schema (for filtering/searching)
 */
export const UserQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Sayfa numarası 0'dan büyük olmalı")
    .optional()
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, "Limit 1-100 arasında olmalı")
    .optional()
    .default("10"),
  role: RoleSchema.optional(),
  search: z.string().min(1, "Arama terimi en az 1 karakter olmalı").optional(),
});

/**
 * User ID parameter schema
 */
export const UserIdSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Geçersiz kullanıcı ID'si"),
});

// Type inference from schemas for TypeScript
export type Role = z.infer<typeof RoleSchema>;
export type RegisterUser = z.infer<typeof RegisterUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetConfirm = z.infer<typeof PasswordResetConfirmSchema>;
export type UserQuery = z.infer<typeof UserQuerySchema>;
export type UserId = z.infer<typeof UserIdSchema>;

// Export all schemas for easy import
export const AuthSchemas = {
  Role: RoleSchema,
  RegisterUser: RegisterUserSchema,
  LoginUser: LoginUserSchema,
  UpdateUser: UpdateUserSchema,
  ChangePassword: ChangePasswordSchema,
  PasswordResetRequest: PasswordResetRequestSchema,
  PasswordResetConfirm: PasswordResetConfirmSchema,
  UserQuery: UserQuerySchema,
  UserId: UserIdSchema,
} as const;
