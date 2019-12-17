import request from '../utils/request';
import { stringify } from 'qs';

const router = 'proj-contract-plannings';

export async function queryContractPlanByProj(params){
    return request(`/v1/${router}?q=page&${stringify(params)}`);
}

export async function queryContractStatistic(params){
    return request(`/v1/${router}?q=statistic&${stringify(params)}`)
}

export async function getOneContract(params){
    return request(`/v1/${router}/${params}`);
}

export async function createContractPlanProj(params){
    return request(`/v1/${router}`,{
        method : 'POST',
        body : params
    })
}

export async function deleteContractPlanProj(params){
    return request(`/v1/${router}/${params}`,{
        method : 'DELETE',
    });
}