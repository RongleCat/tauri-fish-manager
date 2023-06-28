<template>
  <div class="page h-screen w-screen">
    <el-card class="box-card h-screen w-screen" shadow="never">
      <template #header>
        <div class="card-header">
          <el-button :icon="IconEpBack" circle @click="router.back()" />
          <div class="main">
            <div class="title">店铺管理</div>
            <div class="btns">
              <el-button type="primary" @click="showKeyEditPopup = true">新增店铺</el-button>
            </div>
          </div>
        </div>
      </template>
      <el-table :data="keyStore.keys" style="width: 100%">
        <el-table-column prop="name" label="店铺名" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="secret" label="Secret" />
        <el-table-column prop="typeId" label="商品类型ID" />
        <el-table-column prop="classifyId" label="商品分类ID" />
        <el-table-column prop="categoryId" label="商品类目ID" />
        <el-table-column prop="districtId" label="发货地区ID" />
        <el-table-column label="操作" :width="300" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              :disabled="keyStore.useIndex === scope.$index"
              @click="changeUseIndex(scope.$index)"
              >{{ keyStore.useIndex === scope.$index ? '当前' : '使用' }}</el-button
            >
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-popconfirm
              title="确认删除此店铺？"
              width="200px"
              @confirm="handleDelete(scope.$index)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="showKeyEditPopup"
      :title="`${isEditMode ? '编辑' : '添加'}店铺`"
      width="500px"
      @closed="resetForm"
    >
      <el-form :model="form">
        <el-form-item label="店铺名" :label-width="formLabelWidth">
          <el-input v-model.trim="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model.trim="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Secret" :label-width="formLabelWidth">
          <el-input v-model.trim="form.secret" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品类型ID" :label-width="formLabelWidth">
          <el-input v-model.trim="form.typeId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品分类ID" :label-width="formLabelWidth">
          <el-input v-model.trim="form.classifyId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品类目ID" :label-width="formLabelWidth">
          <el-input v-model.trim="form.categoryId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="发货地区ID" :label-width="formLabelWidth">
          <el-input v-model.trim="form.districtId" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showKeyEditPopup = false">取消</el-button>
          <el-button type="primary" @click="confirmSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import IconEpBack from '~icons/ep/back'
  import { useRouter } from 'vue-router'
  import { useKeysStore } from '@/stores'
  import { Key } from '@/types'
  import { error } from '@/utils'

  const keyStore = useKeysStore()
  const router = useRouter()

  const showKeyEditPopup = ref(false)
  const formLabelWidth = '100px'
  const editIndex = ref(-1)
  const isEditMode = computed(() => {
    return editIndex.value !== -1
  })

  const form = reactive<Key>({
    name: '',
    id: '',
    secret: '',
    typeId: '',
    classifyId: '',
    categoryId: '',
    districtId: '',
  })

  const handleEdit = (index: number, row: Key) => {
    // console.log(index, row)
    Object.assign(form, row)
    editIndex.value = index
    showKeyEditPopup.value = true
  }

  const handleDelete = (index: number) => {
    if (index === keyStore.useIndex) {
      error('此店铺正在使用，无法删除！')
      return
    }
    keyStore.deleteKey(index)
  }

  const changeUseIndex = (index: number) => {
    keyStore.changeUseIndex(index)
  }

  const resetForm = () => {
    editIndex.value = -1
    Object.assign(form, {
      name: '',
      id: '',
      secret: '',
    } as Key)
  }

  const confirmSave = () => {
    if (!form.name) {
      error('请输入店铺名')
      return
    }
    if (!form.id) {
      error('请输入ID')
      return
    }
    if (!form.secret) {
      error('请输入Secret')
      return
    }
    if (!form.typeId) {
      error('请输入商品类型ID')
      return
    }
    if (!form.classifyId) {
      error('请输入商品分类ID')
      return
    }
    if (!form.categoryId) {
      error('请输入商品类目ID')
      return
    }
    if (!form.districtId) {
      error('请输入发货地区ID')
      return
    }

    if (!isEditMode.value) {
      keyStore.addKey(form)
    } else {
      keyStore.editKey(editIndex.value, form)
    }

    showKeyEditPopup.value = false
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
