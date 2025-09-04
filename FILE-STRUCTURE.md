# File Structure - GitHub Upload Guide

This document shows the complete file structure with ❌ marking files that should **NOT** be uploaded to GitHub.

```
canvas-app-simple/
├── .gitignore
├── DEPLOYMENT.md
├── DESKTOP-INSTALLATION.md
├── package-lock.json
├── package.json
├── PORTABLE-RELEASE-NOTE.md
├── README-DISTRIBUTION.md
├── README.md
├── RELEASE-NOTES.md
├── tsconfig.json
├── ❌ dist-electron/
│   ├── ❌ builder-debug.yml
│   ├── ❌ builder-effective-config.yaml
│   ├── ❌ Careless-Canvas-NML Setup 1.0.0-rc.1.exe
│   ├── ❌ Careless-Canvas-NML Setup 1.0.0-rc.1.exe.blockmap
│   ├── ❌ Careless-Canvas-NML-1.0.0-rc.1-portable.exe
│   └── ❌ win-unpacked/
│       ├── ❌ Careless-Canvas-NML.exe
│       ├── ❌ chrome_100_percent.pak
│       ├── ❌ chrome_200_percent.pak
│       ├── ❌ d3dcompiler_47.dll
│       ├── ❌ ffmpeg.dll
│       ├── ❌ icudtl.dat
│       ├── ❌ libEGL.dll
│       ├── ❌ libGLESv2.dll
│       ├── ❌ LICENSE.electron.txt
│       ├── ❌ LICENSES.chromium.html
│       ├── ❌ resources.pak
│       ├── ❌ snapshot_blob.bin
│       ├── ❌ v8_context_snapshot.bin
│       ├── ❌ vk_swiftshader_icd.json
│       ├── ❌ vk_swiftshader.dll
│       ├── ❌ vulkan-1.dll
│       ├── ❌ locales/
│       │   ├── ❌ af.pak
│       │   ├── ❌ am.pak
│       │   ├── ❌ ar.pak
│       │   ├── ❌ bg.pak
│       │   ├── ❌ bn.pak
│       │   ├── ❌ ca.pak
│       │   ├── ❌ cs.pak
│       │   ├── ❌ da.pak
│       │   ├── ❌ de.pak
│       │   ├── ❌ el.pak
│       │   ├── ❌ en-GB.pak
│       │   ├── ❌ en-US.pak
│       │   ├── ❌ es-419.pak
│       │   ├── ❌ es.pak
│       │   ├── ❌ et.pak
│       │   ├── ❌ fa.pak
│       │   ├── ❌ fi.pak
│       │   ├── ❌ fil.pak
│       │   ├── ❌ fr.pak
│       │   ├── ❌ gu.pak
│       │   ├── ❌ he.pak
│       │   ├── ❌ hi.pak
│       │   ├── ❌ hr.pak
│       │   ├── ❌ hu.pak
│       │   ├── ❌ id.pak
│       │   ├── ❌ it.pak
│       │   ├── ❌ ja.pak
│       │   ├── ❌ kn.pak
│       │   ├── ❌ ko.pak
│       │   ├── ❌ lt.pak
│       │   ├── ❌ lv.pak
│       │   ├── ❌ ml.pak
│       │   ├── ❌ mr.pak
│       │   ├── ❌ ms.pak
│       │   ├── ❌ nb.pak
│       │   ├── ❌ nl.pak
│       │   ├── ❌ pl.pak
│       │   ├── ❌ pt-BR.pak
│       │   ├── ❌ pt-PT.pak
│       │   ├── ❌ ro.pak
│       │   ├── ❌ ru.pak
│       │   ├── ❌ sk.pak
│       │   ├── ❌ sl.pak
│       │   ├── ❌ sr.pak
│       │   ├── ❌ sv.pak
│       │   ├── ❌ sw.pak
│       │   ├── ❌ ta.pak
│       │   ├── ❌ te.pak
│       │   ├── ❌ th.pak
│       │   ├── ❌ tr.pak
│       │   ├── ❌ uk.pak
│       │   ├── ❌ ur.pak
│       │   ├── ❌ vi.pak
│       │   ├── ❌ zh-CN.pak
│       │   └── ❌ zh-TW.pak
│       └── ❌ resources/
│           ├── ❌ app.asar
│           └── ❌ elevate.exe
├── public/
│   ├── electron.js
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── preload.js
│   └── robots.txt
└── src/
    ├── App.css
    ├── App.test.tsx
    ├── App.tsx
    ├── index.css
    ├── index.tsx
    ├── logo.svg
    ├── react-app-env.d.ts
    ├── reportWebVitals.ts
    ├── setupTests.ts
    ├── components/
    │   ├── Canvas.tsx
    │   └── PageNode.tsx
    ├── stores/
    │   └── canvasStore.ts
    ├── types/
    │   └── index.ts
    └── utils/
        └── nmlFormat.ts
```

## Summary

### ✅ Files to INCLUDE in GitHub:
- All source code files (`.tsx`, `.ts`, `.css`, `.js`)
- Configuration files (`package.json`, `tsconfig.json`, `.gitignore`)
- Documentation files (`.md` files)
- Public assets (`public/` directory)

### ❌ Files to EXCLUDE from GitHub:
- **`dist-electron/`** - Entire build/distribution directory containing:
  - Executable files (`.exe`)
  - Dynamic libraries (`.dll`)
  - Compiled assets (`.pak` files)
  - All build artifacts and packaged applications

These excluded files are generated during the build process and should not be version controlled.
