<template>
  <div>
    <a-drawer
      title="角色授权"
      :width="720"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form>
        <a-form-item>
          <a-tree
            checkable
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            @select="onSelect"
            :treeData="treeData"
          />
        </a-form-item>
      </a-form>
      <div :style="{position: 'absolute',left: 0,bottom: 0,width: '100%',borderTop: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',textAlign: 'right',}">
        <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
          <a-menu slot="overlay">
            <a-menu-item key="3" @click="handleCheckAll">全部勾选</a-menu-item>
            <a-menu-item key="4" @click="handleCancelCheckall">取消全选</a-menu-item>
            <a-menu-item key="5" @click="handleExpandAll">展开所有</a-menu-item>
            <a-menu-item key="6" @click="handleCloseAll">合并所有</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="up" />
          </a-button>
        </a-dropdown>
        <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
        <a-button @click="handleSubmit" type="primary">确认</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { apiPermissionTree, apiUpdateRolePermission } from '@/api/sys/role'

export default {
  components: {
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
      visible: false,
      expandedKeys: [], // 展开节点
      autoExpandParent: true,
      checkedKeys: [], // 选中节点
      treeData: [], // trrs数据
      roleId: ''
    }
  },
  watch: {
    checkedKeys (val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    add (record) {
      this.expandedKeys = []
      this.checkedKeys = []
      this.treeData = []
      this.roleId = record.id
      apiPermissionTree(record.id).then(res => {
        this.treeData = res.data.record
        this.checkedKeys = res.data.ids
        this.handleExpandAll()
        this.visible = true
      })
    },
    genPermissionTreeIds (record, ids) {
      record.map(item => {
        ids.push(item.id)
        if (item.children != null) this.genPermissionTreeIds(item.children, ids)
      })
    },
    handleCheckAll () {
      const allIds = []
      this.genPermissionTreeIds(this.treeData, allIds)
      this.checkedKeys = allIds
    },
    handleCancelCheckall () {
      this.checkedKeys = []
    },
    handleExpandAll () {
      const allIds = []
      this.genPermissionTreeIds(this.treeData, allIds)
      this.expandedKeys = allIds
    },
    handleCloseAll () {
      this.expandedKeys = []
    },
    async handleSubmit () {
      const roleId = this.roleId
      const permIds = this.checkedKeys
      const { code, message } = await apiUpdateRolePermission({ roleId, permIds })
      if (code === 200) {
        this.$message.success('授权成功')
        this.visible = false
        this.$emit('ok')
      } else {
        this.$message.warning(message)
      }
    },
    onClose () {
      this.visible = false
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    }
  }
}
</script>
