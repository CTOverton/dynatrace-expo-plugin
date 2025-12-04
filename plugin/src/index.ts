import { type ConfigPlugin } from 'expo/config-plugins'
import { withAndroidConfiguration } from './withAndroid'
import { withIosConfiguration } from './withIos'

export interface DynatracePluginProps {
  /**
   * Required: Dynatrace Application ID.
   * Used for iOS (DTXApplicationID) and Android (autoStart.applicationId).
   */
  applicationId: string

  /**
   * Required: Dynatrace Beacon URL.
   * Used for iOS (DTXBeaconURL) and Android (autoStart.beaconUrl).
   */
  beaconUrl: string

  /**
   * Log level for Dynatrace OneAgent.
   * iOS: DTXLogLevel, Android: matching agent log level if you wire it.
   * Default: 'ALL'.
   */
  logLevel?: string

  /**
   * Whether user opt-in mode is enabled.
   * iOS: DTXUserOptIn, Android: userOptIn.
   * Default: false.
   */
  userOptIn?: boolean

  /**
   * Enable startup load balancing.
   * iOS: DTXStartupLoadBalancing, Android: agentBehavior.startupLoadBalancing.
   * Default: true (matches your snippet).
   */
  startupLoadBalancing?: boolean

  /**
   * Disable web requests instrumentation v2 on iOS.
   * iOS: DTXDisableWebRequestsInstrumentationV2.
   * Default: true (to match your current config), or undefined to leave Dynatrace default.
   */
  disableWebRequestsInstrumentationV2?: boolean

  /**
   * iOS UI controls to exclude from instrumentation.
   * iOS: DTXExcludedControls.
   * Default: ['PickerView', 'Switch'] (matches your snippet).
   */
  excludedControls?: string[]
}

const withDynatrace: ConfigPlugin<DynatracePluginProps> = (
  config,
  props = {
    applicationId: '',
    beaconUrl: '',
  }
) => {
  try {
    if (!props.applicationId) {
      throw new Error(
        'dynatrace-expo-plugin: "applicationId" is required for Dynatrace configuration.'
      )
    }

    if (!props.beaconUrl) {
      throw new Error(
        'dynatrace-expo-plugin: "beaconUrl" is required for Dynatrace configuration.'
      )
    }

    config = withAndroidConfiguration(config, props)
    config = withIosConfiguration(config, props)

    return config
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Failed to configure Dynatrace plugin: ${error.message}`)
    else throw new Error('Failed to configure Dynatrace plugin')
  }
}

export default withDynatrace
