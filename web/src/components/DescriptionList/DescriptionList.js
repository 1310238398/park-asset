import React from 'react';
import classNames from 'classnames';
import { Row } from 'antd';
import styles from './index.less';

export default ({
  className,
  title,
  col = 3,
  layout = 'horizontal',
  gutter = 32,
  children,
  size,
  ...restProps
}) => {
  const clsString = classNames(styles.descriptionList, styles[layout], className, {
    [styles.descriptionListSmall]: size === 'small',
    [styles.descriptionListLarge]: size === 'large',
  });
  const column = col > 4 ? 4 : col;
  return (
    <div className={clsString} {...restProps}>
      {title ? <div className={styles.title}>{title}</div> : null}
      <Row gutter={gutter}>
        {React.Children.map(children, child => {
          if (child) {
            return React.cloneElement(child, { column });
          }
          return child;
        })}
      </Row>
    </div>
  );
};
