import request from '@/utils/request';
import { stringify } from 'qs';

const router = 'proj-dynamic-cost';

export async function  getDynamicCostProj(params){
    return request(`/v1/${router}?q=costTree&${stringify(params)}`);
}

export async function getDynamicCostProjDetail(params,param){
    return request(`/v1/${router}/${params.proj_cost_id}?${stringify(param)}`);
}

export async function getDynamicCostProjSetteled(params,param){  //查询结算信息
    return request(`/v1/${router}/${params}/setteled?${stringify(param)}`);
}

export async function getDynamicCostProjUnsetteled(params,param){ //查询待结算信息
    return request(`/v1/${router}/${params}/unsettled?${stringify(param)}`);
}

export async function getDynamicCostProjOnApproval(params,param){
    return request(`/v1/${router}/${params}/on-approval?${stringify(param)}`);
}

export async function getDynamicCostProjPlane(params,param){
    return request(`/v1/${router}/${params}/plans?${stringify(param)}`);
}

//成本调动
//查询项目下的科目列表。
export async function getCostMoveSubjectList(param){  
    return request(`/v1/${router}?q=costSimpleTree&${stringify(param)}`);
}

//调动的科目列表和合同
export async function getCostMoveTree(param){
    return request(`/v1/${router}?q=simpleTree&${stringify(param)}`);
}
