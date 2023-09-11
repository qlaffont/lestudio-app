import { createForm } from '@felte/solid';
import { ValidationMessage, reporter } from '@felte/reporter-solid';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { validator } from '@felte/validator-zod';
import * as zod from 'zod';
import { onMount } from 'solid-js';
import { Config, getConfig, setConfig } from '../../tauri';

const schema = zod.object({
  token: zod.string().nonempty(),
});

export const Settings = () => {
  const { form, setData } = createForm({
    extend: [validator({ schema }), reporter()],
    onSubmit: async (values) => {
      console.log(values);
      await setConfig(values as Partial<Config>);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onMount(async () => {
    const config = await getConfig();
    setData(config);
  });

  return (
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Settings</h1>

      <div>
        <form use:form>
          <div class="space-y-4 max-w-xl">
            <Input label="User Token" name="token" />

            <ValidationMessage for="token">
              {(messages) => <span class="text-red-500 font-bold">{messages?.[0]}</span>}
            </ValidationMessage>

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
