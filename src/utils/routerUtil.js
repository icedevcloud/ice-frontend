import { axios } from '@/utils/request'
// import { asyncRouterMap } from '@/config/router.config'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  // 你需要动态引入的页面组件
  analysis: () => import('@/views/dashboard/Analysis'),
  workplace: () => import('@/views/dashboard/Workplace'),
  monitor: () => import('@/views/dashboard/Monitor'),
  SysUserList: () => import('@/views/sys/user/UserList'),
  SysRoleList: () => import('@/views/sys/role/RoleList'),
  SysPermissionList: () => import('@/views/sys/permission/PermissionList'),
  SysDict: () => import('@/views/sys/dict/DictList'),
  SysDept: () => import('@/views/sys/dept/DeptList'),
  DrawReport: () => import('@/views/report/drawReport/DrawReport'),
  showReport: () => import('@/views/report/showReport/ReportList')
  // ...more
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: '/upms/permission/getRouterByUser',
    method: 'get'
    /* headers: {
      'Access-Token': 'xxx'
    }
    */
  })
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // ajax
    getRouterByUser().then(res => {
      const result = res.data
      let routers = generator(result)
      routers.unshift(firstRouter)
      routers.push(lastRouter)
      console.log('routers', routers)
      routers = generateIndexRouter(routers)
      routers.push(notFoundRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.key],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, permission: item.key && [ item.key ] || null, keepAlive: item.cache },
      // hidden	控制路由是否显示在 sidebar	boolean	false
      hidden: item.hidden

    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 生成首页路由
 * @param data
 * @returns {Array}
 */
export function generateIndexRouter (data) {
  const indexRouter = [{
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard',
    children: data
  }]
  return indexRouter
}

const firstRouter = {
  path: '/dashboard',
  name: 'dashboard',
  component: constantRouterComponents.workplace,
  meta: { title: '首页', keepAlive: true, icon: 'home', permission: ['dashboard'] }
}

const lastRouter = {
  path: '/account',
  component: RouteView,
  redirect: '/account/center',
  name: 'account',
  meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] },
  children: [
    {
      path: '/account/center',
      name: 'center',
      component: () => import('@/views/account/center/Index'),
      meta: { title: '个人中心', keepAlive: true, permission: ['user'] }
    },
    {
      path: '/account/settings',
      name: 'settings',
      component: () => import('@/views/account/settings/Index'),
      meta: { title: '个人设置', hideHeader: true, permission: ['user'] },
      redirect: '/account/settings/base',
      hideChildrenInMenu: true,
      children: [
        {
          path: '/account/settings/base',
          name: 'BaseSettings',
          component: () => import('@/views/account/settings/BaseSetting'),
          meta: { title: '基本设置', hidden: true, permission: ['user'] }
        },
        {
          path: '/account/settings/security',
          name: 'SecuritySettings',
          component: () => import('@/views/account/settings/Security'),
          meta: { title: '安全设置', hidden: true, keepAlive: true, permission: ['user'] }
        },
        {
          path: '/account/settings/custom',
          name: 'CustomSettings',
          component: () => import('@/views/account/settings/Custom'),
          meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: ['user'] }
        },
        {
          path: '/account/settings/binding',
          name: 'BindingSettings',
          component: () => import('@/views/account/settings/Binding'),
          meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: ['user'] }
        },
        {
          path: '/account/settings/notification',
          name: 'NotificationSettings',
          component: () => import('@/views/account/settings/Notification'),
          meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: ['user'] }
        }
      ]
    }
  ]
}
