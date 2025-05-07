
import { TFileInput } from './FileInput.types';
import styles from './FileInput.module.scss';
import { Input } from '@atoms/input/Input';
import { Label } from '@atoms/label/Label';
import { Paragraph } from '@atoms/paragraph/Paragprah';
import classNames from 'classnames';

export const FileInput = (props: TFileInput) => {
  const {
    label, onChange, disabled, hasError, inputClassName, labelClassName, message, messageClassName, name, placeholder, className
  } = props;

  const inputClasses = classNames(
    inputClassName,
    styles.fileInput__input
  );

  return (
    <div className={`${className ?? ''} ${styles['fileInput__container']}`}>
      {label && (
        <Label htmlFor={name} className={labelClassName ?? ''} hasError={hasError}>{label}</Label>

      )}
      <Input type="file" onChange={onChange} placeholder={placeholder} name={name} disabled={disabled} className={inputClasses} hasError={hasError} />

      {
        message && (
          <Paragraph hasError={hasError} className={messageClassName ?? ''}>{message}</Paragraph>
        )
      }    </div>
  );
};
