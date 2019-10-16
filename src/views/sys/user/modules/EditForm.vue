<template>
  <a-modal
    title="编辑用户"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="用户名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input disabled v-decorator="['username', {rules: [{required: true, message: '请输入用户名！'},{min: 5, message: '请输入至少五个字符！'},{pattern: '^[A-Za-z0-9]+$', message: '用户名只能输入英文或数字！'}]}]" />
        </a-form-item>

        <a-form-item
          label="昵称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['nickname', {rules: [{required: true, message: '请输入昵称！'}]}]" />
        </a-form-item>

        <a-form-item
          label="角色分配"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-select
            mode="multiple"
            @search="handleSearchRole"
            @change="handleChange"
            v-model="roleIds"
            placeholder="请选择角色">
            <a-select-option :value="item.id" v-for="item in roleList" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="手机号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['phone', {rules: [{required: true, message: '请输入手机号！'},{pattern: '^1[3456789]\\d{9}$', message: '手机号格式错误！'}]}]" />
        </a-form-item>

        <a-form-item
          label="邮箱"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['email', {rules: [{required: true, message: '请输入邮箱！'},{pattern: '\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}', message: '邮箱格式错误！'}]}]" />
        </a-form-item>

        <a-form-item
          label="状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-switch v-model="status" v-decorator="['status']" checkedChildren="正常" unCheckedChildren="禁用" defaultChecked />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { apiUpdateUser, apiUserRolesInfo } from '@/api/sys/user'
import { apiQueryRole } from '@/api/sys/role'

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

      roleIds: [],
      roleList: [],
      status: true,
      form: this.$form.createForm(this),

      record: {}
    }
  },
  methods: {
    edit (record) {
      this.record = record
      this.status = !!record.status
      this.form = this.$form.createForm(this)
      const { form } = this
      apiUserRolesInfo(record.id).then(res => {
        const { data } = res
        this.roleIds = data.roleIds
        const formData = pick(data, ['avatar', 'username', 'nickname', 'phone', 'email', 'status'])
        form.setFieldsValue(formData)
      })
      this.visible = true
      this.queryRole('')
      // this.form = { id, avatar, username, nickname, phone, email, status }
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
          values.id = this.record.id
          values.roleIds = this.roleIds
          values.status = values.status ? 1 : 0
          const { code, message } = await apiUpdateUser(values)
          this.confirmLoading = false
          if (code === 200) {
            this.$message.success('更新成功')
            this.visible = false
            this.$emit('ok')
          } else {
            this.$message.warning(message)
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    async queryRole (roleName) {
      const parms = { roleName: roleName }
      const { code, data } = await apiQueryRole(parms)
      if (code === 200) {
        this.roleList = data
      }
    },
    handleSearchRole (e) {
      this.queryRole(e)
    },
    handleChange (e) {
      this.roleIds = e
    }
  }
}
</script>
