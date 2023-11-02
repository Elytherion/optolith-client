import Debug from "debug"
import { join } from "node:path"
import { parentPort } from "node:process"
import { getAllValidData, getCache } from "optolith-database-schema"
import { getAbsoluteCachePaths, getAbsoluteEntityPaths } from "./contents/src/config.js"
const debug = Debug("util:database")

// This is the relative path from the project root directory to the database
// root directory.
const root = join("src", "database", "contents")

debug("loading database ...")

const get = async () => {
  const raw = await getAllValidData(getAbsoluteEntityPaths(root), {
    ajvOptions: { allErrors: true },
  })
  const cache = await getCache(getAbsoluteCachePaths(root))
  return { raw, cache }
}

get()
  .then(database => {
    debug("database loaded")
    parentPort.postMessage(database)
  })
  .catch(err => {
    debug("database error: %O", err)
  })

/**
 * The complate database content.
 */
export type Database = {
  raw: Awaited<ReturnType<typeof getAllValidData>>
  cache: Awaited<ReturnType<typeof getCache>>
}
