import React, { PureComponent } from 'react';
import { Statistic, Select, Progress } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import topBg from '../../assets/topBg@2x.png';
import pointIMG from '../../assets/ponint.png';
import lineCompany from '../../../public/assets/companyFG@2x.png';
import DataCompanyShow from './DataCompanyShow';
import JTCWJB from './JTCWJB';
import YYZB from './YYZB';
import JTYYZB from './JTYYZB';
import NDJHSR from './NDJHSR';
import XMGK from './XMGK';
import CWZBJK from './CWZBJK';
import IncomeGauge from './IncomeGauge';
import styles from './DataDashboad.less';
import { PoltList } from '@/services/projectManage';
import { formatNumber } from '@/utils/utils';

@connect(state => ({
  dataDashboad: state.dataDashboad,
  loading: state.loading.models.dataDashboad,
}))
class DataDashboad extends PureComponent {
  state = {
    year: '2019',
    name: '',
    quarter: 1,
    org_id: '',
  };

  componentWillMount() {
    this.getQuarterByMonth();
  }

  componentDidMount() {
    PoltList({ q: 'list' }).then(data => {
      this.loadMap(data.list || []);
    });
    this.queryCompanyListBtom();

    setTimeout(() => {
      document.documentElement.webkitRequestFullScreen();
    }, 100);
  }

  getQuarterByMonth() {
    var today = new Date();
    var month = today.getMonth() + 1; //getMonth返回0-11
    if (month >= 1 && month <= 3) return this.setState({ quarter: 1 });
    if (month >= 4 && month <= 6) return this.setState({ quarter: 2 });
    if (month >= 7 && month <= 9) return this.setState({ quarter: 3 });
    if (month >= 10 && month <= 12) return this.setState({ quarter: 4 });
  }

  queryCompanyListBtom() {
    this.dispatch({
      type: 'dataDashboad/queryCompanyList',
      params: { year: this.state.year },
    });
  }

  loadMap = data => {
    var map = new window.AMap.Map('mainMap', {
      center: [116.997777, 36.651474],
      zoom: 10,
      mapStyle: 'amap://styles/17f9720c805edf05b040364bd845f083',
    });

    var markers = []; //province见Demo引用的JS文件
    for (var i = 0; i < data.length; i += 1) {
      var marker;

      var icon = new AMap.Icon({
        // image: 'https://vdata.amap.com/icons/b18/1/2.png',
        image: pointIMG,
        size: new AMap.Size(38, 38),
        // imageSize: new AMap.Size(38, 38),
        imageOffset: new AMap.Pixel(-3, -3),
      });
      marker = new AMap.Marker({
        icon: icon,
        position: data[i].location.split(','),
        offset: new AMap.Pixel(-12, -12),
        zIndex: 101,
        title: data[i].name,
        map: map,
      });
    }
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleChange = e => {
    this.setState({ year: e }, () => {
      this.queryCompanyListBtom();
    });
  };

  getYearSelect = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative',
          top: '0.68vh',
          left: '3.44vw',
        }}
      >
        <Select
          className="darkSelect"
          dropdownClassName={styles.darkDropdown}
          defaultValue="2019"
          onChange={e => this.handleChange(e)}
        >
          <Select.Option value="2019">2019</Select.Option>
          <Select.Option value="2020">2020</Select.Option>
        </Select>
      </div>
    );
  };

  // 显示弹窗-子公司信息
  showCompany = item => {
    this.dispatch({
      type: 'dataDashboad/LoadCompangShow',
      payload: {
        id: item.org_id,
        year: this.state.year,
      },
    });
    this.setState({ name: item.org_name });
    this.setState({ org_id: item.org_id });
  };

  handleFormCancel = () => {
    this.dispatch({
      type: 'dataDashboad/changeShowCompany',
      payload: false,
    });
  };

  // 监听显示弹窗
  renderDataCompanyShow() {
    return (
      <DataCompanyShow
        onCancel={this.handleFormCancel}
        org_id={this.state.org_id}
        year={this.state.year}
        quarter={this.state.quarter}
        title={this.state.name}
      />
    );
  }

  handleLocation = () => {
    router.push('/');
  };

  render() {
    const { year, quarter } = this.state;
    const {
      dataDashboad: { companyList },
    } = this.props;

    return (
      <div className={styles.main}>
        <div>
          <img src={topBg} className={styles.top} alt="" />
        </div>
        <div className={styles.topCenter}>
          <div>{this.getYearSelect()}</div>
          <span className={styles.topMiddleTitle}>济南高新控股集团资产运营数据看板</span>
        </div>
        <div className={styles.middleCenter}>
          <div>
            <div className={styles.leftTopOne}>
              <div className={styles.leftTopOneTitle}>
                <span>集团资产收入占比</span>
              </div>
              <div className={styles.leftTopOneChart}>
                <JTCWJB
                  height={((41.66 - 1.56 - 2.68) / 100) * window.innerHeight - 50}
                  params={{ year }}
                />
              </div>
            </div>
            <JTYYZB params={{ year }} />
          </div>
          <div className={styles.YearLinr}>
            <div className={styles.yearPlan}>
              <NDJHSR params={{ year }} />
            </div>
            <div className={styles.mapData}>
              <div id="mainMap" style={{ width: '100%', height: '100%' }}></div>
            </div>
            <div>
              <XMGK params={{ year }} />
            </div>
          </div>
          <div>
            <div className={styles.leftTopOneRight}>
              <div className={styles.rightTopOneTitle}>
                <span>集团财务指标监控</span>
              </div>
              <CWZBJK params={{ year, quarter }} />
              <div className={styles.leftRightOneChart}>
                <YYZB
                  height={
                    ((64.26 - 0.25 - 3.89 - 7.04 - 1.61 - 1.68) / 100) * window.innerHeight - 50
                  }
                  params={{ year }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.pageBottm}>
          {companyList &&
            companyList.map(v => {
              return [
                <div className={styles.companyLinst} onClick={() => this.showCompany(v)}>
                  <p className={styles.companyName} title={v.org_name}>
                    {v.org_name}
                  </p>
                  <IncomeGauge
                    data={v}
                    height={((21.11 - 1.24 - 1.66 - 1.31) / 100) * window.innerHeight - 10}
                  />
                  <p className={styles.companyPlan}>
                    年收入计划 {formatNumber(v.plan_income, 100 * 10000, 2)}万元
                  </p>
                </div>,
                <div className={styles.lineC}>
                  <img src={lineCompany} className={styles.lineCompany} alt="" />
                </div>,
              ];
            })}
        </div>
        {this.renderDataCompanyShow()}
      </div>
    );
  }
}
export default DataDashboad;
