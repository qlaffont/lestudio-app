import { createForm } from '@felte/solid'
import { reporter } from '@felte/reporter-solid'
import { Input } from '../../components/atoms/Input'
import { Button } from '../../components/atoms/Button'

export const Settings = () => {
  const { form } = createForm({
    extend: reporter,
    onSubmit: values => {
      console.log(values)
    }
  })

  return (
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Settings</h1>

      <div>
        <form>
          <div class="space-y-4 max-w-xl">
            <Input label="User Token" name="token" />

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
  )
}
