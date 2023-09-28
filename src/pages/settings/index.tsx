import { createForm } from '@felte/solid';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { validator } from '@felte/validator-zod';
import { createSignal, onMount } from 'solid-js';
import { Config, getConfig, setConfig, toggleAutoStart } from '../../tauri';
import { useI18n } from '../../lang/useI18n';
import { getError } from '../../services/form';
import zod from '../../lang/zod';
import { useValidToken } from '../../services/api/useValidToken';
import toast from 'solid-toast';
import { useApp } from '../../components/modules/app/context/AppContext';

const schema = zod.object({
  token: zod.string().min(1),
});

export const Settings = () => {
  const { t } = useI18n();
  const { setToken, version } = useApp();

  const { mutate } = useValidToken({
    onSuccess: () => {
      toast.success(t('pages.settings.form.success'));
    },
    onError: () => {
      toast.error(t('pages.settings.form.errorToken'));
    },
  });

  const { form, setData, errors, data } = createForm({
    extend: [validator({ schema })],
    onSubmit: async (values: zod.infer<typeof schema>) => {
      mutate({
        token: values.token,
      });
      await setConfig(values as Partial<Config>);
      setToken(values.token);
    },
  });

  const [isAutoStartEnabled, setIsAutoStartEnabled] = createSignal(false);

  onMount(() => {
    (async () => {
      const config = await getConfig();
      setData({ token: config?.token || null });
      setIsAutoStartEnabled(config.isAutoStartActivated || false);
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
              value={data().token}
            />

            <div class="m-auto">
              <Button class="btn btn-accent btn-wide m-auto" type="submit">
                {t('pages.settings.form.action')}
              </Button>
            </div>
          </div>
        </form>

        <div class="form-control w-[250px] pt-12">
          <label class="cursor-pointer label">
            <span class="label-text">{t('pages.settings.startOnBoot')}</span>
            <input
              type="checkbox"
              class="toggle toggle-accent"
              checked={isAutoStartEnabled()}
              onClick={() => {
                toggleAutoStart();
              }}
            />
          </label>
        </div>
      </div>

      <div>
        <p class="text-xs italic  text-center">{t('pages.settings.close')}</p>
      </div>

      <div class="text-center text-xm opacity-60 text-white pt-20">
        © LeStudio - {new Date().getFullYear()} / {version()}
      </div>
    </div>
  );
};
