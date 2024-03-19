/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, ReactNode, memo, useMemo, useCallback, PropsWithChildren } from 'react'
import styled from 'styled-components'

import type { FieldError, IconComponentType } from './types'

let iconColor: string | (() => string) = () => '#000000'

export const setIconColor = (color: string | (() => string)): void => {
  iconColor = color
}

let IconComponent: IconComponentType = memo(function IconComponent() { return <span /> })

export const setIconComponent = (component: IconComponentType): void => {
  IconComponent = component
}

export type FileWrapperProps = PropsWithChildren<unknown> & {
  className?: string
  error?: boolean
  disabled?: boolean
  userDisabled?: boolean
  css?: string
}

export const FieldWrapper: FC<FileWrapperProps> = styled.div<FileWrapperProps>`
  opacity: ${({ disabled, userDisabled }): number => (disabled || userDisabled ? 0.5 : 1)};
  pointer-events: ${({ disabled, userDisabled }): string => (disabled || userDisabled ? 'none' : 'auto')};
  flex: 1 1 auto;
  width: 100%;
  @media (min-width: 400px) {
    flex: 1;
  }
  .label {
    font-size: 0.8rem !important;
    font-weight: normal;
  }

  .help {
    text-align: left;
  }

  .mainControl {
    flex: 1;
    border-radius: 6px;
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.06);
    will-change: box-shadow;
    transition: box-shadow 250ms ease-in-out;
    &:hover {
      box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
    }
  }
  button {
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
  }
  .select {
    width: 100%;
    flex: 1;
    &::after {
      border-color: #000000 !important;
    }
  }

  .icon {
    &.is-action {
      cursor: pointer;
      pointer-events: initial !important;
    }
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  .input[type=date]::-webkit-calendar-picker-indicator {
    opacity:0;
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 100%;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }

  textarea {
    resize: none;
  }
`

type EventType = { target: any; type?: any } & Partial<Event>
export interface FieldProps {
  label?: string
  name?: string
  type?: string
  min?: number | string | Date | any
  max?: number | string | Date | any
  value?: string | number | readonly string[] | undefined
  defaultValue?: string | number | readonly string[] | undefined
  placeholder?: string
  inputRef?: ReactHookFormRef
  error?: boolean
  errors?: FieldError
  disabled?: boolean
  userDisabled?: boolean
  helpTextInfo?: string
  helpText?: string
  iconLeft?: string
  iconRight?: string
  withoutComponent?: boolean
  addon?: ReactNode
  children?: ReactNode
  className?: string
  onChange?: (event?: EventType) => unknown
  // TODO, rename... something like changeHandler or valueDecorator
  onChangeInner?: (value: string | number) => string | number
  onBlur?: (event?: EventType) => void
  onFocus?: (event?: EventType | undefined) => void
  rightIconClick?: (event?: EventType) => void
  leftIconClick?: (event?: EventType) => void
  options?: any[] | null
  creatable?: boolean
  async?: boolean
  css?: string
  [key: string]: any
}

interface SelectProps extends FieldProps {
  id?: string
}

type OptionObj = { label: string | number | undefined; value: string | number | undefined }
type Option = OptionObj | string | number

export const Select: FC<SelectProps>
= memo<SelectProps>(
  function Select({ options, value, inputRef, ...props }: SelectProps) {
    return (
      <div className='select'>
        <select {...props} ref={inputRef} defaultValue={value}>
          {options?.map((option: Option) => (
            <option
              key={`${JSON.stringify(option)}`}
              value={typeof option === 'object' ? (option as OptionObj)?.value : option}
            >
              {typeof option === 'object' ? (option as OptionObj)?.label : option}
            </option>
          ))}
        </select>
      </div>
    )
  },
)

const InputComponent = styled.input``
const TextAreaComponent = styled.textarea``
const StyledFieldLabel = styled.label`
  text-align: left;
`

export const Field: FC<FieldProps> = memo<FieldProps>(({
  label,
  name,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  inputRef,
  error,
  disabled,
  userDisabled,
  withoutComponent,
  helpTextInfo,
  helpText,
  children,
  iconLeft,
  iconRight,
  addon,
  className,
  onChange,
  onChangeInner,
  onBlur,
  onFocus,
  rightIconClick,
  leftIconClick,
  options,
  css,
  ...props
}: FieldProps) => {
  let Component: FC<any> = InputComponent

  if (!children && type === 'textarea') {
    Component = TextAreaComponent
  }
  const handleFocus = useCallback((event: Event | EventType | undefined) => {
    if (userDisabled) {
      event?.preventDefault?.()
    } else {
      onFocus && onFocus(event)
    }
  }, [userDisabled, onFocus])

  const handleChange = useCallback((event: { target: { value: string } }) => {
    if (userDisabled) {
      return
    }
    if (onChangeInner && event?.target) {
      // eslint-disable-next-line no-param-reassign
      event.target.value = onChangeInner((event.target.value as string)) as string
      onChange && onChange(event as EventType)
    } else {
      onChange && onChange(event as EventType)
    }
  }, [onChangeInner, onChange, userDisabled])

  const valueProps = useMemo(() => {
    if (value === undefined) {
      return { defaultValue }
    }
    return { value }
  }, [value, defaultValue])

  return (
    <FieldWrapper
      className={`field ${className}`}
      error={error}
      disabled={disabled}
      userDisabled={userDisabled}
      css={css}
    >
      <StyledFieldLabel htmlFor={name} className='label'>{label}</StyledFieldLabel>
      <div className={`field ${addon ? 'has-addons' : ''}`}>
        <div
          className={`control mainControl ${iconLeft && !withoutComponent
            ? 'has-icons-left' : ''} ${iconRight ? 'has-icons-right' : ''}`}
        >
          {!withoutComponent && ((!children && (type === 'select' || options))
            ? (
              <Select
                name={name}
                id={name}
                inputRef={inputRef}
                className={`input ${error ? 'is-danger' : ''}`}
                type='select'
                placeholder={placeholder}
                value={value}
                options={options}
                // TODO also handle change but value versus event.target.value issue
                onChange={onChange}
                onBlur={onBlur}
                onFocus={handleFocus}
                onKeyDown={handleFocus}
                autoComplete='off'
                disabled={disabled}
                {...props}
              />
            )
            : (
              !children && (
              <Component
                name={name}
                id={name}
                ref={inputRef}
                className={`input ${error ? 'is-danger' : ''}`}
                type={type}
                placeholder={placeholder}
                {...valueProps}
                onChange={handleChange}
                onBlur={onBlur}
                onFocus={handleFocus}
                onKeyDown={handleFocus}
                autoComplete='off'
                disabled={disabled}
                {...props}
              />
              )))}

          {iconLeft && !withoutComponent && (
            <span
              className={`iconLeft icon is-small is-left ${leftIconClick ? 'is-action' : ''}`}
              onClick={leftIconClick}
            >
              <IconComponent
                iconName={iconLeft}
                color={iconColor}
              />
            </span>
          )}
          {iconRight && (
            <span
              className={`iconRight icon is-small is-right ${rightIconClick ? 'is-action' : ''}`}
              onClick={rightIconClick}
            >
              <IconComponent
                iconName={iconRight}
                color={iconColor}
              />
            </span>
          )}
          {children && children}
        </div>
        {addon && addon}
      </div>
      {helpTextInfo && <p className='help'>{helpTextInfo}</p>}
      {helpText && <p className={`help ${error ? 'is-danger' : ''}`}>{helpText}</p>}
    </FieldWrapper>
  )
})

Field.displayName = 'Field'
