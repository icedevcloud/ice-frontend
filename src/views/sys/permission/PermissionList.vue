<template>
  <a-card :bordered="false">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">添加</a-button>
      <a-button icon="reload" @click="handleOk">刷新</a-button>
    </div>

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :pagination="false"
      :dataSource="dataSource">
      <span slot="icon" slot-scope="text">
        <a-icon :type="text" />{{ text }}
      </span>

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="$refs.createModal.addSubMenu(record)">添加子菜单</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelPermission(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </a-table>

    <create-form ref="createModal" @ok="handleOk" />
    <edit-form ref="editModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import CreateForm from './modules/CreateForm'
import EditForm from './modules/EditForm'
import { apiGetPermissionTableTree, apiDelPermission } from '@/api/sys/permission'

const statusMap = {
  0: {
    status: 'error',
    text: '禁用'
  },
  1: {
    status: 'success',
    text: '启用'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    CreateForm,
    EditForm
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'id',
          dataIndex: 'id'
        },
        {
          title: '权限名称',
          align: 'center',
          dataIndex: 'title'
        },
        {
          title: '路由名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '前端路径',
          align: 'center',
          dataIndex: 'path'
        },
        {
          title: '组件',
          align: 'center',
          dataIndex: 'component'
        },
        {
          title: '图标',
          dataIndex: 'icon',
          align: 'center',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 向后端拉取可以用的操作列表
      permissionList: null,
      dataSource: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.dataSource = []
      const { code, data, message } = await apiGetPermissionTableTree()
      if (code === 200) {
        this.dataSource = data
      } else {
        this.$message.warning(message)
      }
    },
    handleOk () {
      this.loadData()
    },
    handleEdit (record) {
      this.$refs.editModal.edit(record)
    },
    async handleDelPermission (id) {
      const { code, message } = await apiDelPermission(id)
      if (code === 200) {
        this.loadData()
        this.$message.success('删除成功')
      } else {
        this.$message.warning(message)
      }
    }
  }
}
</script>
