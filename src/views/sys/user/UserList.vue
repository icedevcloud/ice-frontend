<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParams[0].value" placeholder="请输入用户名"/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="昵称">
              <a-input v-model="queryParams[1].value" placeholder="请输入昵称"/>
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="queryParams[2].value" placeholder="请输入手机号"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="邮箱">
                <a-input v-model="queryParams[3].value" placeholder="请输入邮箱"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParams[4].value" placeholder="请选择用户状态查询">
                  <a-select-option value="">请选择用户状态</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="0">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleOk">查询</a-button>
              <a-button style="margin-left: 8px" @click="queryParamReset">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
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
      <span slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" />
      </span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelUser(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </span>
    </table-ext>

    <create-form ref="createModal" @ok="handleOk" />
    <edit-form ref="editModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { TableExt } from '@/components'
import CreateForm from './modules/CreateForm'
import EditForm from './modules/EditForm'
import { getPageList, apiDelUser } from '@/api/sys/user'

const statusMap = {
  0: {
    status: 'error',
    text: '禁用'
  },
  1: {
    status: 'success',
    text: '正常'
  }
}

export default {
  name: 'TableList',
  components: {
    TableExt,
    CreateForm,
    EditForm
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
          column: 'username',
          type: 'eq',
          value: ''
        },
        {
          column: 'nickname',
          type: 'eq',
          value: ''
        },
        {
          column: 'phone',
          type: 'eq',
          value: ''
        },
        {
          column: 'email',
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
          title: '用户名',
          align: 'center',
          dataIndex: 'username'
        },
        {
          title: '昵称',
          align: 'center',
          dataIndex: 'nickname'
        },
        {
          title: '头像',
          align: 'center',
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '邮箱',
          align: 'center',
          dataIndex: 'email'
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
          dataIndex: 'gmtCreate'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'gmtModified'
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
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    async handleDelUser (id) {
      const { code, message } = await apiDelUser(id)
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
