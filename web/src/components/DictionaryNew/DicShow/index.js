import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { queryTree } from '../../../services/dictionary';

export default class DicShow extends Component {
  static propTypes = {
    // 指定列表访问编码
    pcode: PropTypes.string.isRequired,
    // 指定加载的编码
    code: PropTypes.array.isRequired,
    // 渲染函数
    show: PropTypes.func,
  };

  static defaultProps = {
    show: null,
  };

  constructor(props) {
    super(props);
    const { pcode } = this.props;
    this.state = { data: [], refresh: false };
    const data = this.loadData();
    if (data) {
      this.state.data = data;
      return;
    }
    queryTree({ q: 'tree', parent_code: pcode }).then(sdata => {
      this.save(sdata.list);
      this.updateValue(sdata.list);
    });
  }

  shouldComponentUpdate(nextProps) {
    const { pcode } = this.props;
    if (nextProps.pcode !==pcode) {
      this.refreshValue(nextProps.pcode);
    }
    return true;
  }

  v2n = sdata => {
    const { code } = this.props;
    return code.map(item => sdata[item]);
  };

  loadData = () => {
    const { pcode } = this.props;
    return JSON.parse(window.sessionStorage.getItem(`dicshow|${pcode}`));
  };

  updateValue = sdata => {
    this.setState({ data: sdata });
  };

  fetch = () => {
    const { pcode } = this.props;
    const data = this.loadData();
    if (data) {
      const { refresh } = this.state;
      this.setState({ data, refresh: !refresh });
      return;
    }
    queryTree({ q: 'tree', parent_code: pcode }).then(rdata => {
      this.save(rdata.list);
      this.updateValue(rdata.list);
    });
  };

  refreshValue = () => {
    const data = this.loadData();
    if (!data) {
      this.fetch();
    } else {
      this.updateValue(data);
    }
  };

  save = data => {
    const { pcode } = this.props;
    let sdata = {};
    for (const t of data) {
      sdata[t.code] = t.name;
    }
    window.sessionStorage.setItem(`dicshow|${pcode}`, JSON.stringify(sdata));
  };

  eq2array = (a1, a2) => {
    if (!a1 === !a2) {
      return false;
    }
    if (!a1 || !a2) {
      return false;
    }
    if (a1.length !== a2.length) {
      return false;
    }
    if (a1.join(',') !== a2.join(',')) {
      return false;
    }
    return true;
  };

  render() {
    const { code } = this.props;
    if (!code || code.length === 0) {
      return '';
    }
    const data = this.loadData();
    const show = this.props.show || (name => <span key={name}>{name}</span>);

    return code.map((item, index) => {
      const k = `${item}_${index}`;
      if (data) {
        let v = item;
        if (typeof v === 'boolean') {
          v = v ? 'true' : 'false';
        }
        if (item in data) {
          v = data[item];
        }
        // return show(v, item);
        const out = show(v, item);

        return <span key={k}>{out}</span>;
      }
      const out = show(item, item);
      return <span key={k}>{out}</span>;
    });
  }
}
