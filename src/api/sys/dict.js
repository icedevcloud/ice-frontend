import { axios } from '@/utils/request'

const api = {
  dict: '/upms/dict',
  dictPage: '/upms/dict/page',
  dictSubPage: '/upms/dict/subPage'
}

export default api

export function getPageList (parameter) {
  return axios({
    url: api.dictPage,
    method: 'POST',
    data: parameter
  })
}

export function getDictSubList (parameter, id) {
  return axios({
    url: `${api.dictSubPage}/${id}`,
    method: 'POST',
    data: parameter
  })
}

export function apiAddDict (parameter) {
  return axios({
    url: api.dict,
    method: 'POST',
    data: parameter
  })
}

export function apiUpdateDict (parameter) {
  return axios({
    url: api.dict,
    method: 'PUT',
    data: parameter
  })
}

export function apiDelDict (id) {
  return axios({
    url: `${api.dict}/${id}`,
    method: 'DELETE'
  })
}
