import { axios } from '@/utils/request'

const api = {
  user: '/upms/user',
  userPage: '/upms/user/page',
  userRolesInfo: '/upms/user/userRolesInfo'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.userPage,
    method: 'POST',
    data: parameter
  })
}

export function apiAddUser (parameter) {
  return axios({
    url: api.user,
    method: 'POST',
    data: parameter
  })
}

export function apiUpdateUser (parameter) {
  return axios({
    url: api.user,
    method: 'PUT',
    data: parameter
  })
}

export function apiUpdateMyUser (parameter) {
  return axios({
    url: `${api.user}/updateUser`,
    method: 'PUT',
    data: parameter
  })
}

export function apiUserRolesInfo (id) {
  return axios({
    url: api.userRolesInfo + `/${id}`,
    method: 'GET'
  })
}

export function apiDelUser (id) {
  return axios({
    url: `${api.user}/${id}`,
    method: 'DELETE'
  })
}

export function apiGetUserInfo () {
  return axios({
    url: `${api.user}/getUserInfo`,
    method: 'GET'
  })
}
