const fs = require("fs-extra")

exports.cleanUpTempFolder = async () => {
  const ROOT = process.env.ROOT_NAME
  const files = await fs.readdir(`${ROOT}/temp`)
  files.forEach(async (file) => {
    const stat = await fs.stat(`${ROOT}/temp/${file}`)
    const birth = stat.birthtimeMs
    const lifeTime = Date.now() - birth
    if (lifeTime > 7 * 24 * 3600 * 1000) {
      await fs.remove(`${ROOT}/temp/${file}`)
    }
  })
}
