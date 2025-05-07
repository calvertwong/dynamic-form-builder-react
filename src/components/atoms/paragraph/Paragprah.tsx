import { TParagraph } from './Paragraph.types';
import styles from './Paragraph.module.scss';
import classNames from 'classnames';

export const Paragraph = (props: TParagraph) => {
  const { className, children, hasError, messageOccupySpace } = props;

  const pClasses = classNames(
    className,
    styles.dfParagraph,
    {
      [styles.dfParagraph__error]: hasError,
      [styles.dfParagraph__relative]: messageOccupySpace,
      [styles.dfParagraph__absolute]: !messageOccupySpace
    },
  );

  return children && <p className={pClasses}>{children}</p>;
};