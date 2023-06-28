export const success = (message: string) => {
  ElMessage({
    message,
    type: 'success',
  })
}

export const error = (message: string) => {
  ElMessage({
    message,
    type: 'error',
  })
}

export const warring = (message: string) => {
  ElMessage({
    message,
    type: 'warning',
  })
}

export const info = (message: string) => {
  ElMessage({
    message,
    type: 'info',
  })
}
