import { stringify } from 'qs';
import request from '@/utils/request';

const router = 'statistics';

// 查询分类占比
export async function queryClasstify(params) {
  return request(`/v1/${router}/income_classification?${stringify(params)}`);
}

// 查询集团运营指标
export async function queryOperational(params) {
  return request(`/v1/${router}/operational_indicator?${stringify(params)}`);
}

// 查询年度计划收入概览/api/v1/statistics/overview
export async function queryOverview(params) {
  return request(`/v1/${router}/overview?${stringify(params)}`);
}

// 查询年度计划收入概览/api/v1/statistics/financiall_indicator
export async function queryFinanciall(params) {
  return request(`/v1/${router}/financiall_indicator?${stringify(params)}`);
}

// 查询查询季度财务指标统计概览/api​/v1​/statistics​/quarter_financiall_indicator
export async function queryQuarterFinanciall(params) {
  return request(`/v1/${router}/quarter_financiall_indicator?${stringify(params)}`);
}
// 查询子公司列表/api/v1/statistics/company
export async function queryCompanyList(params) {
  return request(`/v1/${router}/company?${stringify(params)}`);
}
