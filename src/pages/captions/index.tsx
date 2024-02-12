/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useI18n } from '../../lang/useI18n';
import { useCaptions } from '../../components/modules/captions/context/CaptionsContext';
import { Input } from '../../components/atoms/Input';
import { getError } from '../../services/form';
import { Button } from '../../components/atoms/Button';
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-zod';
import { Config, setConfig, getCaptionsData } from '../../tauri';
import zod from '../../lang/zod';
import { Select, createOptions } from '@thisbeyond/solid-select';
import { LangOptions } from '../../components/modules/captions/utils/langOptions';
import { createMemo, createSignal, onMount } from 'solid-js';
import toast from 'solid-toast';

const schema = zod.object({
  captionsOBSAddress: zod.string().min(1),
  captionsOBSPassword: zod.string().optional().nullable(),
  captionsLanguage: zod.string().min(1),
});

export const Captions = () => {
  const i18n = useI18n();

  const { isCompatible, isConnectedToOBS, lastText, restartRecognition } = useCaptions();

  const { form, setData, errors, data, isValid } = createForm({
    extend: [validator({ schema })],
    onSubmit: async (values: zod.infer<typeof schema>) => {
      await setConfig(values as Partial<Config>);
      restartRecognition();
      toast.success(i18n().t('pages.captions.form.success'));
    },
  });

  onMount(() => {
    (async () => {
      const config = await getCaptionsData();
      setData({ ...config, captionsOBSPassword: config.captionsOBSPassword || null });
    })();
  });

  const captionsLanguageOptions = createOptions(LangOptions(t), { key: 'label' });
  const selectLanguageValue = createMemo(() => {
    const v = captionsLanguageOptions.options('').find((v) => v.value.value === data().captionsLanguage);
    return v ? v.value : undefined;
  });

  const [isVisible, setIsVisible] = createSignal(false);

  return (
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">{i18n().t('pages.captions.title')}</h1>

      {!isCompatible() && (
        <p class="text-red-500 font-bold text-center text-md">{i18n().t('pages.captions.incompatible')}</p>
      )}

      <h2>
        <span class="font-bold text-white">{i18n().t('pages.captions.OBSConnection')} </span>
        {isConnectedToOBS() && <span class="text-green-500">{i18n().t('pages.captions.connected')}</span>}
        {!isConnectedToOBS() && <span class="text-red-500">{i18n().t('pages.captions.notConnected')}</span>}
      </h2>

      <div>
        <h2 class="font-bold text-white">{i18n().t('pages.captions.lastText')}</h2>
        <p class="line-clamp-2 h-[48px] text-white">{lastText()}</p>
      </div>

      <form use:form>
        <div class="space-y-4 max-w-xl">
          <Input
            label={i18n().t('pages.captions.form.captionsOBSAddress')}
            name="captionsOBSAddress"
            helperText={i18n().t('pages.captions.form.captionsOBSAddressHelper')}
            error={getError(errors(), 'captionsOBSAddress')}
            value={data().captionsOBSAddress}
          />

          <Input
            label={i18n().t('pages.captions.form.captionsOBSPassword')}
            name="captionsOBSPassword"
            error={getError(errors(), 'captionsOBSPassword')}
            value={data().captionsOBSPassword}
            type={isVisible() ? 'text' : 'password'}
            suffixIcon={isVisible() ? 'icon icon-eye-full' : 'icon icon-eye'}
            suffixIconclass="mr-2"
            onClick={() => setIsVisible((v) => !v)}
          />

          <div class="space-y-2">
            <label class="text-white">{i18n().t('pages.captions.form.captionsLanguage')}</label>
            <Select
              {...captionsLanguageOptions}
              initialValue={selectLanguageValue()}
              format={(item) => item.label}
              onChange={(v) => {
                setData('captionsLanguage', v.value);
              }}
            />
          </div>

          <div class="m-auto">
            <Button class="btn btn-accent btn-wide m-auto" type="submit" disabled={!isValid()}>
              {i18n().t('pages.captions.form.action')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
