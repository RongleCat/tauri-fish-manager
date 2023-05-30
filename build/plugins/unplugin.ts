import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default [
  Icons({
    autoInstall: true,
    compiler: 'vue3',
    scale: 1,
    defaultClass: 'inline-block',
    customCollections: {
      // load custom icons
      custom: FileSystemIconLoader('assets/icons'),
    },
  }),
  Components({
    dirs: ['src/components'],
    deep: true,
    directives: true,
    dts: 'src/types/components.d.ts',
    types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
    include: [/\.vue$/, /\.vue\?vue/],
    exclude: [/[\\/]node_modules[\\/]/],
    resolvers: [
      IconsResolver({
        customCollections: ['custom'],
        enabledCollections: ['ep'],
        prefix: 'icon',
      }),
      ElementPlusResolver(),
    ],
  }),
  AutoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    dts: 'src/types/auto-import.d.ts',
    include: [/\.vue$/, /\.vue\?vue/, /\.ts$/],
    eslintrc: {
      enabled: true,
      filepath: './.eslintrc-auto-import.json',
    },
    resolvers: [
      ElementPlusResolver(),

      // Auto import icon components
      // 自动导入图标组件
      IconsResolver({
        prefix: 'Icon',
      }),
    ],
  }),
]
