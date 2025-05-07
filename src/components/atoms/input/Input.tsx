import { TInput } from './Input.types';
import styles from './Input.module.scss';
import classNames from 'classnames';

export const Input = (props: TInput) => {
  const { className, hasError, ...rest } = props;
  const inputClasses = classNames(
    className,
    styles.dfInput,
    {
      [styles.dfInput__error]: hasError
    }
  );

  return <input className={inputClasses} {...rest} />;
};