import { useI18n } from '../../lang/useI18n';
import { useCaptions } from '../../components/modules/captions/context/CaptionsContext';

export const Captions = () => {
  const { t } = useI18n();

  const { isCompatible, isConnectedToOBS, lastText } = useCaptions();

  return (
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">{t('pages.captions.title')}</h1>

      {!isCompatible() && <p class="text-red-500 font-bold text-center text-md">{t('pages.captions.incompatible')}</p>}

      <h2>
        <span class="font-bold">{t('pages.captions.OBSConnection')} </span>
        {isConnectedToOBS() && <span class="text-green-500">{t('pages.captions.connected')}</span>}
        {!isConnectedToOBS() && <span class="text-red-500">{t('pages.captions.notConnected')}</span>}
      </h2>

      <h2>
        <span class="font-bold">{t('pages.captions.lastText')}</span> {lastText()}
      </h2>
    </div>
  );
};
