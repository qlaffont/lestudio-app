import cx from 'classix';
import { JSX, mergeProps, splitProps } from 'solid-js';

export const Button = (_props: {
  type?: 'button' | 'submit';
  class?: string;
  disabled?: boolean;
  isLoading?: boolean;
  children?: JSX.Element;
  prefixIcon?: string;
  prefixIconClassName?: string;
  suffixIcon?: string;
  suffixIconClassName?: string;
  onClick?: JSX.EventHandler<unknown, MouseEvent>;
  onClickPrefix?: JSX.EventHandler<unknown, MouseEvent>;
  onClickSuffix?: JSX.EventHandler<unknown, MouseEvent>;
}) => {
  const [props, otherProps] = splitProps(
    mergeProps(
      {
        class: '',
        prefixIconClassName: '',
        suffixIconClassName: '',
        type: 'button',
        disabled: false,
        isLoading: false,
      },
      _props,
    ),
    [
      'class',
      'prefixIconClassName',
      'suffixIconClassName',
      'type',
      'disabled',
      'isLoading',
      'children',
      'prefixIcon',
      'onClickPrefix',
      'suffixIcon',
      'onClickSuffix',
    ],
  );
  return (
    <button
      class={cx(
        'flex items-center justify-center gap-2 text-white',
        'rounded-md',
        'hover:opacity-60',
        props.disabled ? '!opacity-30' : '',
        props.class,
      )}
      disabled={props.disabled || props.isLoading}
      type={props.type}
      {...otherProps}
    >
      {props.isLoading && (
        <div>
          <i class={cx('icon icon-refresh animate block')} />
        </div>
      )}
      {props.prefixIcon && (
        <div onClick={props.onClickPrefix}>
          <i class={cx('block', `${props.prefixIcon}`, props.prefixIconClassName)} />
        </div>
      )}

      {props.children && <div class="text-white">{props.children}</div>}

      {props.suffixIcon && (
        <div onClick={props.onClickSuffix}>
          <i class={cx('block', `${props.suffixIcon}`, props.suffixIconClassName)} />
        </div>
      )}
    </button>
  );
};
