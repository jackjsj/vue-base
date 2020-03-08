import Vue from 'vue';

/**
 * 1. 第一个参数 搜索的目录（.表示当前目录）
 * 2. 第二个参数 是否搜索子目录
 * 3. 第三个参数 表示查找匹配的文件
 */
const files = require.context('.', true, /\.vue$/);
files.keys().forEach(key => {
  if (key === './index.js') return;
  // 依次注册为全局组件
  const component = files(key).default;
  Vue.component(component.name, component);
});
