/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FC, ReactNode, memo, useMemo, useCallback, ComponentType } from 'react'
import styled from 'styled-components'
import sanitize from 'sanitize-html'

// import { Select as ReactSelect } from 'components/elements/Select/Select'

export type IconComponentType = ComponentType<{ iconName: string; color: string}>

let iconComponent: IconComponentType

export const setIconComponent = (component: IconComponentType): void => {
  iconComponent = component
}

type FileWrapperProps = {
  className?: string
  error?: boolean
  disabled?: boolean
  userDisabled?: boolean
  multiInput?: boolean
  css?: string
}

const FieldWrapper: FC<FileWrapperProps> = styled.div<FileWrapperProps>`
  opacity: ${({ disabled, userDisabled }) => (disabled || userDisabled ? 0.5 : 1)};
  pointer-events: ${({ disabled, userDisabled }) => (disabled || userDisabled ? 'none' : 'auto')};
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
    box-shadow: ${({ multiInput }) => (multiInput
    ? 'none' : '0 0 8px 2px rgba(0, 0, 0, 0.1)')};
    border-radius: 6px;
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

export type FieldError = any | Record<string, any> | undefined
export interface FieldProps {
  label?: string
  name?: string
  type?: string
  min?: number | string | Date | any
  max?: number | string | Date | any
  value?: string | number | readonly string[] | undefined
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
  onChange?: (value?: unknown) => unknown
  // TODO, rename... something like changeHandler or valueDecorator
  onChangeInner?: (value: string | number) => string | number
  onBlur?: (event?: unknown) => void
  onFocus?: (event?: unknown) => void
  rightIconClick?: (event?: unknown) => void
  leftIconClick?: (event?: unknown) => void
  options?: any[] | null
  creatable?: boolean
  async?: boolean
  css?: string
  [key: string]: any
}

// const defaultIsSelected: (option?: unknown, value?: string | number | readonly string[] | undefined) => boolean
//   = (option, value) => value !== null && value !== undefined && (
//     (typeof option === 'object' && (option as OptionObj)?.value === value)
//     || option === value)

interface SelectProps extends FieldProps {
  // isSelected?: (option?: unknown, value?: string | number | readonly string[] | undefined) => boolean
  id?: string
}

// type Option = React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>
type OptionObj = { label: string | number | undefined; value: string | number | undefined }
type Option = OptionObj | string | number

export const Select: FC<SelectProps>
= memo<SelectProps>(
  function Select({ options, value, inputRef, ...props }: SelectProps) {
    return (
      <div className='select'>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
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

type CheckBoxLabelProps = { className: string; inLine?: boolean; htmlFor: string | undefined }

const StyledLabel: FC<CheckBoxLabelProps> = styled.label<CheckBoxLabelProps>`
  display: flex;
  flex-direction: ${({ inLine = true }) => (inLine ? 'row' : 'column-reverse')};
  gap: 0.5rem;
  // align-items: baseline;
  input[type="checkbox"] {
    min-width: 1rem;
    min-height: 1rem;
    margin: 0.2rem;
  }
  .label {
    font-size: ${({ inLine = true }) => (inLine ? '1rem !important' : 'inherit')};
  }

`

export type CheckBoxProps = {
  label?: string
  htmlLabel?: string
  className?: string
  css?: string
  disabled?: boolean
  value?: any
  name?: string
  error?: boolean
  errors?: FieldError
  helpText?: string
  inLine?: boolean
  [key: string]: any
}

export const CheckBox: FC<CheckBoxProps>
= memo<CheckBoxProps>(function Checkbox({
  name, label, value, className, css, disabled, inputRef,
  htmlLabel, error, helpText, inLine, ...props }: CheckBoxProps) {
  const sanitizedHtmlLabel = useMemo(() => (htmlLabel ? ({ __html: sanitize(htmlLabel) }) : null), [htmlLabel])
  return (
    <FieldWrapper className={`field ${className}`} error={error} disabled={disabled} css={css}>
      <StyledLabel className='checkbox' htmlFor={name} inLine={inLine}>
        <input
          id={name}
          name={name}
          type='checkbox'
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          ref={inputRef}
          disabled={disabled}
          value={value}
          checked={value}
          aria-labelledby={name}
        />
        {label && (<span className='label'>{label}</span>)}
        {/* eslint-disable-next-line react/no-danger */}
        {sanitizedHtmlLabel && <span dangerouslySetInnerHTML={sanitizedHtmlLabel} />}
      </StyledLabel>
      {helpText && <p className={`help ${error ? 'is-danger' : ''}`}>{helpText}</p>}
    </FieldWrapper>)
})

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
  multiInput,
  ...props
}: FieldProps) => {
  let Component: FC<any> = InputComponent
  if (!children && type === 'textarea') {
    Component = TextAreaComponent
  }
  const handleFocus = useCallback((event) => {
    if (userDisabled) {
      event.preventDefault()
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
      onChange && onChange(event as unknown)
    } else {
      console.log('calling Field onChange')
      console.log('calling Field onChange, event: ', event)
      onChange && onChange(event as unknown)
    }
  }, [onChangeInner, onChange, userDisabled])

  const Icon: IconComponentType = iconComponent
  return (
    <FieldWrapper
      className={`field ${className}`}
      error={error}
      disabled={disabled}
      userDisabled={userDisabled}
      multiInput={multiInput}
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
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )
            : (
              !children && <Component
                name={name}
                id={name}
                ref={inputRef}
                className={`input ${error ? 'is-danger' : ''}`}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                onFocus={handleFocus}
                onKeyDown={handleFocus}
                autoComplete='off'
                disabled={disabled}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />))}

          {iconLeft && !withoutComponent && (
            <span className={`icon is-small is-left ${leftIconClick ? 'is-action' : ''}`} onClick={leftIconClick}>
              <Icon iconName={iconLeft} color='#DBDBDB' />
            </span>
          )}
          {iconRight && (
            <span className={`icon is-small is-right ${rightIconClick ? 'is-action' : ''}`} onClick={rightIconClick}>
              <Icon iconName={iconRight} color='#DBDBDB' />
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
