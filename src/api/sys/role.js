import { axios } from '@/utils/request'

const api = {
  role: '/upms/role',
  rolePage: '/upms/role/page',
  permissionTree: '/upms/role/permissionTree',
  updateRolePermission: '/upms/role/updateRolePermission',
  queryRole: '/upms/role/queryRole'
}

export default api

export function getRoleList (parameter) {
  return axios({
    url: api.rolePage,
    method: 'POST',
    data: parameter
  })
}

export function apiAddRole (parameter) {
  return axios({
    url: api.role,
    method: 'POST',
    data: parameter
  })
}

export function apiUpdateRole (parameter) {
  return axios({
    url: api.role,
    method: 'PUT',
    data: parameter
  })
}

export function apiPermissionTree (id) {
  return axios({
    url: api.permissionTree + `/${id}`,
    method: 'GET'
  })
}

export function apiUpdateRolePermission (parameter) {
  return axios({
    url: api.updateRolePermission,
    method: 'PUT',
    data: parameter
  })
}

export function apiQueryRole (parameter) {
  return axios({
    url: api.queryRole,
    method: 'GET',
    params: parameter
  })
}

export function apiDelRole (id) {
  return axios({
    url: `${api.role}/${id}`,
    method: 'DELETE'
  })
}
