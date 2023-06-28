import { readTextFile, writeFile, createDir, BaseDirectory, exists } from '@tauri-apps/api/fs'
import { configFile, isDev } from '@/config'
// import { KeyConfig } from '@/types/common'

const configBase = isDev ? BaseDirectory.Desktop : BaseDirectory.AppConfig

/**
 * @description: 读取配置文件
 * @param {*} configPath // 配置文件路径
 * @return {T} // 序列化后的配置文件内容
 */
export async function getConfig<T>(configPath = configFile.keys): Promise<T> {
  let config = {} as T
  try {
    await fileSystemInit()
    const contents = await readTextFile(`config/${configPath}.json`, {
      dir: configBase,
    })
    config = JSON.parse(contents)
  } catch (error) {
    console.log(error)
    //
  }
  return config
}

/**
 * @description: 写入配置文件
 * @return {*}
 */
export async function writeConfig<T>(
  configObject: T,
  configPath: string = configFile.keys
): Promise<void> {
  await writeFile(
    { contents: JSON.stringify(configObject, null, 2), path: `config/${configPath}.json` },
    {
      dir: configBase,
    }
  )
  return Promise.resolve()
}

/**
 * @description: 创建文件夹
 * @param {string} pathName
 * @param {BaseDirectory} dir
 * @return {*}
 */
export async function createDataFolder(
  pathName: string,
  dir: BaseDirectory = configBase
): Promise<void> {
  return await createDir(pathName, {
    dir,
    recursive: true,
  })
}

/**
 * @description: 文件系统初始化
 * @return {*}
 */
export async function fileSystemInit(): Promise<void> {
  const flag = await exists('config/', { dir: configBase })

  if (!flag) {
    await createDataFolder('config')
  }

  // if (isDev) {
  //   await writeConfig<KeyConfig>({
  //     keys: [{ id: '111', secret: '222', name: '333' }],
  //     useIndex: 0,
  //   })
  // }
}
