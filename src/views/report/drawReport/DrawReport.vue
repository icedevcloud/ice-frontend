<template>
  <a-row :gutter="24" :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="报表分类">
          <a-select v-decorator="['categoryId', {rules: [{required: true, message: '请选择报表分类！'}]}]">>
            <a-select-option value="1">报表分类</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="报表数据源">
          <a-select v-decorator="['dsId', {rules: [{required: true, message: '请选择基本数据源！'}]}]">
            <a-select-option value="1:name">基本数据源</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="是否使用复杂表头">
          <a-select v-decorator="['isUseComplexReportHeader', {rules: [{required: true, message: '请选择基本数据源！'}]}]"
                    @change="showReportHeadOptionsShow">
            <a-select-option value="0">否</a-select-option>
            <a-select-option value="1">是</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="复杂表头配置" v-show="reportHeadOptionsShow">
          <a-textarea placeholder="Basic usage" :rows="4"
                      v-decorator="['reportHeadOptions', {rules: [{required: true, message: '请输入Key！'}]}]"/>
        </a-form-item>


        <a-form-item label="执行sql">
          <a-textarea placeholder="Basic usage" :rows="4"
                      v-decorator="['sqlText', {rules: [{required: true, message: '请输入Key！'}]}]"/>
        </a-form-item>

        <a-button ref="buttonSubmitForExecuteSql" v-show="buttonSubmitForExecuteSqlShow"
                  @click="handleSubmitForExecuteSql" type="primary">执行
        </a-button>

        <a-spin v-show="fieldShow" v-for="(value, key) in fieldMap ">
          <a-row>
            <a-col :span="6">{{value[0]}}</a-col>
            <a-col :span="6">{{value[1]}}</a-col>

          </a-row>
        </a-spin>
      </a-form>
    </a-spin>
  </a-row>
</template>

<script>
  //import { apiExecuteSql } from '@/api/reprot/report'


  export default {
    components: {},
    data() {
      return {
        form: this.$form.createForm(this),
        confirmLoading: false,
        reportHeadOptionsShow: false,
        fieldMap: [],
        buttonSubmitForExecuteSqlShow: true,
        fieldShow: false
      }

    },
    methods: {
      handleSubmitForExecuteSql(e) {
        e.preventDefault()
        this.form.validateFields(async (err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            //this.$refs.buttonSubmitForExecuteSql.$el.style.display = 'none'
            this.buttonSubmitForExecuteSqlShow = false
            this.fieldMap = [['xiehuan', 'xsxsxs'], ['未全额委屈', 'dsadsadsadsa']]
            this.fieldShow = true
            this.confirmLoading = false
            /*            const { code, message } = await apiExecuteSql(values)
                        if (code === 200) {
                          await this.fieldMap=this.$message.success('添加成功')
                          this.visible = false
                          this.$emit('ok')
                        } else {
                          await this.$message.warning(message)
                        }*/
          } else {
            this.confirmLoading = false
          }
        })
      },

      showReportHeadOptionsShow(value, Option) {
        if (value == 1) {
          this.reportHeadOptionsShow=true
        }
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
