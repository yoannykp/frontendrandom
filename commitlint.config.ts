import conventionalCommit from "./conventionalCommit.json"

const typesEnum = Object.keys(conventionalCommit.types) as string[]
const scopesEnum = Object.keys(conventionalCommit.scopes) as string[]

const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", typesEnum],
    "scope-case": [2, "always", ["camel-case"]],
    "scope-enum": [2, "always", scopesEnum],
    "subject-case": [2, "never", ["sentence-case", "start-case"]],
    "header-max-length": [2, "always", 72],
    "subject-empty": [2, "never"],
  },
}

export default config
