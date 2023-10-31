// @ts-check
import packageJson from "../package.json" assert { type: "json" }
import { getApplicationFileNames, getUpdateFileName } from "./assetNames.mjs"
import { getLocalPath } from "./localPath.mjs"
import { getSystem, getSystemName } from "./platform.mjs"
import { run, upload } from "./remoteConnection.mjs"
import { getRemotePath } from "./remotePath.mjs"

/**
 * Needed env variables:
 * - `HOST`
 * - `USERNAME`
 * - `PASSWORD`
 * - `ROOT`
 *
 * Optional env variables:
 * - `CI`
 */
const {
  HOST,
  USERNAME,
  PASSWORD,
  ROOT = "/",
  CI,
} = process.env

const args = process.argv.slice(2)
const os = getSystem()


if (!args.includes("--stable") && !args.includes("--prerelease")) {
  throw new TypeError(`publishToServer requires a specified channel ("--stable" or "--prerelease")`)
}

const channel = args.includes("--prerelease") ? "prerelease" : "stable"

console.log(`Preparing to upload update files for "${getSystemName(os)}" on "${channel}" channel...`)

const localDir = getLocalPath(channel)
const remoteDir = getRemotePath(ROOT, channel, os)

const updateFileName = getUpdateFileName(os)
const applicationFileNames = getApplicationFileNames(os, channel, packageJson.version)

console.log(`Files to upload: ${[updateFileName, ...applicationFileNames] .join (", ")}.`)

await run({ host: HOST, username: USERNAME, password: PASSWORD }, async client => {
  for (const applicationFileName of applicationFileNames) {
    await upload(client, localDir, remoteDir, applicationFileName)
  }

  await upload(client, localDir, remoteDir, updateFileName)
})

console.log(`Uploading files finished successfully.`)
