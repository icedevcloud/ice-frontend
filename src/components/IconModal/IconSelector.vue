<template>
  <div>
    <a-modal
      v-model="visible"
      :width="900"
      :keyboard="false"
      :closable="false"
      :centered="true"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :maskClosable="false"
      :mask="false"
      okText="确认"
      cancelText="取消">
      <a-tabs>
        <a-tab-pane v-for="(v, i) in icons" :tab="v.title" :key="i">
          <ul>
            <li v-for="(icon, key) in v.icons" :key="`${v.title}-${key}`" :class="{ 'active': selectedIcon==icon }">
              <a-icon :type="icon" :style="{ fontSize: '36px' }" @click="handleSelectedIcon(icon)" />
            </li>
          </ul>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import icons from './icons'

export default {
  name: 'IconSelect',
  data () {
    return {
      visible: false,
      selectedIcon: '',
      icons
    }
  },
  methods: {
    init () {
      this.visible = true
      this.selectedIcon = ''
    },
    handleSubmit () {
      if (isEmpty(this.selectedIcon)) {
        this.$message.warning('请选择图标')
        return
      }
      this.$emit('change', this.selectedIcon)
      this.visible = false
    },
    handleCancel () {
      this.visible = false
    },
    handleSelectedIcon (icon) {
      this.selectedIcon = icon
    }
  }
}
</script>

<style lang="less" scoped>
  ul{
    list-style: none;
    padding: 0;
    overflow-y: scroll;
    height: 250px;
    li{
      display: inline-block;
      padding:5px;
      margin:5px;
      &:hover {
        cursor: pointer;
      }
      &.active{
        box-shadow: 0px 0px 5px 2px #888888;
      }
    }
  }
</style>
