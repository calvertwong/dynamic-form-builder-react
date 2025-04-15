import { Input } from "../../atoms/input/Input";
import { Label } from "../../atoms/label/Label";
import { P } from "../../atoms/p/P";
import { TTextInput } from "./TextInput.types";

export const TextInput = ({ label, value, onChange, placeholder, name, disabled, hasError, message, className, labelClassName, inputClassName, messageClassName }: TTextInput) => {
  return <div className={className}>
    <Label htmlFor={name} className={labelClassName} hasError={hasError}>{label}</Label>
    <Input type="text" value={value} onChange={onChange} placeholder={placeholder} name={name} disabled={disabled} className={inputClassName} hasError={hasError} />
    <P hasError={hasError} className={messageClassName}>{message}</P>
  </div>
}