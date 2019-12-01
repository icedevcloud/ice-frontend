<template>
  <a-modal
    title="添加字典"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="字典名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入字典名称！'}]}]" />
        </a-form-item>

        <a-form-item
          label="类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input :disabled="optType == 1" v-decorator="['type', {rules: [{required: true, message: '请输入类型！'},{pattern: '^[A-Za-z0-9]+$', message: '类型只能输入英文或数字！'}]}]" />
        </a-form-item>

        <a-form-item
          v-if="optType == 1"
          label="字典编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['code', {rules: [{required: true, message: '请输入字典编码！'}]}]" />
        </a-form-item>

        <a-form-item
          v-if="optType == 1"
          label="数据值"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['value', {rules: [{required: true, message: '请输入数据值！'}]}]" />
        </a-form-item>

        <a-form-item
          v-if="optType == 1"
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

        <a-form-item
          v-if="optType == 1"
          label="状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-switch v-model="dictStatus" checkedChildren="启用" unCheckedChildren="禁用" defaultChecked />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { apiAddDict } from '@/api/sys/dict'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  components: { AFormItem },
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

      pid: '',
      dictType: '',
      dictStatus: true,
      optType: 0, // 添加字典类型 0 父级 1 子集

      form: this.$form.createForm(this)
    }
  },
  methods: {
    add (optType) {
      this.form = this.$form.createForm(this)
      this.visible = true

      this.optType = 0
      this.dictStatus = true
      this.confirmLoading = false
    },
    addSub (pid, dictType) {
      this.form = this.$form.createForm(this)
      this.visible = true

      this.pid = pid
      this.optType = 1
      this.$nextTick(() => {
        const { form } = this
        form.setFieldsValue({ type: dictType })
      })
      this.confirmLoading = false
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
          if (this.optType === 1) {
            values.pid = this.pid
            values.dictType = this.dictType
            values.status = this.dictStatus ? 1 : 0
          }
          const { code, message } = await apiAddDict(values)
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
