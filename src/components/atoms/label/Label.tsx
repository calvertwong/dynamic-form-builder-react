import classNames from 'classnames';
import styles from './Label.module.scss';
import { TLabel } from './Label.types';

export const Label = (props: TLabel) => {
  const { className, children, htmlFor, hasError } = props;

  const labelClasses = classNames(
    className,
    styles.dfLabel,
    {
      [styles.dfLabel__error]: hasError
    }
  );

  return children && <label className={labelClasses} htmlFor={htmlFor}>{children}</label>;
};