import {
  useId,
  forwardRef, LegacyRef, memo, useMemo, FC, PropsWithChildren,
  ChangeEvent,
} from 'react'

import { CommonProps } from '../../../types'
import { useParseProps } from '../../../../hooks'
import { classNames } from '../../../../utils'
import { FieldProps } from '../../field'

import classes from './toggle.module.scss'


export type ToggleProps = CommonProps & PropsWithChildren & {
  onChange?: (event: ChangeEvent) => void
  checked?: FieldProps['checked']
  disabled?: FieldProps['disabled']
  invalid?: FieldProps['invalid']
}

/**
 * Toggle component.
 *
 * @type {React.FC<ToggleProps>}
 * @returns {React.ReactElement} The Toggle.
 */


const ToggleForwarded = forwardRef(({
  id,
  checked = false,
  disabled = false,
  className = '',
  // TODO add eror styling for invalid
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  invalid,
  onChange,
  ...props
}: ToggleProps, ref: LegacyRef<HTMLInputElement>) => {
  const shadowId = useId()

  const styles = useMemo(
    () => classNames(
      classes.toggle,
      disabled && classes.disabled,
      className,
    ),
    [disabled, className],
  )

  const { dataProps, restProps } = useParseProps(props)

  return (
    <label htmlFor={id ?? shadowId} className={styles} {...dataProps} style={restProps}>
      <input
        {...props}
        id={id ?? shadowId}
        ref={ref}
        role='switch'
        type='checkbox'
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <span className={classes.slider} />
    </label>
  )
})

ToggleForwarded.displayName = 'ToggleForwarded'

export const Toggle: FC<ToggleProps> = memo<ToggleProps>(ToggleForwarded)

export type ToggleType = typeof Toggle;

Toggle.displayName = 'Toggle'
