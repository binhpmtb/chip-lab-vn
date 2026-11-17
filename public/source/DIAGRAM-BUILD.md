# Diagram bundle sources

The deployed netlistsvg browser bundle is rebuilt from npm `netlistsvg@1.0.2` using the included dependency lockfile. ELK uses the unmodified npm `elkjs@0.12.1` browser bundle, licensed under EPL-2.0 OR GPL-3.0-or-later. The ELK wrapper source archive is provided here, and the underlying Java implementation is available from https://github.com/eclipse-elk/elk and https://github.com/kieler/elkjs. The elkjs release source contains its Gradle build and dependency versions.

Create an empty build directory, copy `diagram-package.json` to `package.json` and `diagram-package-lock.json` to `package-lock.json`, then run these commands.

```sh
npm ci
npx browserify -t brfs -s netlistsvg node_modules/netlistsvg/jsmodule/index.js -o netlistsvg.bundle.js
cp node_modules/elkjs/lib/elk.bundled.js elk.bundled.js
```

The original VeriSim ELK bundle identified EPL-1.0 in its header. It has been replaced with the explicitly versioned modern bundle. The rebuilt netlistsvg bundle and ELK were tested together by rendering the package's digital example to SVG.

ELK compiles code from Eclipse Layout Kernel and dependencies such as Google Web Toolkit and Guava. Their respective license terms apply. Full npm runtime notices and collected vendor notices are available at `/third-party-notices.txt`.
