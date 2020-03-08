const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const resolve = file => path.resolve(__dirname, '../src', file);
const routerSymbol = Symbol('router');
const viewSymbol = Symbol('views');
const rootPath = {
  [routerSymbol]: resolve('router/modules'),
  [viewSymbol]: resolve('views'),
};
const errorLog = error => console.log(chalk.red(`${error}`));
const defaultLog = log => console.log(chalk.green(`${log}`));

let moduleName = new String();

// 驼峰转短横线
const camel2Kebal = name => {
  const result = name.replace(/([A-Z])/g, ($0, $1) => `-${$1.toLowerCase()}`);
  if (result.startsWith('-')) {
    return result.substring(1);
  }
  return result;
};

const vueFile = module => `<template>
  <div class="${camel2Kebal(module)}">
    ${module} View
  </div>
</template>

<script>
export default {
  name: '${module}',
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
</style>
`;

const routerFile = module => `export default {
  path: '/${camel2Kebal(module)}',
  name: '${module}',
  component: () => import('@/views/${module}'),
};
`;

const generateFile = async (filePath, content, dirPath = '') => {
  try {
    if (dirPath !== '' && !(await fs.existsSync(dirPath))) {
      await fs.mkdirSync(dirPath);
      defaultLog(`create ${dirPath}`);
    }
    if (!(await fs.existsSync(filePath))) {
      await fs.openSync(filePath, 'w');
      defaultLog(`created ${filePath}`);
    }
    await fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    errorLog(error);
  }
};

const generates = new Map([
  [
    'view',
    async module => {
      const filePath = path.join(rootPath[viewSymbol], '');
      const vuePath = path.join(filePath, `/${module}.vue`);
      await generateFile(vuePath, vueFile(module), filePath);
    },
  ],
  [
    'router',
    async module => {
      const routerPath = path.join(rootPath[routerSymbol], `/${module}.js`);
      await generateFile(routerPath, routerFile(module));
    },
  ],
]);

defaultLog('请输入模块名称（英文）：');
const files = ['view', 'router'];
process.stdin.on('data', chunk => {
  try {
    if (!moduleName) {
      moduleName = chunk;
    } else {
      chunk = chunk.slice(0, -2);
      defaultLog(`new module name is ${chunk}`);
      files.forEach(async (el, index) => {
        await generates.get(`${el}`).call(null, chunk.toString());
        if (index === files.length - 1) {
          process.stdin.emit('end');
        }
      });
    }
  } catch (error) {
    errorLog(error);
  }
});

process.stdin.on('end', () => {
  defaultLog('create module success');
  process.exit(0);
});
