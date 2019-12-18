import { stringify } from 'qs';
import request from '../utils/request';
import { async } from 'q';


//------土增
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

//----资本化利息
const proj_capitalized = "proj-capitalized-interests";
// /api/v1/proj-capitalized-interests?q=year&projectID=6dc94eb7-4675-44f2-9323-312ff965985
//查询
export async function queryCapitalized(params){
  return request(`/v1/${proj_capitalized}?${stringify(params)}`);
}

//修改---
export async function updateCapitalized(params){
  return request(`/v1/${proj_capitalized}`,{
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

//根据项目查找成本项

export async function queryCostItemByPro(projId){
  return request(`/v1/proj-cost-items?q=contract&project_id=${projId}`);
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
 return request(`/v1/proj-income-calculations?q=current&projectID=${params}`);
}

// 修改当前版本的数据信息
export async function updateCurrentVersionInfo(params, record_id) {

  
  return request(`/v1/proj-income-calculations/${record_id}`, {
    method: 'PUT',
    body: params,
  });
}
// 查询历史版本列表
export async function queryHisVersionList(params) {
  // /api/v1/proj-income-calculations?q=list&projectID=&flag=2
  return request(`/v1/proj-income-calculations?q=list&${stringify(params)}`);
}

// 查询某一个历史版本的详情
export async function queryHisVersionDetail(record_id) {
  // /api/v1/proj-income-calculations/{id}
  return request(`/v1/proj-income-calculations/${record_id}`);
}

// 保存版本前 先查询
export async function queryBeforeSaveVersion(params) {
 //  /api/v1/proj-version/:id/compare
 return request(`/v1/proj-version/${params.project_id}/compare?list=${params.list}`);
}

// 保存旧版本（创建版本的时候覆盖上一版本）
export async function saveOldVersion(params) {
 // /api/v1/proj-version/:id
  return request(`/v1/proj-version/${params.project_id}`, {
    method: 'PUT',
    body: params.body,
  });
}
// 创建新版本
export async function saveNewVersion(params) {
  return request(`/v1/proj-version/${params.project_id}`, {
    method: 'POST',
    body: params.body,
  });
}
// 提交审核
export async function submitAudit(project_id) {
  // /api/v1/proj-version/:id/apply
  return request(`/v1/proj-version/${project_id}/apply`, {
    method: 'PUT', 
    body: {},
  });
}
// 通过审核
export async function auditPass(project_id) {
 // /api/v1/proj-version/:id/pass
 return request(`/v1/proj-version/${project_id}/pass`, {
  method: 'PUT', 
  body: {},
});
}

// 审核驳回
export async function auditRejected(project_id) {
  // /api/v1/proj-version/:id/reject
  return request(`/v1/proj-version/${project_id}/reject`, {
   method: 'PUT', 
   body: {},
 });
 }

// 查询项目列表树状结构（treeselect用）
export async function queryProTree(params) {
  // /api/v1/pc-projects?q=nodes
  return request(`/v1/pc-projects?${stringify(params)}`);
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

