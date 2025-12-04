import { type ConfigPlugin, withInfoPlist } from 'expo/config-plugins'
import { DynatracePluginProps } from './index'

export const withIosConfiguration: ConfigPlugin<DynatracePluginProps> = (
  config,
  props
) => {
  return withInfoPlist(config, (config) => {
    const {
      applicationId,
      beaconUrl,
      logLevel = 'ALL',
      userOptIn = false,
      startupLoadBalancing = true,
      disableWebRequestsInstrumentationV2 = true,
      excludedControls = ['PickerView', 'Switch'],
    } = props

    const infoPlist = config.modResults

    infoPlist.DTXApplicationID = applicationId
    infoPlist.DTXBeaconURL = beaconUrl
    infoPlist.DTXLogLevel = logLevel
    infoPlist.DTXUserOptIn = userOptIn
    infoPlist.DTXStartupLoadBalancing = startupLoadBalancing
    infoPlist.DTXFlavor = 'react_native'
    infoPlist.DTXDisableWebRequestsInstrumentationV2 =
      disableWebRequestsInstrumentationV2

    if (excludedControls && excludedControls.length > 0) {
      infoPlist.DTXExcludedControls = excludedControls
    }

    return config
  })
}
