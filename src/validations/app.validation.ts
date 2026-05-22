import * as yup from 'yup';

// ─── RSVP Validation ────────────────────────────────────────────
export const createRsvpValidation = yup.object({
  name: yup
    .string()
    .trim()
    .required('Nama wajib diisi')
    .min(1, 'Nama wajib diisi')
    .max(120, 'Nama maksimal 120 karakter'),
  guests: yup
    .number()
    .required('Jumlah tamu wajib diisi')
    .integer('Jumlah tamu harus bilangan bulat')
    .min(0, 'Jumlah tamu minimal 0')
    .max(10, 'Jumlah tamu maksimal 10'),
});

export type TCreateRsvpForm = yup.InferType<typeof createRsvpValidation>;

// ─── Wish Validation ────────────────────────────────────────────
export const createWishValidation = yup.object({
  name: yup
    .string()
    .trim()
    .required('Nama wajib diisi')
    .min(1, 'Nama wajib diisi')
    .max(120, 'Nama maksimal 120 karakter'),
  message: yup
    .string()
    .trim()
    .required('Ucapan wajib diisi')
    .min(1, 'Ucapan wajib diisi')
    .max(1000, 'Ucapan maksimal 1000 karakter'),
});

export type TCreateWishForm = yup.InferType<typeof createWishValidation>;

// ─── Admin Login Validation ─────────────────────────────────────
export const adminLoginValidation = yup.object({
  password: yup
    .string()
    .trim()
    .required('Password wajib diisi')
    .min(1, 'Password wajib diisi')
    .max(32, 'Password maksimal 32 karakter'),
});

export type TAdminLoginForm = yup.InferType<typeof adminLoginValidation>;

// ─── Guestbook Validation ───────────────────────────────────────
export const createGuestbookValidation = yup.object({
  name: yup
    .string()
    .trim()
    .required('Nama tamu wajib diisi')
    .min(1, 'Nama tamu wajib diisi')
    .max(120, 'Nama tamu maksimal 120 karakter'),
});

export type TCreateGuestbookForm = yup.InferType<typeof createGuestbookValidation>;
