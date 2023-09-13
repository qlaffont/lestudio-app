import { useRosetty } from 'rosetty-solid';
import { enI18n } from './en';

export const useI18n = () => {
  return useRosetty<typeof enI18n>(); //Enable autocompletion base on you translation file
};
