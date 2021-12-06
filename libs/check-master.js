const { execSync } = require('child_process')

/**
 * 检测是否是master分支，如果不是直接退出程序
 */
module.exports = () => {
  const currentBranch = execSync('git symbolic-ref --short HEAD').toString()
  if (currentBranch.trim() !== 'master') {
    console.error(
      `必须是master分支才可以使用该脚本，当前分支为: ${currentBranch}, 使用git checkout master切换分支`
    )
    process.exit(0)
  }
}
