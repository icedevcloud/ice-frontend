<template>
  <a-modal
    title="添加角色"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="角色名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入角色名！'}]}]" />
        </a-form-item>

        <a-form-item
          label="角色编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['roleCode', {rules: [{required: true, message: '请输入角色编码！'},{pattern: '^[A-Za-z_]+$', message: '角色编码只能输入英文字母或下划线！'}]}]" />
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['description']" :autosize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>

        <a-form-item
          label="状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-switch v-decorator="['status']" v-model="status" checkedChildren="正常" unCheckedChildren="禁用" defaultChecked />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { apiAddRole } from '@/api/sys/role'

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
      visible: false,
      confirmLoading: false,

      status: true,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    add () {
      this.form = this.$form.createForm(this)
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields(async (errors, values) => {
        if (!errors) {
          console.log('values', values)
          values.status = values.status ? 1 : 0
          const { code, message } = await apiAddRole(values)
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
