<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="角色名">
              <a-input v-model="queryParams[0].value" placeholder="请输入角色名"/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="角色编码">
              <a-input v-model="queryParams[1].value" placeholder="请输入角色编码"/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParams[2].value" placeholder="请选择角色状态查询">
                <a-select-option value="">请选择角色状态</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleOk">查询</a-button>
              <a-button style="margin-left: 8px" @click="queryParamReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">添加</a-button>
    </div>

    <table-ext
      ref="table"
      size="default"
      bordered
      rowKey="id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
    >
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
                <a @click="$refs.authModal.add(record)">授权</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelRole(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </table-ext>

    <create-form ref="createModal" @ok="handleOk" />
    <edit-form ref="editModal" @ok="handleOk" />
    <auth-form ref="authModal"></auth-form>
  </a-card>
</template>

<script>
import { TableExt } from '@/components'
import CreateForm from './modules/CreateForm'
import EditForm from './modules/EditForm'
import AuthForm from './modules/AuthForm'
import { getPageList, apiDelRole } from '@/api/sys/role'

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
    TableExt,
    CreateForm,
    EditForm,
    AuthForm
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParams: [
        {
          column: 'name',
          type: 'eq',
          value: ''
        },
        {
          column: 'roleCode',
          type: 'eq',
          value: ''
        },
        {
          column: 'status',
          type: 'eq',
          value: ''
        }
      ],
      initQueryParams: [],
      // 表头
      columns: [
        {
          title: 'ID',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '角色名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '角色编码',
          align: 'center',
          dataIndex: 'roleCode'
        },
        {
          title: '描述',
          align: 'center',
          dataIndex: 'description'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPageList({ ...parameter, queryParams: this.queryParams }).then(res => {
          return res.data
        })
      }
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
    this.initQueryParams = JSON.parse(JSON.stringify(this.queryParams))
  },
  methods: {
    handleOk () {
      this.$refs.table.refresh()
    },
    handleEdit (record) {
      this.$refs.editModal.edit(record)
    },
    queryParamReset () {
      this.queryParams = JSON.parse(JSON.stringify(this.initQueryParams))
      this.handleOk()
    },
    async handleDelRole (id) {
      const { code, message } = await apiDelRole(id)
      if (code === 200) {
        this.handleOk()
        this.$message.success('删除成功')
      } else {
        this.$message.warning(message)
      }
    }
  }
}
</script>
