## LeetCode Enhancer

> A browser extension to improve the LeetCode experience.

<!-- <div align="center">
    <a href="https://chromewebstore.google.com/detail/leetcode-enhancer/cpoclfijojgjiafnlgnhjalkaiabcjch">
        <img src="https://img.shields.io/chrome-web-store/users/dlaogejjiafeobgofajdlkkhjlignalk?logo=googlechrome&logoColor=ffffff&color=0779ba"></a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/leetcodeenhancer/">
        <img src="https://img.shields.io/amo/users/tablissng?logo=firefoxbrowser&logoColor=ffffff"></a>
    <a href="https://www.star-history.com/?repos=Sbrjt%2Fleetcode-enhancer">
        <img src="https://img.shields.io/github/stars/Sbrjt/leetcode-enhancer?style=flat"></a>
    <a href="https://github.com/Sbrjt/leetcode-enhancer/commits/main/">
        <img src="https://img.shields.io/github/last-commit/Sbrjt/leetcode-enhancer?color=0779ba"></a>
    <a href="https://github.com/Sbrjt/leetcode-enhancer/releases/latest">
        <img src="https://img.shields.io/github/v/release/Sbrjt/leetcode-enhancer.svg?logo=github"></a>
</div> -->

### ✨ Features

- Problem difficulty rating
- Format on run
- Enable autocomplete (partial)
- Copy code button
- Return dislike button
- Alternate links to premium problems
- Screenshots of premium editorials
- Company tags
- Company-wise questions

### ⏳ Todos

- Contest notification
- Code snippets
- Hide/show certain stuffs

### 📥 Download

<a href="https://chromewebstore.google.com/detail/leetcode-enhancer/cpoclfijojgjiafnlgnhjalkaiabcjch"><img src="https://developer.chrome.com/static/docs/webstore/branding/image/HRs9MPufa1J1h5glNhut.png" alt="Get the Extension on Chrome" height="70" style="border: 1px solid transparent; border-radius:6px;"></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/leetcodeenhancer/"><img src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg" height="70"></a>

You can also:

- Download it from the [latest release](https://github.com/Sbrjt/leetcode-enhancer/releases/latest)
- Try the latest GitHub Actions [artifact build](https://github.com/Sbrjt/leetcode-enhancer/actions/workflows/ci.yml)
- Build it yourself from source (see below)

<details>
<summary><strong>Running locally</strong></summary>
<br>

This extension uses the wxt framework. See [docs](https://wxt.dev/guide/essentials/entrypoints.html).

### Requirements

- OS: any
- Node.js >= 18

Clone the repo and install dependencies:

```bash
git clone https://github.com/Sbrjt/leetcode-enhancer
cd leetcode-enhancer
cp .env.example .env

npm i
```

### Dev server

```bash
npm run dev
npm run dev:firefox
```

This launches a new Chrome profile with the extension installed. Hot reload is enabled.

### Building

```bash
npm run build
npm run build:firefox
```

Find the compiled files inside `.output/`.

How to load:

- Chrome: go to `chrome://extensions`, turn on devoloper mode and click on "Load unpacked". [Video](https://youtu.be/Ta-YTDhiBIQ?t=82).

- Firefox: go to `about:debugging#/runtime/this-firefox` and click on "Load Temporary Add-on". [Doc](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox).

- Select suitable build in `.output/` folder.

### Project Structure

```bash
📂 /
    📁 .output/                 # find build outputs here
    📁 public/                  # static assets
    📂 src/
        📁 entrypoints/
            📄 background.ts    # background service worker
            📂 content/         # content scripts
            📂 popup/
            📂 options/
        📁 components/
        📁 hooks/
        📁 utils/
    📄 wxt.config.ts            # manifest, vite, configs etc.
    📄 package.json
```

Note: If you need extra help, just create an issue and I will help.

</details>

### 🤗 Credits

- [leetcode_problem_rating](https://github.com/zerotrac/leetcode_problem_rating)
- [leetcode-screenshotter](https://github.com/akhilkammila/leetcode-screenshotter)
- [leetcode-companywise-interview-questions](https://github.com/snehasishroy/leetcode-companywise-interview-questions)
- [wxt](https://github.com/wxt-dev/wxt)

> [!CAUTION]
> If LeetCode updates its UI, this extension may break.

<!-- If you like my project, please gimme a star! ⭐💫

<picture><img src="https://img.shields.io/badge/PRs-welcome-green.svg"></picture> -->

© Shubhrajit Sadhukhan :octocat:
