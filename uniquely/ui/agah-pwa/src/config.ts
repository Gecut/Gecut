const errors = [
  'storage_error',
  'user_not_found',
  'token_required',
  'token_expired',
  'token_invalid',
  'user_forbidden',
  'sans_not_found',
  'sans_code_not_found',
  'sans_code_not_allowed_for_your_gender',
  'sans_code_not_allowed_for_your_age',
  'this_phone_exists',
] as const;
export type Errors = (typeof errors)[number];

const errorsMessages: Record<Errors, string> = {
  storage_error: 'خطا در اتصال به پایگاه داده',
  user_not_found: 'کاربر یافت نشد',
  token_required: 'ارسال توکن اجباری است',
  token_expired: 'توکن منقضی شده است',
  token_invalid: 'توکن نادرست است',
  user_forbidden: 'دسترسی این عملیات را ندارید',
  sans_not_found: 'سانس اجرا یافت نشد',
  sans_code_not_found: 'سانس اجرا یافت نشد',
  sans_code_not_allowed_for_your_gender: 'جنسیت شما با این سانس سازگار نیست',
  sans_code_not_allowed_for_your_age: 'سن شما با این سانس سازگار نیست',
  this_phone_exists: 'این شماره تلفن وجود دارد',
};
const errMessage = (error: Errors) => errorsMessages[error];

const config = {
  version: '1.35.5',
  api: 'https://api.agaah-group.ir',
  errorsMessages,
  errMessage,
};

export default config;
