<template>
  <div class="page h-screen w-screen">
    <el-card class="box-card h-screen w-screen" shadow="never">
      <template #header>
        <div class="card-header">
          <el-button :icon="IconEpBack" circle @click="router.back()" />
          <div class="main">
            <div class="title">店铺管理</div>
            <div class="btns">
              <el-button type="primary">新增店铺</el-button>
            </div>
          </div>
        </div>
      </template>
      <el-table :data="keyStore.keyList" style="width: 100%">
        <el-table-column prop="name" label="店铺名" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="secret" label="Secret" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              :disabled="keyStore.useIndex === scope.$index"
              @click="changeUseIndex(scope.$index, scope.row)"
              >{{ keyStore.useIndex === scope.$index ? '当前使用' : '使用' }}</el-button
            >
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import IconEpBack from '~icons/ep/back'
  import { useRouter } from 'vue-router'
  import { useKeysStore } from '@/stores'
  import { Key } from '@/types'

  const keyStore = useKeysStore()
  const router = useRouter()
  // const tableData = ref([
  //   {
  //     id: '11111',
  //     secret: '22222',
  //     name: '食品店',
  //   },
  // ])

  const handleEdit = (index: number, row: Key) => {
    console.log(index, row)
    ElMessage({
      message: `${index},${JSON.stringify(row)}`,
    })
  }

  const handleDelete = (index: number, row: Key) => {
    console.log(index, row)
    ElMessage({
      message: `${index},${JSON.stringify(row)}`,
    })
  }

  const changeUseIndex = (index: number, row: Key) => {
    console.log(index, row)
    ElMessage({
      message: `${index},${JSON.stringify(row)}`,
    })
  }
</script>

<style lang="scss" scoped>
  .card-header {
    display: flex;
    .main {
      padding-left: 20px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .box-card {
    border-width: 1px 0 0 0;
  }
</style>
