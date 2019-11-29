import { stringify } from 'qs';
import request from '../utils/request';
import { async } from 'q';


//土增
const land_value_add = "land-appreciation-taxes";
//查询
export async function queryLandValue(params){
  return request(`/v1/${land_value_add}?${stringify(params)}`);
}
//修改
export async function updateLandValue(params){
  return request(`/v1/${land_value_add}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

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
  return request(`/v1/proj-cost-items?q=tree&show=map&${stringify(params)}`);
}

// 更新成本项数据
export async function updateCostItem(params) {
  // /api/v1/proj-cost-items/{id}
  return request(`/v1/proj-cost-items/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}
// 启用成本项
export async function createCostItem(params) {
 // /api/v1/proj-cost-items
 return request(`/v1/proj-cost-items`, {
  method: 'POST',
  body: params,
});
}

// 忽略成本项
export async function deleteCostItem(record_id) {

 // ​/api​/v1​/proj-cost-items​/{id}
 return request(`/v1/proj-cost-items/${record_id}`, {
  method: 'DELETE',
});


}

//成本支出节点相关接口
// 查询项目下所有的成本支出节点列表
export async function queryCostExpenditureList(record_id) {
  //  /api/v1/proj-expenditures?q=tree
  return request(`/v1/proj-expenditures?q=tree&project_id=${record_id}`);
}
// 创建新的成本支出节点
export async function createCostNode(params) {
  // /api/v1/proj-expenditures
  return request(`/v1/proj-expenditures`, {
    method: 'POST',
    body: params,
  });
}
// 更新节点
export async function updateCostNode(params) {
  // /api/v1/proj-expenditures/{id}
  return request(`/v1/proj-expenditures/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });

}
// 删除节点
export async function deleteCostNode(params) {
  // /api/v1/proj-expenditures/{id}
  return request(`/v1/proj-expenditures/${params}`, {
    method: 'DELETE',
  });
}

// 查询可供节点选择的科目列表
export async function queryCostitems(params) {
 // /api/v1/proj-cost-items?q=node  projectID
 return request(`/v1/proj-cost-items?q=node&projectID=${params}`);
}

// 收益测算相关接口
export async function getCurrentVersionInfo(params) {
 // /api/v1/proj-income-calculations?q=current
 return request(`/v1/proj-income-calculations?q=current&project_id=${params}`);
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

