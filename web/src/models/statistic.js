import * as statisticService from '@/services/statistic';

export default {
  namespace: 'statistic',
  state: {
    search: {},
    exportSearch: {},
    pagination: {},
    data: {
      list: [],
      pagination: {},
    },

    submitting: false,
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
  },
  effects: {
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {};
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select(state => state.statistic.search);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.statistic.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(statisticService.queryPage, params);

      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    // *exportData({ search }, { call, put, select }) {
    //   let params = {};
    //   if (search) {
    //     params = { ...params, ...search };
    //     yield put({
    //       type: 'saveExportSearch',
    //       payload: search,
    //     });
    //   } else {
    //     const s = yield select(state => state.statistic.exportSearch);
    //     if (s) {
    //       params = { ...params, ...s };
    //     }
    //   }
    //   const response = yield call(statisticService.exportData, params);
    //   const blob = new Blob([response.data], {
    //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
    //   });
    //   const a = document.createElement('a'); // 创建a标签
    //   const url = window.URL.createObjectURL(blob); // 创建下载的链接
    //   let filename = response.headers['content-disposition'];
    //   if (filename) {
    //     filename = filename.match(/"(.*)"/)[1]; // 提取文件名
    //     filename = decodeURI(filename);
    //     a.href = url;
    //     a.download = filename; // 给下载下来的文件起个名字
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a); // 下载完成移除元素
    //     window.URL.revokeObjectURL(url);
    //     // a = null;
    //   }
    // },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    savePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
    saveExportSearch(state, { payload }) {
      return { ...state, exportSearch: payload };
    },
  },
};
