import React, { PureComponent } from 'react';
import { Statistic, Select, Progress } from 'antd';
import { connect } from 'dva';
import topBg from '../../assets/topBg@2x.png';
import DataCompanyShow from './DataCompanyShow';
import JTCWJB from './JTCWJB';
import YYZB from './YYZB';
import JTYYZB from './JTYYZB';
import NDJHSR from './NDJHSR';
import XMGK from './XMGK';
import CWZBJK from './CWZBJK';
import styles from './DataDashboad.less';

@connect(({ dataDashboad, loading }) => ({
  dataDashboad,
  loading: loading.models.dataDashboad,
}))
class DataDashboad extends PureComponent {
  state = {
    year: '2019',
    name: '',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadMap();

    this.dispatch({
      type: 'dataDashboad/queryCompanyList',
      params: { year: this.state.year },
    });
  }

  loadMap = () => {
    var map = new window.AMap.Map('mainMap', {
      center: [117.000923, 36.675807],
      zoom: 14,
      mapStyle: 'amap://styles/17f9720c805edf05b040364bd845f083',
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  handleChange = e => {
    this.setState({ year: e });
  };

  getYearSelect = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative',
          // top: '0.68vh',
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
  };

  handleFormCancel = () => {
    this.dispatch({
      type: 'dataDashboad/changeShowCompany',
      payload: false,
    });
  };

  // 监听显示弹窗
  renderDataCompanyShow() {
    const {
      dataDashboad: { comPanyId },
    } = this.props;
    return (
      <DataCompanyShow
        onCancel={this.handleFormCancel}
        org_id={comPanyId}
        year={this.state.year}
        title={this.state.name}
      />
    );
  }

  render() {
    const { year } = this.state;
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
          <span>济南高新控股集团资产运营数据看板</span>
        </div>
        <div className={styles.middleCenter}>
          <div>
            <div className={styles.leftTopOne}>
              <div className={styles.leftTopOneTitle}>
                <span>集团资产收入占比</span>
              </div>
              <div className={styles.leftTopOneChart}>
                <JTCWJB height={280} params={{ year }} />
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
              <CWZBJK params={{ year }} />
              <div className={styles.leftRightOneChart}>
                <YYZB height={350} params={{ year }} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.pageBottm}>
          {companyList &&
            companyList.map(v => {
              return (
                <div className={styles.companyLinst} onClick={() => this.showCompany(v)}>
                  <p className={styles.companyName}>{v.org_name}</p>
                  {/* <img src={topBg} className={styles.companyImg} alt="" /> */}
                  {/* <ChilrenWC /> */}
                  <Progress
                    type="circle"
                    strokeColor={{
                      '0%': '#162A61',
                      '100%': '#0088CE',
                    }}
                    percent={v.actual_income / v.plan_income}
                    showInfo
                    className="cirleDb"
                    width="6.26vw"
                    height="6.53vh"
                    format={percent => (
                      <span style={{ color: '#fff', fontSize: 12 }}>
                        已完成
                        <br />
                        {v.actual_income / 10000} 万元
                      </span>
                    )}
                  />
                  <p className={styles.companyPlan}>年入收入计划 {v.plan_income / 10000}万元</p>
                </div>
              );
            })}
        </div>
        {this.renderDataCompanyShow()}
      </div>
    );
  }
}
export default DataDashboad;
