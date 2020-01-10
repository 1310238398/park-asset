import request from '@/utils/request';
import { stringify } from 'qs';

const router = 'proj-dynamic-cost';

export async function  getDynamicCostProj(params){
    return request(`/v1/${router}?q=costTree&${stringify(params)}`);
}

export async function getDynamicCostProjDetail(params){
    return request(`/v1/${router}/${params.proj_cost_id}`);
    //?${stringify(param)}
}

export async function getDynamicCostProjSetteled(params){  //查询结算信息
    return request(`/v1/${router}/${params}/setteled`);
}

export async function getDynamicCostProjUnsetteled(params){ //查询待结算信息
    return request(`/v1/${router}/${params}/unsettled`);
}

export async function getDynamicCostProjOnApproval(params){  //在途信息
    return request(`/v1/${router}/${params}/on-approval`);
}

export async function getDynamicCostProjPlane(params){ //规划信息
    return request(`/v1/${router}/${params}/plans`);
}

export async function getDynamicCostProjTransfer(params){ //调动信息
    return request(`/v1/${router}/${params}/transfer`);
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
