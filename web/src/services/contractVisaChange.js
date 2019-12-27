import { stringify } from 'qs';
import request from '@/utils/request';

const router = 'organizations';
const routerPro = 'projects';
const visaRouter = 'com-contract-alter';
const routerT = 'dictionaries';
export async function queryVisaChangePage(params,proID) {
  return request(`/v1/${visaRouter}/signsbyproject/${proID}?${stringify(params)}`);
}

// 查询单条数据
export async function getVisaChangeOne(params) {
  return request(`/v1/${visaRouter}/sign/${params.record_id}`);
}

// 查询项目ID和名字
export async function selectProInfo(params) {
  return request(`/v1/${routerPro}/${params.ID}`);
}

// 更新保存
export async function updateVisaChange(params) {
  return request(`/v1/${visaRouter}/sign/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

// 创建
export async function createVisaChange(params) {
  return request(`/v1/${visaRouter}/sign`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function delVisaChange(params) {
  return request(`/v1/${visaRouter}/sign/${params.record_id}`, {
    method: 'DELETE',
  });
}


// 获取字典项的变更原因
export async function queryChangeReason(params) {
  return request(`/v1/dictionaries?${stringify(params)}`);
}

// 提交审核
export async function commitVisaChange(params) {
  return request(`/v1/${visaRouter}/sign/${params.id}/commit`, {
    method: 'PUT',
  });
}
// 签证确认
export async function commitSureChange(params,id) {
  return request(`/v1/${visaRouter}/sign/${id}/affirm`, {
    method: 'PUT',
    body: params
  });
}

// 查询往来企业单条数据
export async function getCompanyOne(params) {
  return request(`/v1/business-partners/${params.record_id}`);
}
// 查询乙方单位
export async function query(params) {
  return request(`/v1/business-partners?${stringify(params)}`);
}
