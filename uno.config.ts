import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
  presetAttributify,
} from 'unocss'
import type { UserConfig } from 'unocss'

const conf: UserConfig = defineConfig({
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})

export default conf
