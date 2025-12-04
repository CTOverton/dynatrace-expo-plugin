import {
  type ConfigPlugin,
  withProjectBuildGradle,
  withAppBuildGradle,
  withDangerousMod,
} from 'expo/config-plugins'
import fs from 'fs'
import path from 'path'
import { DynatracePluginProps } from './index'

const PLUGIN_GRADLE_LINE = `apply from: "../node_modules/@dynatrace/react-native-plugin/files/plugin.gradle", to: buildscript`

const ROOT_DYNATRACE_APPLY_LINE = `apply from: "./dynatrace.gradle"`

const RUNTIME_GRADLE_LINE = `apply from: "../../node_modules/@dynatrace/react-native-plugin/files/plugin-runtime.gradle"`

export const withAndroidConfiguration: ConfigPlugin<DynatracePluginProps> = (
  config,
  props
) => {
  const {
    applicationId,
    beaconUrl,
    userOptIn = false,
    startupLoadBalancing = true,
  } = props

  config = withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents

    if (!contents.includes(PLUGIN_GRADLE_LINE)) {
      const buildscriptIndex = contents.indexOf('buildscript {')
      if (buildscriptIndex === -1) {
        throw new Error(
          'dynatrace-expo-plugin: Could not find "buildscript {" in android/build.gradle.'
        )
      }

      const insertPos = contents.indexOf('\n', buildscriptIndex) + 1
      contents =
        contents.slice(0, insertPos) +
        PLUGIN_GRADLE_LINE +
        '\n' +
        contents.slice(insertPos)
    }

    if (!contents.includes(ROOT_DYNATRACE_APPLY_LINE)) {
      const marker = 'apply plugin: "expo-root-project"'
      const markerIndex = contents.indexOf(marker)
      if (markerIndex === -1) {
        throw new Error(
          'dynatrace-expo-plugin: Could not find `apply plugin: "expo-root-project"` in android/build.gradle.'
        )
      }

      const insertPos = contents.indexOf('\n', markerIndex) + 1
      contents =
        contents.slice(0, insertPos) +
        ROOT_DYNATRACE_APPLY_LINE +
        '\n' +
        contents.slice(insertPos)
    }

    config.modResults.contents = contents
    return config
  })

  config = withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents

    if (!contents.includes(RUNTIME_GRADLE_LINE)) {
      contents = contents.trimEnd() + '\n' + RUNTIME_GRADLE_LINE + '\n'
    }

    config.modResults.contents = contents
    return config
  })

  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const androidProjectRoot = config.modRequest.platformProjectRoot // <project>/android
      const gradlePath = path.join(androidProjectRoot, 'dynatrace.gradle')

      const dynatraceGradle = `
ext['dynatrace.instrumentationFlavor'] = 'react_native'
apply plugin: 'com.dynatrace.instrumentation'

// AUTO - INSERTED

dynatrace {
    configurations {
        defaultConfig {
            autoStart {
                applicationId '${applicationId}'
                beaconUrl '${beaconUrl}'
            }
            userOptIn ${userOptIn ? 'true' : 'false'}
            agentBehavior.startupLoadBalancing ${
              startupLoadBalancing ? 'true' : 'false'
            }
        }
    }
}

// AUTO - INSERTED
`.trimStart()

      fs.writeFileSync(gradlePath, dynatraceGradle, 'utf8')

      return config
    },
  ])

  return config
}
