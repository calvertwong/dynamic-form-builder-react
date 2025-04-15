import { Input } from "../../atoms/input/Input"
import { Label } from "../../atoms/label/Label"
import { P } from "../../atoms/p/P"
import { TCheckbox } from "./Checkbox.types"
import styles from './Checkbox.module.scss'
import classNames from "classnames"

export const Checkbox = ({ label, checked, onChange, id, disabled, hasError, className, labelClassName, inputClassName, messageClassName }: TCheckbox) => {
  const inputClasses = classNames(
    inputClassName,
    styles.checkboxInput,
  )

  const labelClasses = classNames(
    labelClassName,
    {
      [styles.checkboxLabel]: !disabled
    },
  )

  return (
    <div className={className}>
      <div className={styles.checkboxWrapper}>
        <Input type="checkbox" checked={checked} onChange={onChange} id={id} disabled={disabled} className={inputClasses} />
        <Label htmlFor={id} className={labelClasses}>{label}</Label>
      </div>
      <P hasError={hasError} className={messageClassName}>{hasError && 'Error'}</P>
    </div>
  )
}
