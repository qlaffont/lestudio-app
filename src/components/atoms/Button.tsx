import cx from 'classix'
import { JSX } from 'solid-js'

export const Button = ({
  className = '',
  prefixIconClassName = '',
  suffixIconClassName = '',
  type = 'button',
  disabled = false,
  isLoading = false,
  children,
  prefixIcon,
  onClickPrefix,
  suffixIcon,
  onClickSuffix,
  ...props
}: {
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
  isLoading?: boolean
  children?: JSX.Element
  prefixIcon?: string
  prefixIconClassName?: string
  suffixIcon?: string
  suffixIconClassName?: string
  onClick?: JSX.EventHandler<unknown, MouseEvent>
  onClickPrefix?: JSX.EventHandler<unknown, MouseEvent>
  onClickSuffix?: JSX.EventHandler<unknown, MouseEvent>
}) => (
  <button
    class={cx(
      'flex items-center justify-center gap-2',
      'rounded-md',
      'hover:opacity-60',
      disabled ? '!opacity-30' : '',
      className
    )}
    disabled={disabled || isLoading}
    type={type}
    {...props}
  >
    {isLoading && (
      <div>
        <i class={cx('icon icon-refresh animate block')}></i>
      </div>
    )}
    {prefixIcon && (
      <div onClick={onClickPrefix}>
        <i class={cx('block', `${prefixIcon}`, prefixIconClassName)}></i>
      </div>
    )}

    {children && <div>{children}</div>}

    {suffixIcon && (
      <div onClick={onClickSuffix}>
        <i class={cx('block', `${suffixIcon}`, suffixIconClassName)}></i>
      </div>
    )}
  </button>
)
