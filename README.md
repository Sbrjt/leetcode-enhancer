## LeetCode Enhancer

> A browser extension to improve the LeetCode experience.

<!-- <div align="center">
    <a href="https://chromewebstore.google.com/detail/tablissng/dlaogejjiafeobgofajdlkkhjlignalk">
        <img src="https://img.shields.io/chrome-web-store/users/dlaogejjiafeobgofajdlkkhjlignalk?logo=googlechrome&logoColor=ffffff&color=0779ba"></a>
    <a href="https://addons.mozilla.org/en-US/firefox/addon/tablissng/">
        <img src="https://img.shields.io/amo/users/tablissng?logo=firefoxbrowser&logoColor=ffffff"></a>
    <a href="https://github.com/BookCatKid/TablissNG/stargazers">
        <img src="https://img.shields.io/github/stars/BookCatKid/TablissNG?style=flat"></a>
    <a href="https://github.com/BookCatKid/TablissNG/commits/main/">
        <img src="https://img.shields.io/github/last-commit/BookCatKid/TablissNG?color=0779ba"></a>
    <a href="https://github.com/BookCatKid/TablissNG/releases/latest">
        <img src="https://img.shields.io/github/v/release/BookCatKid/TablissNG.svg?logo=github"></a>
</div> -->

### ✨ Features

- Problem difficulty rating
- Format on run
- Enable autocomplete (partial)
- Copy code button
- Links to similar problems on other platforms for premium problems
- Screenshots of premium editorials

### ⏳ Todos

- Contest notification
- Code snippets

### 📥 Download

<a href="https://chromewebstore.google.com/detail/leetcode-enhancer/cpoclfijojgjiafnlgnhjalkaiabcjch"><img src="https://developer.chrome.com/static/docs/webstore/branding/image/HRs9MPufa1J1h5glNhut.png" alt="Get the Extension on Chrome" height="70" style="border: 1px solid transparent; border-radius:6px;"></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/leetcodeenhancer/"><img src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg" height="70"></a>

You can also:

- Download it manually from the latest release
- Try the latest GitHub Actions artifact build
- Build it yourself from source

<details>
  <summary>Build Instructions</summary>
  <br>

Requirements:

- OS: any
- Node.js >= 18

Install:

```bash
npm i
```

Development:

```bash
npm run dev
npm run dev:firefox
```

Build:

```bash
npm run build
npm run build:firefox
```

Find all scripts in `package.json`.

To Load:

- Chrome: go to `chrome://extensions`, turn on devoloper mode and click on "Load unpacked".

- Firefox: go to `about:debugging#/runtime/this-firefox` and click on "Load Temporary Add-on".

- Find outputs in `.output/` folder.

Note: If you need extra help, just create an issue and I will help.

</details>

### 🤗 Credits

- [leetcode_problem_rating](https://github.com/zerotrac/leetcode_problem_rating)
- [leetcode-screenshotter](https://github.com/akhilkammila/leetcode-screenshotter)
- [wxt](https://github.com/wxt-dev/wxt)
