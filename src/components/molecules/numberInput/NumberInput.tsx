import { Input } from '../../atoms/input/Input';
import { Label } from '../../atoms/label/Label';
import { Paragraph } from '../../atoms/paragraph/Paragprah';
import { TNumberInput } from './NumberInput.types';
import styles from './NumberInput.module.scss';

export const NumberInput = (props: TNumberInput) => {
  const { label, value, onChange, placeholder, name, disabled, hasError, message, className, labelClassName, inputClassName, messageClassName } = props;

  return <div className={`${className ?? ''} ${styles['numberInput']}`}>
    {
      label && (
        <Label htmlFor={name} className={labelClassName ?? ''} hasError={hasError}>{label}</Label>
      )
    }
    <Input type="number" value={value} onChange={onChange} placeholder={placeholder} name={name} disabled={disabled} className={inputClassName} hasError={hasError} />
    {
      message && (
        <Paragraph hasError={hasError} className={messageClassName ?? ''}>{message}</Paragraph>
      )
    }
  </div>;
};