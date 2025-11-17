# R3F Hooks Error Fix - Dependency Tree & Solution

## 🔍 Root Cause Analysis

**Error:** `R3F: Hooks can only be used within the Canvas component!`

**Root Cause:** Components using R3F hooks (`useFrame`, `useThree`, `useScroll`) or hook-using drei components (`Text`, `EffectComposer`, `Bloom`) were being imported/evaluated before the Canvas component mounted.

## 📊 Dependency Tree (Before Fix)

```
PivcorEcosystemScroll.tsx
├── Canvas (✅ Safe)
├── ScrollControls (✅ Safe - no hooks)
├── Scroll (✅ Safe - no hooks)
├── EffectComposer (❌ PROBLEM - internally uses hooks)
│   └── Bloom (❌ PROBLEM - internally uses hooks)
└── EcosystemExperienceInternal (✅ Dynamically imported)
    ├── useScroll (✅ Inside Canvas)
    ├── useThree (✅ Inside Canvas)
    ├── useFrame (✅ Inside Canvas)
    ├── Text from drei (✅ Inside Canvas)
    ├── CoreSphere (✅ Inside Canvas)
    │   └── useFrame (✅ Inside Canvas)
    ├── OrbitRing (✅ Inside Canvas)
    │   └── useFrame (✅ Inside Canvas)
    └── OrbitingNode (✅ Inside Canvas)
        └── useFrame (✅ Inside Canvas)
```

**Problem:** `EffectComposer` and `Bloom` were imported in the main file, causing hooks to be evaluated before Canvas mounted.

## ✅ Dependency Tree (After Fix)

```
PivcorEcosystemScroll.tsx (NO HOOKS)
├── Canvas (✅ Safe)
├── ScrollControls (✅ Safe - no hooks)
├── Scroll (✅ Safe - no hooks)
└── EcosystemExperienceInternal (✅ Dynamically imported - ALL HOOKS HERE)
    ├── useScroll (✅ Inside Canvas)
    ├── useThree (✅ Inside Canvas)
    ├── useFrame (✅ Inside Canvas)
    ├── Text from drei (✅ Inside Canvas)
    ├── EffectComposer (✅ MOVED HERE - inside Canvas)
    │   └── Bloom (✅ MOVED HERE - inside Canvas)
    ├── CoreSphere (✅ Inside Canvas)
    │   └── useFrame (✅ Inside Canvas)
    ├── OrbitRing (✅ Inside Canvas)
    │   └── useFrame (✅ Inside Canvas)
    └── OrbitingNode (✅ Inside Canvas)
        └── useFrame (✅ Inside Canvas)
```

## 🎯 Solution Applied

### 1. **PivcorEcosystemScroll.tsx** (Main File - Safe Zone)
- ✅ Contains ONLY: `Canvas`, `ScrollControls`, `Scroll`
- ✅ NO hooks imported
- ✅ NO `EffectComposer` or `Bloom` imported
- ✅ Dynamic import of `EcosystemExperienceInternal`

### 2. **EcosystemExperienceInternal.tsx** (Hook Zone)
- ✅ Contains ALL R3F hooks: `useScroll`, `useThree`, `useFrame`
- ✅ Contains ALL hook-using components: `CoreSphere`, `OrbitRing`, `OrbitingNode`
- ✅ Contains ALL drei components: `Text`
- ✅ Contains post-processing: `EffectComposer`, `Bloom` (MOVED HERE)
- ✅ All components rendered inside Canvas context

### 3. **EcosystemScene.tsx** (Pure Component)
- ✅ No hooks
- ✅ Currently unused (kept for reference)

## 🔧 Key Changes

1. **Moved `EffectComposer` and `Bloom`** from main file to internal file
2. **Removed all hook imports** from main file
3. **Ensured dynamic import** loads hooks only after Canvas mounts
4. **All hook-using components** are now in the internal file

## ✅ Verification Checklist

- [x] Main file has NO hooks
- [x] Main file has NO `EffectComposer`/`Bloom` imports
- [x] All hooks are in `EcosystemExperienceInternal.tsx`
- [x] Dynamic import ensures hooks load after Canvas mounts
- [x] All drei components (`Text`) are in internal file
- [x] All post-processing is in internal file

## 🎉 Expected Result

The error `R3F: Hooks can only be used within the Canvas component!` should now be **completely eliminated** because:

1. No hooks are imported in the main file
2. All hooks are dynamically imported and only evaluated after Canvas mounts
3. All hook-using components are inside the Canvas rendering context

