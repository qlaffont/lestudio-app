import { createForm } from '@felte/solid';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { validator } from '@felte/validator-zod';
import { onMount } from 'solid-js';
import { Config, getConfig, setConfig } from '../../tauri';
import { useI18n } from '../../lang/useI18n';
import { getError } from '../../services/form';
import zod from '../../lang/zod';

const schema = zod.object({
  token: zod.string().min(1),
});

export const Settings = () => {
  const { t } = useI18n();
  const { form, setData, errors } = createForm({
    extend: [validator({ schema })],
    onSubmit: async (values) => {
      console.log(values);
      await setConfig(values as Partial<Config>);
    },
  });

  onMount(() => {
    (async () => {
      const config = await getConfig();
      setData(config);
    })();
  });

  return (
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">{t('pages.settings.title')}</h1>

      <div>
        <form use:form>
          <div class="space-y-4 max-w-xl">
            <Input
              label={t('pages.settings.form.userToken')}
              name="token"
              helperText={t('pages.settings.form.helperUserToken')}
              error={getError(errors(), 'token')}
            />

            <div class="m-auto">
              <Button class="btn btn-accent btn-wide" type="submit">
                Sign In
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div class="text-center text-xm opacity-60 text-white pt-20">
        {/* TODO: Add version number  */}© LeStudio - {new Date().getFullYear()} / 1.0.0
      </div>
    </div>
  );
};
