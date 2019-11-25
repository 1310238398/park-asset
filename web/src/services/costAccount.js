import { stringify } from 'qs';
import request from '../utils/request';

// const router = 'projects';
// const proRouter = 'statistics/project/name';

const sales_plan = 'proj-sales-plans';

// 查询所有的已有的销售计划
export async function querySalesPlan(params) {

 // /api/v1/proj-sales-plans
  return request(`/v1/${sales_plan}?${stringify(params)}`);
}
//创建新的销售计划
export async function createSalesPlan(params) {

 // /api/v1/proj-sales-plans/list
  return request(`/v1/${sales_plan}/list`, {
    method: 'POST',
    body: params,
  });
}
// 更新已有的销售计划
export async function updateSalesPlan(params) {
 // /api/v1/proj-sales-plans/{id}
  return request(`/v1/${sales_plan}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}
// 删除某个季度的销售计划
export async function deletePlan(params) {
  // /api/v1/proj-sales-plans/{id}
    return request(`/v1/${sales_plan}/${params}`, {
    method: 'DELETE',
  });
}



// 成本核算列表相关接口
// 查询成本核算列表
export async function queryCostList(params) {
  return request(`/v1/proj-cost-items?q=tree&${stringify(params)}`);
}

// 更新成本项数据
export async function updateCostItem(params) {
 // /api/v1/proj-cost-items/{id}
 return request(`/v1/proj-cost-items/${params.record_id}`, {
  method: 'PUT',
  body: params,
});

}

// export async function query(params) {
//   return request(`/v1/${router}?${stringify(params)}`);
// }

// export async function get(params) {
//   return request(`/v1/${router}/${params.record_id}`);
// }

// export async function create(params) {
//   return request(`/v1/${router}`, {
//     method: 'POST',
//     body: params,
//   });
// }

// export async function update(params) {
//   return request(`/v1/${router}/${params.record_id}`, {
//     method: 'PUT',
//     body: params,
//   });
// }

// export async function del(params) {
//   return request(`/v1/${router}/${params.record_id}`, {
//     method: 'DELETE',
//   });
// }

// export async function enable(params) {
//   return request(`/v1/${router}/${params.record_id}/enable`, {
//     method: 'PATCH',
//   });
// }

// export async function disable(params) {
//   return request(`/v1/${router}/${params.record_id}/disable`, {
//     method: 'PATCH',
//   });
// }

// export async function companySecond(params) {
//   return request(`/v1/organizations?${stringify(params)}`);
// }

// export async function PoltList(params) {
//   return request(`/v1/plots?${stringify(params)}`);
// }

// export async function queryProList(params) {
//   return request(`/v1/${proRouter}?${stringify(params)}`);
// }

