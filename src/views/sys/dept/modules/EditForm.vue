<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form">
      <a-form-item
        label="id"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input :disabled="true" v-decorator="['id']" />
      </a-form-item>

      <a-form-item
        v-if="pid!=0"
        label="上级部门"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-tree-select
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          allowClear
          treeDefaultExpandAll
          :treeData="treeData"
          v-decorator="['pid', {rules: [{required: true, message: '请选择上部门！'}]}]"
          @change="onTreeSelectChange"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        label="部门名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input v-decorator="['name', {rules: [{required: true, message: '请输入部门名称！'}]}]" />
      </a-form-item>

      <a-form-item
        label="排序号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input-number v-decorator="['sort', { initialValue: 0 }]" :min="0" :max="99999" />
      </a-form-item>

      <a-form-item
        label="备注"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea v-decorator="['description']" :autosize="{ minRows: 2, maxRows: 6 }" />
      </a-form-item>
    </a-form>

    <div style="width: 100%; text-align: center;">
      <a-button type="primary" htmlType="button" icon="form" @click="handleSubmit">修改并保存</a-button>
    </div>
  </a-spin>
</template>

<script>
import pick from 'lodash.pick'
import { getDeptTree, apiUpdateDept } from '@/api/sys/dept'
export default {
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
      treeData: [], // trrs数据
      form: this.$form.createForm(this),
      pid: 0
    }
  },
  created () {
  },
  methods: {
    async edit (record, selected) {
      if (selected) {
        this.pid = record.pid
        this.form = this.$form.createForm(this)
        const { form } = this
        const { code, data, message } = await getDeptTree()
        if (code === 200) {
          this.treeData = data
          this.genTreeData(this.treeData)
          this.confirmLoading = false
          this.$nextTick(() => {
            if (this.pid === '0') {
              const formData = pick(record, ['id', 'name', 'sort', 'description'])
              form.setFieldsValue(formData)
            } else {
              const formData = pick(record, ['id', 'pid', 'name', 'sort', 'description'])
              form.setFieldsValue(formData)
            }
          })
        } else {
          this.$message.warning(message)
        }
      } else {
        this.confirmLoading = true
      }
    },
    genTreeData (treeData) {
      treeData.map(item => {
        item.key = item.id
        item.value = item.id
        if (item.children) {
          this.genTreeData(item.children)
        }
      })
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    onTreeSelectChange (value) {
      const { form } = this
      form.setFieldsValue({ pid: value })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields(async (errors, values) => {
        if (!errors) {
          const { code, message } = await apiUpdateDept(values)
          if (code === 200) {
            this.confirmLoading = true
            this.$message.success('更新成功')
            this.$emit('ok')
          } else {
            this.$message.warning(message)
          }
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
