import cx from 'classix'
import { Ref } from 'solid-js'

const variantclasss = {
  normal: 'border border-dark-10 focus-within:border-dark-30 rounded-md'
}

const sizeclasss = {
  medium: '',
  small: '!py-0'
}

const variantInputclasss: Record<keyof typeof variantclasss, string> = {
  normal:
    'peer h-10 w-full text-black focus:outline-none bg-white !border-0 !ring-transparent'
}

const sizeInputclasss: Record<keyof typeof sizeclasss, string> = {
  medium: '',
  small: '!h-8'
}

const variantLabelclasss: Record<keyof typeof variantclasss, string> = {
  normal: ''
}

export type InputSize = keyof typeof sizeclasss

export interface InputProps {
  label?: string
  placeholder?: string
  name?: string
  variant?: keyof typeof variantclasss
  size?: InputSize
  className?: string
  type?: string
  error?
  prefixIcon?: string
  suffixIcon?: string
  prefixIconclass?: string
  suffixIconclass?: string
  labelclass?: string
  inputclass?: string
  helperText?: string
  disabled?: boolean
  onClick?: () => void
  inputRef?: Ref<HTMLInputElement>
  required?: boolean
}

export const Input = ({
  label,
  name = 'input',
  placeholder,
  prefixIcon,
  suffixIcon,
  prefixIconclass = '',
  suffixIconclass = '',
  labelclass = '',
  disabled,
  className,
  inputclass,
  type = 'text',
  variant = 'normal',
  size = 'medium',
  error,
  inputRef,
  onClick,
  helperText,
  required,
  ...props
}: InputProps) => {
  const isError = !!error

  return (
    <div class={cx('relative block max-w-xl', className)}>
      {label && (
        <label
          for={name}
          class={cx(
            'block pb-1 text-white',
            variantLabelclasss[variant],
            isError ? ' !text-error' : '',
            labelclass
          )}
        >
          {label}
          {required && <span> *</span>}
        </label>
      )}

      <div
        class={cx(
          'flex w-full items-center gap-2',
          variantclasss[variant],
          sizeclasss[size],
          disabled ? 'opacity-30' : '',
          isError ? '!border-error ' : ''
        )}
      >
        {prefixIcon && (
          <div>
            <i
              class={cx(
                'icon bg-dark-100 block h-5 w-5',
                `icon-${prefixIcon}`,
                prefixIconclass,
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              )}
              onClick={onClick}
            />
          </div>
        )}
        <div class="flex-grow">
          <input
            id={name}
            name={name}
            type={type}
            class={cx(
              variantInputclasss[variant],
              sizeInputclasss[size],
              'placeholder-white placeholder-opacity-60 px-2',
              disabled ? 'cursor-not-allowed' : '',
              inputclass
            )}
            disabled={disabled}
            placeholder={placeholder || ''}
            ref={inputRef}
            {...props}
          />
        </div>
        {suffixIcon && (
          <div>
            <i
              class={cx(
                'icon block h-5 w-5 bg-white',
                `icon-${suffixIcon}`,
                suffixIconclass,
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              )}
              onClick={onClick}
            />
          </div>
        )}
      </div>
      {(!!error || helperText) && (
        <p
          class={cx(
            'mt-1 text-sm',
            isError ? '!border-error !text-error' : 'text-white text-opacity-80'
          )}
          innerHTML={error || helperText}
        ></p>
      )}
    </div>
  )
}
