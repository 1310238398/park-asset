import { stringify } from 'qs';
import request from '@/utils/request';

const router = 'organizations';
const routerPro = 'projects';
const designChangeRouter = 'com-contract-alter';
const DesignRouter = 'com-contract';
const routerT = 'dictionaries';
export async function queryDesignChangePage(params,proID) {
  return request(`/v1/${designChangeRouter}/designsbyproject/${proID}?${stringify(params)}`);
}

// 查询单条数据
export async function getDesignChangeOne(params) {
  return request(`/v1/${designChangeRouter}/design/${params.record_id}`);
}

// 查询项目ID和名字
export async function selectProInfo(params) {
  console.log(params)
  return request(`/v1/${routerPro}/${params.ID}`);
}

// 更新保存设计变更
export async function updateDesignChange(params) {
  return request(`/v1/${designChangeRouter}/design/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

// 创建设计变更
export async function createDesignChange(params) {
  return request(`/v1/${designChangeRouter}/design`, {
    method: 'POST',
    body: params,
  });
}

// 删除设计变更
export async function delDesignChange(params) {
  return request(`/v1/${designChangeRouter}/design/${params.record_id}`, {
    method: 'DELETE',
  });
}

// 获取字典项的变更原因
export async function queryChangeReason(params) {
  return request(`/v1/dictionaries?${stringify(params)}`);
}
// commitDesignChange
// 提交审核
export async function commitDesignChange(params) {
  return request(`/v1/${designChangeRouter}/design/${params.id}/commit`, {
    method: 'PUT',
  });
}

// 设计变更确认
export async function commitSureChange(params,id) {
  return request(`/v1/${designChangeRouter}/design/${id}/affirm`, {
    method: 'PUT',
    body: params
  });
}