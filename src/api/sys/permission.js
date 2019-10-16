import { axios } from '@/utils/request'

const api = {
  permission: '/upms/permission',
  getPermissionTableTree: '/upms/permission/getPermissionTableTree',
  getPermissionMenuTree: '/upms/permission/getPermissionMenuTree'
}

export default api

export function apiGetPermissionTableTree (parameter) {
  return axios({
    url: api.getPermissionTableTree,
    method: 'GET',
    data: parameter
  })
}

export function apiGetPermissionMenuTree (parameter) {
  return axios({
    url: api.getPermissionMenuTree,
    method: 'GET',
    data: parameter
  })
}

export function apiAddPermission (parameter) {
  return axios({
    url: api.permission,
    method: 'POST',
    data: parameter
  })
}

export function apiUpdatePermission (parameter) {
  return axios({
    url: api.permission,
    method: 'PUT',
    data: parameter
  })
}

export function apiDelPermission (id) {
  return axios({
    url: `${api.permission}/${id}`,
    method: 'DELETE'
  })
}
