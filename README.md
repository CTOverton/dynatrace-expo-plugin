# 📦 dynatrace-expo-plugin
**An Expo config plugin for integrating the Dynatrace React Native agent into Expo prebuild projects.**

This plugin automatically configures the required native changes for the  
[`@dynatrace/react-native-plugin`](https://www.npmjs.com/package/@dynatrace/react-native-plugin) package, so you no longer need to manually edit:

- iOS **Info.plist**
- Android **build.gradle**
- Android **app/build.gradle**
- Android **dynatrace.gradle** (auto-generated)

It ensures Dynatrace instrumentation works correctly in Expo-managed (prebuild) projects.

---

## ✨ Features

- 🔧 Automatically inserts Dynatrace native configuration during `expo prebuild`
- 📱 Supports both **iOS** and **Android**
- ⚙️ Generates & updates all required Dynatrace Gradle files
- 🛠 No more manual native edits
- 🚀 Works with EAS Build

---

## 📦 Installation

### 1. Install Dynatrace React Native SDK

```bash
npm install @dynatrace/react-native-plugin
```

### 2. Install the Expo config plugin

```bash
npm install dynatrace-expo-plugin
```

---

## 🚀 Usage

Add the plugin to your **app.json** or **app.config.js/ts**.

### Example (app.config.ts)

```ts
export default {
  name: "my-app",
  slug: "my-app",

  plugins: [
    [
      "dynatrace-expo-plugin",
      {
        applicationId: "YOUR-APPLICATION-ID",
        beaconUrl: "https://example.live.dynatrace.com/mbeacon",

        // Optional overrides:
        logLevel: "ALL",
        userOptIn: false,
        startupLoadBalancing: true,
        disableWebRequestsInstrumentationV2: true,
        excludedControls: ["PickerView", "Switch"]
      }
    ]
  ]
};
```

---

## 🔧 Plugin Props

### Required Props

| Prop            | Type     | Description |
|-----------------|----------|-------------|
| `applicationId` | string   | Dynatrace application ID from your Dynatrace environment |
| `beaconUrl`     | string   | Dynatrace beacon URL (usually ends with `/mbeacon`) |

### Optional Props (with defaults)

| Prop                                 | Type      | Default | Description |
|--------------------------------------|-----------|---------|-------------|
| `logLevel`                           | string    | `"ALL"` | iOS log level |
| `userOptIn`                          | boolean   | `false` | Enables Dynatrace user consent mode |
| `startupLoadBalancing`               | boolean   | `true`  | Enables startup load balancing |
| `disableWebRequestsInstrumentationV2`| boolean   | `true`  | Disables advanced web request instrumentation (iOS) |
| `excludedControls`                   | string[]  | `["PickerView", "Switch"]` | UI controls to exclude from instrumentation |

---

## 🛠 What the Plugin Does

### iOS

Automatically writes the following keys to **Info.plist**:

- `DTXApplicationID`
- `DTXBeaconURL`
- `DTXLogLevel`
- `DTXUserOptIn`
- `DTXStartupLoadBalancing`
- `DTXFlavor = "react_native"`
- `DTXDisableWebRequestsInstrumentationV2`
- `DTXExcludedControls` array

### Android

#### Modifies `android/build.gradle`:

- Applies Dynatrace `plugin.gradle`
- Adds `apply from: "./dynatrace.gradle"`

#### Modifies `android/app/build.gradle`:

- Adds Dynatrace runtime plugin (`plugin-runtime.gradle`)

#### Generates `android/dynatrace.gradle`:

Automatically creates:

```gradle
ext['dynatrace.instrumentationFlavor'] = 'react_native'
apply plugin: 'com.dynatrace.instrumentation'

dynatrace {
  configurations {
    defaultConfig {
      autoStart {
        applicationId 'YOUR-ID'
        beaconUrl 'YOUR-URL'
      }
      userOptIn false
      agentBehavior.startupLoadBalancing true
    }
  }
}
```

---

## 🧪 Testing / Prebuild

Run:

```bash
npx expo prebuild --clean
```

Then verify:

- `ios/*/Info.plist` contains Dynatrace keys
- `android/build.gradle` is patched
- `android/app/build.gradle` includes plugin-runtime
- `android/dynatrace.gradle` is generated

---

## ⚠️ Notes & Requirements

- This plugin only runs when using `expo prebuild` or EAS Build.
- Not needed for bare React Native apps (use Dynatrace setup instructions instead).
- Ensure the Dynatrace SDK is installed:

```bash
npm install @dynatrace/react-native-plugin
```

---

## 🐛 Troubleshooting

**“Dynatrace configuration not found”**  
→ Ensure `applicationId` and `beaconUrl` are passed to the plugin.

**Android build errors after upgrading Expo SDK**  
→ Re-run:

```bash
npx expo prebuild --clean
```

**Plugin not applying**  
→ Ensure plugin appears in:

```bash
expo config --json
```

---

## 📄 License

MIT

---

## 🤝 Contributing

PRs and issues are welcome!  
If you have improvements for Android/iOS instrumentation or want test coverage added, feel free to open a pull request.
