import fs from "fs"
import yargs from "yargs"

const argv = yargs(process.argv.slice(2)).argv

const pkgType = argv.pkgType || "deb"

const electronBuilderConfig = fs.readFileSync("electron-builder.yml", "utf8")

const updatedElectronBuilderConfig = electronBuilderConfig.replace(
  /(linux:\s*\n\s*target:\s*\n\s*-\s*)[^\n]+/,
  `$1${pkgType}`,
)

fs.writeFileSync("electron-builder.yml", updatedElectronBuilderConfig)
