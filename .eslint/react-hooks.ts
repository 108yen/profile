import { Linter } from "eslint"
import * as reactHooksPlugin from "eslint-plugin-react-hooks"
import { sharedFiles } from "./shared"

export const reactHooksConfig: Linter.Config = {
  files: sharedFiles,
  name: "eslint/react-hooks",
  plugins: {
    "react-hooks": {
      rules: reactHooksPlugin.rules,
    },
  },
  rules: {
    ...reactHooksPlugin.configs.recommended.rules,
  },
}
