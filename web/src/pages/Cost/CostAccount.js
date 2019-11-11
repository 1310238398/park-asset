import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import styles from './CostAccount.less';
import { catchClause } from '@babel/types';

@connect(state => ({
  global: state.global,
}))
class CostAccount extends PureComponent {
  componentDidMount() {
    
  }

}
export default CostAccount;