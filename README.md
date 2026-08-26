<h1 align="center" style="display: flex; align-items: center; justify-content: center; gap: 8px;"> <img src="https://github.com/user-attachments/assets/dab6c2a1-4530-46b3-b083-1fcf8e9e7ec1" alt="400x400bb-75" height="36" /> UT Compass </h1>

All of freshmen year, I kept losing track of which building my classes were in, so I built an app to fix that! 
UT Compass is a small iOS app for UT Austin students it holds your classes (or clubs, or whatever else you want
to organize) along with where they actually are, and gets you walking directions to any of them in one tap. 

[Download today on the App Store!](https://apps.apple.com/us/app/ut-compass/id6801411805)

---
<img width="24%"  alt="460x996bb (1)" src="https://github.com/user-attachments/assets/4ab6a125-a144-4f0b-8f10-5cc5634d4e7c" />
<img width="24%"  alt="460x996bb" src="https://github.com/user-attachments/assets/095516b6-f13e-4eb2-83df-3de33609e9b3" />
<img width="24%" height="995" alt="460x996bb (3)" src="https://github.com/user-attachments/assets/680175e4-6f9e-48d9-b9a5-a41b522fa737" />
<img width="24%" height="995" alt="460x996bb (2)" src="https://github.com/user-attachments/assets/c4b822e4-1ca0-4457-b267-bb9d5e8bb317" />


## Table of Contents

- [Features](#features)
- [What Did I Learn](#what-did-i-learn)
- [MyTech Stack](#mytech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)


---

## Features

### Your List
Track your classes (or clubs, or anything else) in categories you make yourself!
pick a name, icon, and color for each one. Every entry can have more than one
location, each with its own building, room number, and an optional day/time if it's something 
recurring. You can long-press an entry to edit or delete it, and tap a location to get walking directions right away, through any app and format.

### Map
Browse campus buildings, food spots, study spots, and points of interest, filtered by category.
Tap a pin and a sheet pops up with a human written description (I hated how 'slop' everything feeled in this aspect in other apps,
whats the point of an app if its soul is a AI who hasnt gone there, especially for a TRAVEL APP), a Go button for directions, 
and an Add button that attaches that exact place to something in your list without you having to type the building in again.

### Add / Edit
Pick an icon, give it a title, add as many locations as you need. Building search is a real autocomplete against the campus building list, not a plain text field, 
so you can't accidentally save something you typed but never actually selected.

### Settings
Light/Dark/Auto (system) theme. 
Export your whole list as a JSON file and share it however you want,
or import one back in, and lastly clear all of your data to start over. 

### What's New
A changelog screen so you can see what changed between updates.

## What Did I learn?


Throughout my first year of computer science I had made so many small projects in different languages but it felt as if everything I learned felt so directionless,
so I decided that I wanted to push a product to completion, because that meant that I could do it.

And it sounds childish and naive to say, but it worked. This is my capstone of my summer projects of learning HTML, CSS, JAVASCRIPT and React Native.
I learned so much and so rapidly I truly cannot believe I didn't do this sooner, and although it took these four months of coding I feel like I can sink
my teeth into it without fearing it is simply 'not for me', I now feel with my other experience that programming and computers truly are for me. Especially
as a student in Computer Science in a post AI-environment, it felt nice to go through and truly LEARN fundamental concepts and understanding through reading,
mainly through w3schools tutorials and various "Concept for dummies" I had proudly bought when entering college thinking I'd read them every night.

But taking the "long" way truly does feel like now I understand computing and coding at a more fundamental level and like I really do truly... enjoy the field.

## MyTech Stack

Here's what's actually running this app, inspired by UT Dining (see below):

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

## Getting Started (ORIGINALLY FROM AND ONLY SLIGTLY MODIFIED FROM REACT NATIVE OFFICAL DOC'S)

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

> You need `--legacy-peer-deps` here because nativewind and React 19 don't agree on peer deps yet. A plain `npm install` will just fail.

### Run

```bash
npx expo run:ios --device
```

or open the simulator with:

```bash
npx expo run:ios
```

---

## Project Structure (from tree command in terminal)

```
src/
├── app/
│   ├── _layout.tsx              # root layout: themeing and root
│   ├── (tabs)/
│   │   ├── _layout.tsx          # tab bar: bottom bar
│   │   ├── index.jsx            # Your List: classes and other things logged
│   │   ├── map.jsx              # campus map with handmade entries
│   │   ├── settings.jsx         # theme, backup/restore, reset, about
│   │   └── updates.tsx          # changelog screen
│   ├── categoryModal.jsx        # add/edit/delete a category
│   └── modalChange.jsx          # add/edit a single list entry
│
├── components/
│   ├── BuildingAutocomplete.jsx # building search-and-select field
│   ├── IconPicker.jsx           # icon select
│   ├── LocationBlock.jsx        # contains all info consolidated into one
│   ├── Pill.jsx                 # reusable pill/chip/row layout
│   ├── ThemedTextInput.tsx      # theme aware text input
│   ├── TopBar.jsx               # head for app + pill
│   ├── Welcome.jsx              # first-launch welcome
│   ├── dayPicker.jsx            # multi-select weekday picker (M)(T)(W)
│   └── timePicker.jsx           # start/end time picker
│
├── data/
│   ├── building.json            # campus building/place directory
│   ├── buildingClassItem.js     # builds a new list entry
│   ├── catagories.js            # default categories, icons, color options
│   ├── privacy-policy.html
│   ├── storage.js               # AsyncStorage read/write &- export/import
│   ├── tags.js                  # map filter tags and sections
│   └── validation.js            # form validation for list entries
│
└── style/
    ├── darkMode.tsx             # ThemeProvider and the useTheme
    ├── haptics.js               # haptic feedback helpers
    └── styles.tsx               # shared colors, accent palette, style helpers
```

---

## Known Limitations

- **iOS only right now.**
- **No home screen widget yet**
- Some screens still have their own copy-pasted layout styles instead of pulling from one shared file. Working on it.
- Needs slight refactoring, to make files more managable to read and more modular.
---

## Roadmap

- [ ] Notifications!
- [ ] Home-screen widgets so you can go where you need to go even quicker!
- [ ] a Choose-for-me catagory or a food-wheel, for people such as myself who can never decide what to eat. 

---

## Acknowledgments

- I leaned on [Longhorn Developers' UT Dining](https://github.com/orgs/Longhorn-Developers) app (MIT licensed, same stack — React Native, Expo Router, TypeScript) while figuring out a lot of the map and UI patterns here. Good repo to study if you're building something similar.

---

## Contact

Bugs, questions, whatever — email me at **Ryanling.dev@outlook.com** or open an issue on this repo.
