import { useI18n } from '../../lang/useI18n';

export const Home = () => {
  const { t } = useI18n();

  return <div class="text-white">{t('pages.home.title')}</div>;
};
