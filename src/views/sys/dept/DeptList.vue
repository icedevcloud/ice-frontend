<template>
  <a-row :gutter="10">
    <a-col :md="12" :sm="24">
      <a-card style="width: 100%">
        <div class="z-tree">
          <div class="table-operator">
            <a-button type="primary" icon="plus" @click="handleAddDept(0)">添加一级部门</a-button>
            <a-button type="primary" icon="plus" @click="handleAddDept(1)">添加子部门</a-button>
            <a-button type="primary" icon="delete" @click="handleDelDept">删除</a-button>
            <a-button icon="reload" @click="handleOk">刷新</a-button>
          </div>
          <div class="tree-z" style="position: relative">
            <a-tree
              @expand="onExpand"
              :selectedKeys="selectedKeys"
              :expandedKeys="expandedKeys"
              :autoExpandParent="autoExpandParent"
              v-model="checkedKeys"
              :checkStrictly="true"
              @select="onSelect"
              :treeData="treeData"
            />
            <div v-if="treeData.length == 0">无部门数据</div>
          </div>
        </div>
      </a-card>
    </a-col>

    <a-col :md="12" :sm="24">
      <a-card style="width: 100%">
        <edit-form ref="editForm" @ok="handleOk"></edit-form>
      </a-card>
    </a-col>

    <create-form ref="createForm" @ok="handleOk"></create-form>
  </a-row>
</template>

<script>
import CreateForm from './modules/CreateForm'
import EditForm from './modules/EditForm'
import { getDeptTree, apiDelDept } from '@/api/sys/dept'

export default {
  components: { CreateForm, EditForm },
  comments: {
    CreateForm,
    EditForm
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: true,
      expandedKeys: [], // 展开节点
      autoExpandParent: true,
      checkedKeys: [], // 选中节点
      selectedKeys: [],
      treeData: [], // trrs数据
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.getDeptTree()
  },
  methods: {
    async getDeptTree () {
      const { code, data, message } = await getDeptTree()
      if (code === 200) {
        this.treeData = data
      } else {
        this.$message.warning(message)
      }
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', selectedKeys, info)
      this.selectedKeys = selectedKeys
      const record = info.node.dataRef
      const selected = info.selected
      console.log(record, info.selected)
      this.$refs.editForm.edit(record, selected)
    },
    handleAddDept (optType) {
      if (optType === 0) {
        this.$refs.createForm.add()
      } else if (optType === 1) {
        this.$refs.createForm.addSub(this.selectedKeys[0])
      }
    },
    async handleDelDept () {
      const id = this.selectedKeys[0]
      if (id === undefined) {
        this.$message.warning('请选择部门')
      } else {
        const { code, message } = await apiDelDept(id)
        if (code === 200) {
          this.handleOk()
          this.$message.success('刪除成功')
        } else {
          this.$message.warning(message)
        }
      }
    },
    handleOk () {
      this.treeData = []
      this.selectedKeys = []
      this.expandedKeys = []
      this.getDeptTree()
      this.$refs.editForm.edit({}, false)
    }
  }
}
</script>

<style scoped>
  .tree-z {
    min-height: 500px;
    max-height: 500px;
    overflow: auto;
  }
  .tree-z::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .tree-z::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
  }
</style>
