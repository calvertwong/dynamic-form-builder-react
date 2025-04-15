import { TP } from "./P.types";
import styles from './P.module.scss';
import classNames from "classnames";

export const P = ({ className, children, hasError, messageOccupySpace }: TP) => {
  const pClasses = classNames(
    className,
    styles.dfP,
    {
      [styles.dfP__error]: hasError,
      [styles.dfP__relative]: messageOccupySpace,
      [styles.dfP__absolute]: !messageOccupySpace
    },
  )

  return children && <p className={pClasses}>{children}</p>
}