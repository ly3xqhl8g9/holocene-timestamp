<p align="center">
    <img src="https://raw.githubusercontent.com/ly3xqhl8g9/holocene-timestamp/master/about/images/logo.png" height="200px">
</p>


<p align="center">
    <a href="https://chrome.google.com/webstore/detail/holocene-epoch-addverter/fbdlbdcmaglfifdihlihdpnnnidnippp">
        <img src="https://img.shields.io/badge/chrome-v1.0.6-blue.svg?colorB=004F91&style=for-the-badge" alt="Published Chrome Version">
    </a>
    <a href="https://github.com/ly3xqhl8g9/holocene-timestamp/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-DEL-blue.svg?colorB=492356&style=for-the-badge" alt="License">
    </a>
</p>



# Holocene Epoch Timestamp

Browser extension to add the Holocene Epoch timestamp before or after the timestamps read from the webpage (or replace them).

The 1.1.0 source update preserves the existing interface and preferences while replacing the conversion engine. The shipping extension lives in `packages/extension-chrome-legacy`; `packages/holocene-timestamp-parser` supplies its shared parser. The older React prototype and website are outside the active pnpm workspace.

### Development and releases

Use Node 24 LTS (24.15 or newer) and pnpm 11.3.0:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm package
```

`pnpm dev` watches the extension. Load `packages/extension-chrome-legacy/distribution` as an unpacked Chrome extension. Reload the extension after code changes and reload pages after preference changes.

`pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm test:e2e` are also available individually. Packaging creates a validated ZIP and checksum under `release/`. See [architecture](docs/ARCHITECTURE.md), [release instructions](docs/RELEASE.md), [verification evidence](docs/VERIFICATION.md), and the [changelog](CHANGELOG.md).

The Holocene Epoch sets the first year of the "recent" epoch 10,000 years before the first Anno Domini (1 AD) for a better grasping of the development of the human civilization. The proposal was advanced by Cesare Emiliani in 1993 (see more in the What is the Holocene Epoch? section below).

e.g.
- "1 Aug. 2019" can become "1 Aug. 2019 [12019 [HE](https://en.wikipedia.org/wiki/Holocene_calendar)]";
- "399 BC" can become "*/9602 HE/* 399 BC";
- "10 Sep. 259 BC" can become "10 Sep. 9742 HE".


<br>


+ [HET on Wikipedia](#het-on-wikipedia)
+ [HET Options](#het-options)
+ [What is the Holocene Epoch?](#what-is-the-holocene-epoch)



### HET on Wikipedia

![Caesar](https://raw.githubusercontent.com/ly3xqhl8g9/holocene-timestamp/master/about/images/caesar.jpg)
#### [Julius Caesar's Wikipedia page](https://en.wikipedia.org/wiki/Julius_Caesar) with *default* settings on HET.


![Newton](https://raw.githubusercontent.com/ly3xqhl8g9/holocene-timestamp/master/about/images/newton.jpg)
#### [Isaac Newton's Early Life Wikipedia page](https://en.wikipedia.org/wiki/Early_life_of_Isaac_Newton) with the Holocene Epoch timestamp inserted between *nothing*, HE mark *removed*, and webpage timestamps *replaced* by the HE timestamp.



### HET Options

![Options](https://raw.githubusercontent.com/ly3xqhl8g9/holocene-timestamp/master/about/images/options.gif)
#### Options Menu

![Popup](https://raw.githubusercontent.com/ly3xqhl8g9/holocene-timestamp/master/about/images/popup.png)
#### Pop-up Menu



### What is the Holocene Epoch?
###### [Holocene Epoch Wiki](https://en.wikipedia.org/wiki/Holocene)
###### [Holocene Calendar Wiki](https://en.wikipedia.org/wiki/Holocene_calendar)
###### [Emiliani’s Proposal](packages/extension-chrome-legacy/src/emiliani/emilianisproposal.pdf)
###### [Kurzgesagt’s Summary](https://www.youtube.com/watch?v=czgOWmtGVGs)
