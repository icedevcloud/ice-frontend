import { axios } from '@/utils/request'

const api = {
  dept: '/report'
}

export default api

export function apiExecuteSql (parameter) {
  return axios({
    url: `${api.dept}/executeSql`,
    method: 'POST',
    data: parameter
  })
}