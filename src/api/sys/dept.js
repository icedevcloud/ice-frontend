import { axios } from '@/utils/request'

const api = {
  dept: '/upms/dept'
}

export default api

export function getDeptTree (parameter) {
  return axios({
    url: `${api.dept}/getDeptTree`,
    method: 'GET',
    data: parameter
  })
}

export function apiAddDept (parameter) {
  return axios({
    url: api.dept,
    method: 'POST',
    data: parameter
  })
}

export function apiUpdateDept (parameter) {
  return axios({
    url: api.dept,
    method: 'PUT',
    data: parameter
  })
}

export function apiDelDept (id) {
  return axios({
    url: `${api.dept}/${id}`,
    method: 'DELETE'
  })
}
