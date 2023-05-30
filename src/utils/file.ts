import { readTextFile, writeFile, createDir, BaseDirectory, exists } from '@tauri-apps/api/fs'
import { configFile, isDev } from '@/config'
import { KeysConfig } from '@/types/common'

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
export async function writeConfig<T>({
  // configPath = configFile.keys,
  configObject,
}: {
  configPath?: string
  configObject: T
}): Promise<void> {
  await writeFile(
    { contents: JSON.stringify(configObject, null, 2), path: 'config/keys.json' },
    {
      dir: configBase,
    }
  )
  return Promise.resolve()
}

export async function createDataFolder(pathName: string, dir: BaseDirectory = configBase) {
  return await createDir(pathName, {
    dir,
    recursive: true,
  })
}

export async function fileSystemInit() {
  const flag = await exists('config/', { dir: configBase })

  if (!flag) {
    await createDataFolder('config')
  }

  if (isDev) {
    await writeConfig<KeysConfig>({
      configObject: { keys: [{ id: '111', secret: '222', name: '333' }], useIndex: 0 },
    })
  }
}
