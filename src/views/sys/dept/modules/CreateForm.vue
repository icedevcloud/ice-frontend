<template>
  <a-modal
    title="添加部门"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          v-if="optType!=0"
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
    </a-spin>
  </a-modal>
</template>

<script>
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { getDeptTree, apiAddDept } from '@/api/sys/dept'

export default {
  components: {
    AFormItem
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
      confirmLoading: false,

      optType: 0, // 0 一级部门 1 子部门
      pid: '',

      form: this.$form.createForm(this)
    }
  },
  methods: {
    async add () {
      await this.getDeptTree()
      this.form = this.$form.createForm(this)
      this.optType = 0

      this.visible = true
      this.confirmLoading = false
    },
    async addSub (pid) {
      await this.getDeptTree()
      this.form = this.$form.createForm(this)
      this.pid = pid
      this.optType = 1
      this.visible = true

      if (pid) {
        const { form } = this
        this.$nextTick(() => {
          form.setFieldsValue({ pid: pid })
        })
      }
      this.confirmLoading = false
    },
    async getDeptTree () {
      const { code, data } = await getDeptTree()
      if (code === 200) {
        this.treeData = data
        this.genTreeData(this.treeData)
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
    onTreeSelectChange (value) {
      const { form } = this
      form.setFieldsValue({ pid: value })
    },
    handleCancel () {
      this.visible = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields(async (errors, values) => {
        if (!errors) {
          const { code, message } = await apiAddDept(values)
          this.confirmLoading = false
          if (code === 200) {
            this.$message.success('添加成功')
            this.visible = false
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
