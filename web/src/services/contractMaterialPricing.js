import { stringify } from 'qs';
import request from '@/utils/request';

const router = 'organizations';
const routerPro = 'projects';
const stuffpriceRouter = 'com-contract-alter';
const routerT = 'dictionaries';
export async function queryMaterialPricingPage(params,proID) {
  return request(`/v1/${stuffpriceRouter}/stuffpricesbyproject/${proID}?${stringify(params)}`);
}

// 查询单条数据
export async function getMaterialPricingOne(params) {
  return request(`/v1/${stuffpriceRouter}/stuffprice/${params.record_id}`);
}

// 查询项目ID和名字
export async function selectProInfo(params) {
  return request(`/v1/${routerPro}/${params.ID}`);
}

// 更新保存
export async function updateMaterialPricing(params) {
  return request(`/v1/${stuffpriceRouter}/stuffprice/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

// 创建
export async function createMaterialPricing(params) {
  return request(`/v1/${stuffpriceRouter}/stuffprice`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function delMaterialPricing(params) {
  return request(`/v1/${stuffpriceRouter}/stuffprice/${params.record_id}`, {
    method: 'DELETE',
  });
}

// 获取字典项的变更原因
export async function queryChangeReason(params) {
  return request(`/v1/dictionaries?${stringify(params)}`);
}

// 提交审核
export async function commitMaterialPricing(params) {
  return request(`/v1/${stuffpriceRouter}/stuffprice/${params.id}/commit`, {
    method: 'PUT',
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

