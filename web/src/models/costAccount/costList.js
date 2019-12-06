import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as costAccountService from '@/services/costAccount';
import * as projectManage from '@/services/projectManage';
import { Item } from 'rc-menu';
// 成本核算列表
export default {
  namespace: 'costList',
  state: {
    data: [], // 成本核算列表
    formateData: [], // 当前项目下的所有业态列表
    formatUnitPriceData: [],
    formatTotalPriceData: [],
    treeDepth: [], // 树的深度层级
    

  },
  effects: {

    *fetch({ payload }, { call, put, select }) {
      const params = { ...payload };
      // 请求所有的核算列表
      const response = yield call(costAccountService.queryCostList, params);

      if (response.list && response.list.length >=0) {
        yield put({
        type: 'saveData',
        payload: response.list || [],
      });
      let treeMap = [];
      for (let i = 1; i <= response.level; i++ ) {
        treeMap.push(i);

      }

      yield put(
        {type: 'saveTreeDepth',
        payload: [...treeMap],


        }
      );
      }
      
      const response1 = yield call(projectManage.getProFormat, { record_id: params.projectID });

      if (response1 && response1.list) {

        yield put({
          type: 'saveFormatData',
          payload: response1.list,
        });
       

        yield put({
          type: 'initFormatUnitTotalPriceData',
         
        });

      }
      // 初始化单价 总价的 column

    },
    *initFormatUnitTotalPriceData({ }, { put, select }) {


      let formateDatatemp = yield select(state => state.costList.formateData);
    
      let unitData = [];
      for (let i = 0; i < formateDatatemp.length; i++) {

        let item = {};
        item.title = formateDatatemp[i].name;
        item.dataIndex = formateDatatemp[i].record_id + "_unit";
        item.align = "center";
        item.width = 100;
        item.editable = true;
        item.render = (text, record) => {

        return <div style={{textAlign: "center"}}>{text === undefined ? "": `${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
        };
        unitData.push(item);
      }

      yield put({
        type: 'saveFormatUnitPriceData',
        payload: [...unitData],
      });

      let totalData = [];
      for (let i = 0; i < formateDatatemp.length; i++) {

        let item = {};

        item.title = formateDatatemp[i].name;
        item.dataIndex = formateDatatemp[i].record_id + "_total";
        item.align = "center";
        item.width = 100;
        item.render = (text, record) => {

          return <div style={{textAlign: "center"}}>{ text === undefined ? "":`${text}`.replace(/\B(?<!\.\d)(?<=\d)(?=(\d{3})+\b)/g, ',')}</div>
          };
        totalData.push(item);
      }

      yield put({
        type: 'savFormatTotalPriceData',
        payload: [...totalData],
      });
    }
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveFormatData(state, { payload }) {
      return { ...state, formateData: payload };
    },
    saveFormatUnitPriceData(state, { payload }) {
      return { ...state, formatUnitPriceData: payload };
    },
    savFormatTotalPriceData(state, { payload }) {
      return { ...state, formatTotalPriceData: payload };
    },
    saveTreeDepth(state, { payload }) {
      return {...state, treeDepth: payload};
    }
  }
}