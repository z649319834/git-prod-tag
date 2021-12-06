#!/usr/bin/env node

const { execSync } = require('child_process')
const clipboardy = require('clipboardy')
const isGitRepository = require('./libs/is-git-repository')
const checkMaster = require('./libs/check-master')
const checkStatusClean = require('./libs/check-status-clean')
const getTag = require('./libs/get-tag')
const isEmptyHistory = require('./libs/is-empty-history')
const checkGitVersion = require('./libs/git-version-check')

;(async () => {
  // 判断git版本，版本过低部分命令不支持，新版本的支持汉化
  await checkGitVersion()
  // 判断是否git，避免在非git目录误用，及时中断并提示。
  isGitRepository()
  // 判断是否是刚初始化的git，如果没任何commit，是没办法执行git tag打标签的
  isEmptyHistory()
  // 检测master分支，避免标签
  checkMaster()
  // 检测工作区是否干净，避免未提交的代码
  checkStatusClean()

  const tag = await getTag()
  execSync(`git tag ${tag}`)
  console.info('添加成功')
  try {
    execSync(`git push origin ${tag}`)
    console.info('成功推送到服务端')
  } catch (error) {
    console.warn('标签推送服务器失败，请确认是否有权限推送，或者网络连接')
    console.error(error.message)
    execSync(`git tag --delete ${tag}`)
    console.error(`本地标签已删除：${tag}`)
    process.exit(0)
  }
  clipboardy.writeSync(tag)
  console.info('标签名称已保存到剪切板')
  console.warn(
    [
      '如果要删除该标签，运行以下命令删除该标签，分别删除本地和远程标签:',
      `git push origin :${tag} && git tag --delete ${tag}`,
    ].join('\n')
  )
})()
