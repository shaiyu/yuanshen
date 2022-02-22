import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' // 引入element-plus
import 'element-plus/theme-chalk/index.css' // 引入element-plus的样式
import router from './router'
import initjs from  './utils/initjs'

initjs.init();
createApp(App).use(router)
    .use(ElementPlus, { zIndex: 3000, size: 'normal' }) // 使用element-plus
    .mount('#app')
