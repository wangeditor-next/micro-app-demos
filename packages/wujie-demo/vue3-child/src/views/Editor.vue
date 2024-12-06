<template>
  <div class="cf-editor-wrapper">
    <Toolbar
      class="cf-editor-toolbar"
      :editor="editorRef"
      :mode="mode"
      :default-config="toolbarConfig"
    />
    <Editor
      v-model="modelValue"
      :="$attrs"
      class="cf-editor"
      :mode="mode"
      :default-config="editorConfig"
      :style="wrapperStyle"
      @onCreated="handleCreated"
      @onChange="handleChange"
      @onFocus="handleFocus"
      @onBlur="handleBlur"
      @onDestroyed="handleDestroyed"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed, onBeforeUnmount, ref } from 'vue'
import '@wangeditor-next/editor/dist/css/style.css'
import type { CSSProperties } from 'vue'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'

export interface CFEditorProps {
  height?: number | string
  mode: 'default' | 'simple'
  toolbarConfig?: any
  editorConfig?: any
}

const modelValue = defineModel<string>({
  default: '',
})

const props = withDefaults(defineProps<CFEditorProps>(), {
  height: 700,
  mode: 'default',
  editorConfig: () => ({ placeholder: '请输入' }),
  toolbarConfig: () => ({}),
})

const emits = defineEmits<{
  change: [html: string, json: string]
}>()

const wrapperStyle = computed(() => {
  const { height } = props
  const style: CSSProperties = {}
  const type = typeof height
  switch (type) {
    case 'string':
      style.height = height
      break
    case 'number':
      style.height = `${height}px`
      break
  }
  return style
})

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const handleCreated = (editor) => {
  editorRef.value = editor
}

const handleChange = (editor) => {
  emits('change', editor.getHtml(), editor.children)
}

const handleDestroyed = (editor) => {
  console.log('destroyed', editor)
}

const handleFocus = (editor) => {
  console.log('focus', editor)
}

const handleBlur = (editor) => {
  console.log('blur', editor)
}

const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`)
}

const customPaste = async (editor, event, callback) => {
  console.log('ClipboardEvent 粘贴事件对象', event)
  editor.insertData(event.clipboardData)
  // 自定义插入内容
  // editor.insertText(rtf)

  // 返回 false ，阻止默认粘贴行为
  event.preventDefault()
  callback(false) // 返回值（注意，vue 事件的返回值，不能用 return）
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor === null) return
  editor.destroy()
})

defineExpose({
  editorRef,
})
</script>
<style lang="scss" scoped>
.cf-editor {
  overflow-y: hidden;
  &-toolbar {
    border-bottom: 1px solid #ccc;
  }
  &-wrapper {
    border: 1px solid #ccc;
    &.w-e-full-screen-container {
      z-index: 3;
    }
    :deep(.w-e-text-placeholder) {
      top: 10px;
      font-style: normal;
    }
  }
}
</style>
