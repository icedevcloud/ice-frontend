<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="字典名称">
              <a-input v-model="queryParams[0].value" placeholder="请输入字典名称"/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-input v-model="queryParams[1].value" placeholder="请输入类型"/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleOk">查询</a-button>
              <a-button style="margin-left: 8px"  @click="queryParamReset">重置</a-button>
               <!--<a @click="toggleAdvanced" style="margin-left: 8px">-->
                <!--{{ advanced ? '收起' : '展开' }}-->
                <!--<a-icon :type="advanced ? 'up' : 'down'"/>-->
              <!--</a>-->
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

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDictSubList(record)">字段项</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelDict(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </template>
      </span>
    </table-ext>

    <create-form ref="createModal" @ok="handleOk" />
    <edit-form ref="editModal" @ok="handleOk" />
    <dict-sub-list ref="dictSubList"></dict-sub-list>
  </a-card>
</template>

<script>
import { TableExt } from '@/components'
import CreateForm from './modules/CreateForm'
import EditForm from './modules/EditForm'
import DictSubList from './modules/DictSubList'
import { getDictList, apiDelDict } from '@/api/sys/dict'

export default {
  name: 'TableList',
  components: {
    TableExt,
    CreateForm,
    EditForm,
    DictSubList
  },
  data () {
    return {
      description: '',

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
          column: 'type',
          type: 'eq',
          value: ''
        }
      ],
      initQueryParams: [],
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '字典名称',
          dataIndex: 'name'
        },
        {
          title: '类型',
          dataIndex: 'type'
        },
        {
          title: '描述',
          dataIndex: 'description'
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
        console.log('loadData.parameter', parameter)
        return getDictList({ ...parameter, queryParams: this.queryParams }).then(res => {
          return res.data
        })
      }
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
      console.log(record)
      this.$refs.editModal.edit(record)
    },
    handleDictSubList (record) {
      this.$refs.dictSubList.init(record)
    },
    queryParamReset () {
      this.queryParams = JSON.parse(JSON.stringify(this.initQueryParams))
      this.handleOk()
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
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
