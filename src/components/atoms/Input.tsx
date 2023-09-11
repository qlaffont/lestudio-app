import cx from 'classix';
import { Ref, mergeProps, splitProps } from 'solid-js';

const variantclasss = {
  normal: 'border border-dark-10 focus-within:border-dark-30 rounded-md',
};

const sizeclasss = {
  medium: '',
  small: '!py-0',
};

const variantInputclasss: Record<keyof typeof variantclasss, string> = {
  normal: 'peer h-10 w-full text-black focus:outline-none bg-white !border-0 !ring-transparent',
};

const sizeInputclasss: Record<keyof typeof sizeclasss, string> = {
  medium: '',
  small: '!h-8',
};

const variantLabelclasss: Record<keyof typeof variantclasss, string> = {
  normal: '',
};

export type InputSize = keyof typeof sizeclasss;

export interface InputProps {
  label?: string;
  placeholder?: string;
  name?: string;
  variant?: keyof typeof variantclasss;
  size?: InputSize;
  className?: string;
  type?: string;
  error?;
  prefixIcon?: string;
  suffixIcon?: string;
  prefixIconclass?: string;
  suffixIconclass?: string;
  labelclass?: string;
  inputclass?: string;
  helperText?: string;
  disabled?: boolean;
  onClick?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  required?: boolean;
}

export const Input = (_props: InputProps) => {
  const [props, otherProps] = splitProps(
    mergeProps(
      {
        name: 'input',
        prefixIconclass: '',
        suffixIconclass: '',
        labelclass: '',
        type: 'text',
        variant: 'normal',
        size: 'medium',
      },
      _props,
    ),
    [
      'label',
      'name',
      'placeholder',
      'prefixIcon',
      'suffixIcon',
      'prefixIconclass',
      'suffixIconclass',
      'labelclass',
      'disabled',
      'className',
      'inputclass',
      'type',
      'variant',
      'size',
      'error',
      'inputRef',
      'onClick',
      'helperText',
      'required',
    ],
  );
  const isError = !!props.error;

  return (
    <div class={cx('relative block max-w-xl', props.className)}>
      {props.label && (
        <label
          for={props.name}
          class={cx(
            'block pb-1 text-white',
            variantLabelclasss[props.variant],
            isError ? ' !text-error' : '',
            props.labelclass,
          )}
        >
          {props.label}
          {props.required && <span> *</span>}
        </label>
      )}

      <div
        class={cx(
          'flex w-full items-center gap-2',
          variantclasss[props.variant],
          sizeclasss[props.size],
          props.disabled ? 'opacity-30' : '',
          isError ? '!border-error ' : '',
        )}
      >
        {props.prefixIcon && (
          <div>
            <i
              class={cx(
                'icon bg-dark-100 block h-5 w-5',
                `icon-${props.prefixIcon}`,
                props.prefixIconclass,
                props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
              onClick={props.onClick}
            />
          </div>
        )}
        <div class="flex-grow">
          <input
            id={props.name}
            name={props.name}
            type={props.type}
            class={cx(
              variantInputclasss[props.variant],
              sizeInputclasss[props.size],
              'placeholder-white placeholder-opacity-60 px-2',
              props.disabled ? 'cursor-not-allowed' : '',
              props.inputclass,
            )}
            disabled={props.disabled}
            placeholder={props.placeholder || ''}
            ref={props.inputRef}
            {...otherProps}
          />
        </div>
        {props.suffixIcon && (
          <div>
            <i
              class={cx(
                'icon block h-5 w-5 bg-white',
                `icon-${props.suffixIcon}`,
                props.suffixIconclass,
                props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
              onClick={props.onClick}
            />
          </div>
        )}
      </div>
      {(!!props.error || props.helperText) && (
        <p
          class={cx('mt-1 text-sm', isError ? '!border-error !text-error' : 'text-white text-opacity-80')}
          // eslint-disable-next-line solid/no-innerhtml
          innerHTML={props.error || props.helperText}
        />
      )}
    </div>
  );
};
