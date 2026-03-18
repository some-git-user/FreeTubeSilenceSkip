import { Arch, build, Platform } from 'electron-builder'
import config from './ebuilder.config.mjs'

/** @type {Map<import('electron-builder').Platform, Map<import('electron-builder').Arch, Array<string>>>} */

const arch = Arch.x64
const targets = Platform.LINUX.createTarget(['AppImage'], arch)

try {
  const output = await build({ targets, config, publish: 'never' })
  console.log(output)
} catch (error) {
  console.error(error)
}
