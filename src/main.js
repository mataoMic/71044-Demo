/*
 * @Descripttion: 
 * @Author: mt
 * @version: 
 * @Date: 2021-08-09 14:58:24
 * @LastEditors: mt
 * @LastEditTime: 2021-08-23 09:44:42
 */
import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
