<template>
  <a-drawer
    title="字典项"
    :width="1200"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParams[0].value" placeholder="请输入名称"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-item label="值">
              <a-input v-model="queryParams[1].value" placeholder="请输入值"/>
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
      <a-button type="primary" icon="plus" @click="() => $refs.createModal.addSub(this.pid, this.optType)">添加</a-button>
    </div>

    <table-ext
      ref="table"
      size="default"
      bordered
      rowKey="id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
      :scroll="{ x: 1200 }"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelDict(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </span>
    </table-ext>

    <create-form ref="createModal" @ok="handleOk" />
    <edit-form ref="editModal" @ok="handleOk" />
  </a-drawer>
</template>

<script>
import { TableExt } from '@/components'
import CreateForm from './CreateForm'
import EditForm from './EditForm'
import { getDictSubList, apiDelDict } from '@/api/sys/dict'

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
  components: {
    TableExt,
    CreateForm,
    EditForm
  },
  data () {
    return {
      // 查询参数
      queryParams: [
        {
          column: 'name',
          type: 'eq',
          value: ''
        },
        {
          column: 'type',
          type: 'eq',
          value: ''
        }
      ],
      initQueryParams: [],
      columns: [
        {
          title: 'ID',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type'
        },
        {
          title: '字典编码',
          align: 'center',
          dataIndex: 'code'
        },
        {
          title: '数据值',
          align: 'center',
          dataIndex: 'value'
        },
        {
          title: '排序号',
          align: 'center',
          dataIndex: 'sort'
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
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getDictSubList({ ...parameter, queryParams: this.queryParams }, this.pid).then(res => {
          return res.data
        })
      },
      visible: false,
      isLoadData: false,
      pid: '',
      optType: ''
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
    init (record) {
      this.pid = record.id
      this.optType = record.type
      this.$nextTick(() => {
        if (this.isLoadData) {
          this.$refs.table.refresh()
        }
        this.isLoadData = true
      })
      this.visible = true
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    handleEdit (record) {
      console.log(record)
      this.$refs.editModal.editSub(record)
    },
    queryParamReset () {
      this.queryParams = JSON.parse(JSON.stringify(this.initQueryParams))
      this.handleOk()
    },
    onClose () {
      this.visible = false
    },
    async handleDelDict (id) {
      const { code, message } = await apiDelDict(id)
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

<style lang="less" scoped>
  .table-operator {
    margin-bottom: 18px;

    button {
      margin-right: 8px;
    }
  }
</style>
