## LeetCode Enhancer

A browser extension to improve the LeetCode experience.

### ✨ Features

- Shows problem difficulty rating
- Links to similar problems on other platforms for premium problems

### ⏳Todos

- Contest notification
- Code formatter
- Autocomplete
- Code snippets
- Screenshots of premium editorials

### 🤗 Credits

- [leetcode_problem_rating](https://github.com/zerotrac/leetcode_problem_rating)
- [leetcode-screenshotter](https://github.com/akhilkammila/leetcode-screenshotter)
- [wxt](https://github.com/wxt-dev/wxt)

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

</details>
