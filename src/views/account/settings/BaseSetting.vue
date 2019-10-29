<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" layout="vertical">
          <a-form-item
            label="用户名">
            <a-input :disabled="true" v-decorator="['username']" />
          </a-form-item>

          <a-form-item
            label="昵称">
            <a-input v-decorator="['nickname', {rules: [{required: true, message: '请输入昵称！'}]}]" placeholder="给自己起个名字" />
          </a-form-item>

          <a-form-item
            label="手机号"
            :required="false">
            <a-input v-decorator="['phone', {rules: [{required: true, message: '请输入手机号！'},{pattern: '^1[3456789]\\d{9}$', message: '手机号格式错误！'}]}]" placeholder="请输入手机号"/>
          </a-form-item>

          <a-form-item
            label="电子邮件"
            :required="false">
            <a-input v-decorator="['email', {rules: [{required: true, message: '请输入邮箱！'},{pattern: '\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}', message: '邮箱格式错误！'}]}]" placeholder="请输入电子邮件"/>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="handleSubmit">保存</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview">
          <img :src="userInfo.avatar"/>
        </div>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { apiGetUserInfo, apiUpdateUser } from '@/api/sys/user'

export default {
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      userInfo: {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      const { code, data, message } = await apiGetUserInfo()
      const { form } = this
      if (code === 200) {
        this.$nextTick(() => {
          const formData = pick(data, ['username', 'nickname', 'phone', 'email'])
          form.setFieldsValue(formData)
          this.userInfo = data
        })
      } else {
        this.$message.warning(message)
      }
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields(async (errors, values) => {
        if (!errors) {
          console.log('values', values)
          values.id = this.userInfo.id
          const { code, message } = await apiUpdateUser(values)
          this.init()
          if (code === 200) {
            this.$message.success('更新成功')
          } else {
            this.$message.warning(message)
          }
        } else {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
