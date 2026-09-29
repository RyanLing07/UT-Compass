<h1 align="center" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
  <img src="https://github.com/user-attachments/assets/dab6c2a1-4530-46b3-b083-1fcf8e9e7ec1" alt="UT Compass app icon" height="36" />
  UT Compass
</h1>

<p align="center"><i>For Longhorns, by Longhorns.</i></p>

All of freshman year, I kept losing track of which building my classes were in, so I built an app to fix that!

UT Compass is a small iOS app for UT Austin students. It holds your classes (or clubs, or whatever else you want to organize) along with where they actually are, and gets you walking directions to any of them in one tap. It works with no signal, and it never asks for an account.

[**Download it on the App Store!**](https://apps.apple.com/us/app/ut-compass/id6801411805)

---

<img width="24%" alt="UT Compass screenshot 1" src="https://github.com/user-attachments/assets/4ab6a125-a144-4f0b-8f10-5cc5634d4e7c" />
<img width="24%" alt="UT Compass screenshot 2" src="https://github.com/user-attachments/assets/095516b6-f13e-4eb2-83df-3de33609e9b3" />
<img width="24%" height="995" alt="UT Compass screenshot 3" src="https://github.com/user-attachments/assets/680175e4-6f9e-48d9-b9a5-a41b522fa737" />
<img width="24%" height="995" alt="UT Compass screenshot 4" src="https://github.com/user-attachments/assets/c4b822e4-1ca0-4457-b267-bb9d5e8bb317" />

## Table of Contents

- [Features](#features)
- [Privacy](#privacy)
- [What I Learned](#what-i-learned)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Acknowledgments](#acknowledgments)
- [Disclaimer](#disclaimer)
- [Contact](#contact)

---

## Features

### Your List
Track your classes (or clubs, or anything else) in categories you make yourself. Pick a name, icon, and color for each one. Every entry can have more than one location, each with its own building, room number, and an optional day and time if it's recurring. Long-press an entry to edit or delete it, and tap a location to get walking directions right away, in whichever map app you use.

### Map
Browse campus buildings, residence halls, food spots, study spots, and points of interest, filtered by category. Tap a pin and a sheet pops up with a description, a **Go** button for directions, and an **Add** button that attaches that exact place to something in your list, so you don't have to type the building in again.

Every description in the directory is written by hand, by a student who has actually been to these places. I wanted the app to feel like a friend showing you around, not generated filler, and that matters most in a campus guide.

### Add / Edit
Pick an icon, give it a title, and add as many locations as you need. Building search is a real autocomplete against the campus building list, not a plain text field, so you can't accidentally save something you typed but never actually selected.

### Settings
Light, dark, or auto (system) theme. Export your whole list as a JSON file and share it however you want, import one back in, or clear all of your data and start over.

### What's New
A changelog screen so you can see what changed between updates.

---

## Privacy

No account. No tracking. No ads. Everything you save lives on your phone, and the whole campus directory ships inside the app, so nothing needs to load over the network. You can export a backup or wipe your data whenever you want. Read the full [privacy policy](https://ryanling07.github.io/UT-Compass/privacy-policy.html).

---

## What I Learned

Throughout my first year of computer science, I made lots of small projects in different languages, but everything felt directionless. I decided to push one product all the way to completion, to prove to myself that I could.

It sounds naive, but it worked. UT Compass is the capstone of my summer of learning HTML, CSS, JavaScript, and React Native. It took about four months, and I learned a huge amount along the way. I came out of it feeling that programming is something I genuinely want to do, not something I'm afraid isn't for me.

As a CS student in a post-AI world, I also wanted to actually learn the fundamentals. I did that mostly by reading, through W3Schools tutorials and the "for Dummies"-style books I proudly bought when I started college, thinking I'd read them every night. Taking the long way means I now understand computing at a more fundamental level, and I really do enjoy the field.

---

## Tech Stack

Here's what actually runs this app (inspired by [UT Dining](#acknowledgments)):

| Layer | Choice |
|---|---|
| Framework | [Expo](https://expo.dev/) (SDK 57) + [Expo Router](https://docs.expo.dev/router/introduction/) |
| UI runtime | React 19 / React Native |
| Language | TypeScript, with some plain JS/JSX screens |
| Local storage | `@react-native-async-storage/async-storage` |
| Maps & location | `react-native-maps`, `react-native-map-link`, `expo-location` |
| Bottom sheets | `@gorhom/bottom-sheet` |
| Icons | `lucide-react-native` |
| Haptics | `expo-haptics` |
| Backup / restore | `expo-file-system`, `expo-sharing`, `expo-document-picker` |

**Platform:** iOS only

---

## Getting Started

Adapted from the official React Native docs.

### Prerequisites
- Node.js and npm
- Xcode (for the iOS simulator or a device build)
- An iOS device or simulator

### Install

```bash
git clone https://github.com/RyanLing07/UT-Compass.git
cd UT-Compass
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because NativeWind and React 19 don't agree on peer dependencies yet. A plain `npm install` will fail.

### Run

On a connected device:

```bash
npx expo run:ios --device
```

Or in the simulator:

```bash
npx expo run:ios
```

---

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx              # root layout: theming and root setup
│   ├── (tabs)/
│   │   ├── _layout.tsx          # bottom tab bar
│   │   ├── index.jsx            # Your List: classes and other logged items
│   │   ├── map.jsx              # campus map with handmade entries
│   │   ├── settings.jsx         # theme, backup/restore, reset, about
│   │   └── updates.tsx          # changelog screen
│   ├── categoryModal.jsx        # add/edit/delete a category
│   └── modalChange.jsx          # add/edit a single list entry
│
├── components/
│   ├── BuildingAutocomplete.jsx # building search-and-select field
│   ├── IconPicker.jsx           # icon select
│   ├── LocationBlock.jsx        # all of one location's info in one block
│   ├── Pill.jsx                 # reusable pill/chip/row layout
│   ├── ThemedTextInput.tsx      # theme-aware text input
│   ├── TopBar.jsx               # app header + category pills
│   ├── Welcome.jsx              # first-launch welcome
│   ├── dayPicker.jsx            # multi-select weekday picker (M/T/W...)
│   └── timePicker.jsx           # start/end time picker
│
├── data/
│   ├── building.json            # campus building/place directory
│   ├── buildingClassItem.js     # builds a new list entry
│   ├── categories.js            # default categories, icons, color options
│   ├── privacy-policy.html
│   ├── storage.js               # AsyncStorage read/write and export/import
│   ├── tags.js                  # map filter tags and sections
│   └── validation.js            # form validation for list entries
│
└── style/
    ├── darkMode.tsx             # ThemeProvider and useTheme
    ├── haptics.js               # haptic feedback helpers
    └── styles.tsx               # shared colors, accent palette, style helpers
```

> Note: the file is named `catagories.js` in the repo right now. Rename it to `categories.js` (and update its imports) so this tree matches, or change the name above to match the repo.

---

## Known Limitations

- iOS only, for now.
- No home screen widget yet.
- Some screens still carry their own copy of layout styles instead of pulling from one shared file. I'm working on it.
- Some files need refactoring to be more modular and easier to read.

---

## Roadmap

- [ ] Notifications
- [ ] Home-screen widgets, so you can get where you need to go even faster
- [ ] A "choose for me" category (or a food wheel) for people like me who can never decide what to eat

---

## Acknowledgments

I leaned on [Longhorn Developers' UT Dining](https://github.com/Longhorn-Developers/UT-Dining) app (MIT licensed, same stack: React Native, Expo Router, TypeScript) while figuring out many of the map and UI patterns here. It's a good repo to study if you're building something similar.

---

## Disclaimer

UT Compass is an independent student project. It is not affiliated with, endorsed by, or sponsored by The University of Texas at Austin.

---

## Contact

Bugs, questions, whatever: email me at **[Ryanling.dev@outlook.com](mailto:Ryanling.dev@outlook.com)** or open an issue on this repo.

---

## Contact

Bugs, questions, whatever — email me at **Ryanling.dev@outlook.com** or open an issue on this repo!
