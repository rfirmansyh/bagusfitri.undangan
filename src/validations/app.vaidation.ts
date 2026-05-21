import * as yup from 'yup';

export const createRsvpValidation = yup.object({
  name: yup.string().required(),
  status: yup.number().integer().required(),
});
export const createWishValidation = yup.object({
  name: yup.string().required(),
  message: yup.string().required(),
});
