<template>
  <div>
    <a-drawer
      title="添加权限"
      :width="720"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form">
        <a-form-item
          label="权限类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-radio-group @change="onChangeInitType" v-decorator="['type',{'initialValue': initTypeValue}]">
            <a-radio :value="0">菜单</a-radio>
            <a-radio :value="1">按钮/权限</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="权限名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['title', {rules: [{required: true, message: '请输入权限名称！'}]}]" />
        </a-form-item>

        <a-form-item
          v-if="pid!=0"
          label="上级菜单"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            allowClear
            treeDefaultExpandAll
            :treeData="treeData"
            v-decorator="['pid', {rules: [{required: true, message: '请选择上级菜单！'}]}]"
            @change="onTreeSelectChange"
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item
          v-if="initTypeValue==0"
          label="路由名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入Key！'}]}]" />
        </a-form-item>

        <a-form-item
          v-if="initTypeValue==0"
          label="前端路径"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['path', {rules: [{required: true, message: '请输入前端路径！'}]}]" />
        </a-form-item>

        <a-form-item
          v-if="initTypeValue==0"
          label="组件"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['component', {rules: [{required: true, message: '请输入组件！'}]}]" />
        </a-form-item>

        <a-form-item
          v-if="initTypeValue==1"
          label="权限编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['permCode', {rules: [{required: true, message: '请输入权限编码！'}]}]" />
        </a-form-item>

        <a-form-item
          label="图标"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input v-decorator="['icon', {rules: [{required: true, message: '请输入图标或选择图标！'}]}]">
            <a-icon slot="addonAfter" type="setting" @click="$refs.iconModal.init()"/>
          </a-input>
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

        <a-form-item
          v-if="initTypeValue==0"
          label="隐藏路由"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-switch v-model="hidden" checkedChildren="是" unCheckedChildren="否" defaultChecked />
        </a-form-item>

        <a-form-item
          v-if="initTypeValue==0"
          label="是否缓存路由"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-switch v-model="cache" checkedChildren="是" unCheckedChildren="否" />
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
        <a-button @click="handleSubmit" type="primary">确认</a-button>
      </div>
    </a-drawer>

    <icon-modal ref="iconModal" @change="handleIconChange"></icon-modal>
  </div>
</template>

<script>
import IconModal from '@/components/IconModal'
import { apiGetPermissionMenuTree, apiAddPermission } from '@/api/sys/permission'

export default {
  components: {
    IconModal
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
      initTypeValue: 0,
      pid: 0,
      typeDisabled: false,
      hidden: false,
      cache: true,
      form: this.$form.createForm(this),
      treeData: [],
      value: []
    }
  },
  methods: {
    add () {
      this.form = this.$form.createForm(this)
      this.initTypeValue = 0
      this.pid = 0
      this.typeDisabled = false
      this.init()
    },
    async addSubMenu (record) {
      if (record.type === 1) {
        this.$message.warning('按钮不允许添加子菜单')
        return
      }
      this.form = this.$form.createForm(this)
      this.initTypeValue = 0
      this.pid = record.id
      this.typeDisabled = true
      const { code } = await this.init()
      if (code === 200) {
        const { form } = this
        this.$nextTick(() => {
          this.pid = record.id
          form.setFieldsValue({ type: this.initTypeValue, pid: record.id })
        })
      }
    },
    async init () {
      const { code, data, message } = await apiGetPermissionMenuTree()
      if (code === 200) {
        const treeData = data
        this.genTreeData(treeData)
        this.treeData = treeData
        this.visible = true
      } else {
        this.visible = false
      }
      return { code, data, message }
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
    onChangeInitType (e) {
      this.initTypeValue = e.target.value
      this.form = this.$form.createForm(this)
      const pid = this.pid
      if (pid !== 0) {
        const { form } = this
        this.$nextTick(() => {
          form.setFieldsValue({ pid: pid })
        })
      }
    },
    handleSubmit () {
      this.form.validateFields(['pid'], { force: true })
      const { form: { validateFields } } = this
      validateFields(async (errors, values) => {
        if (!errors) {
          if (values.type !== 3) {
            values.hidden = this.hidden
            values.cache = this.cache
          }
          const { code, message } = await apiAddPermission(values)
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
    },
    onClose () {
      this.visible = false
    },
    handleIconChange (icon) {
      console.log('change Icon', icon)
      const { form } = this
      form.setFieldsValue({ icon: icon })
    },
    onTreeSelectChange (value) {
      // console.log(value)
      // this.value = value
      const { form } = this
      form.setFieldsValue({ pid: value })
    }
  }
}
</script>
