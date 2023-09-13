import { ZodEn } from './zodEn';

export const enI18n = {
  pages: {
    home: {
      title: 'Home',
    },
    settings: {
      title: 'Settings',
      form: {
        userToken: 'User Token',
        helperUserToken: 'You can found this token in Settings > Token',
        action: 'Save',
      },
    },
  },
  ...ZodEn,
};
