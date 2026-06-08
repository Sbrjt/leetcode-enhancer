## General

- This project uses WXT.
  - Entrypoints: https://wxt.dev/guide/essentials/entrypoints.html
  - project structure: https://wxt.dev/guide/essentials/project-structure.html

- WXT uses `unimport`, so many React hooks, browser extension APIs, and WXT utilities are auto-imported.
  - Examples: `useState`, `defineBackground`, `browser` are auto-imported.
  - Avoid adding unnecessary imports for these APIs.

- Use WXT's browser polyfill (`browser`) for extension APIs.
  - Do not use `chrome.*` APIs directly.

- Content scripts use `elementReady` (a wrapper around `MutationObserver`).

- Always clean up side effects created in pages.
  - Remove event listeners.
  - Disconnect mutation observers.
  - Remove injected DOM elements.
  - Ensure cleanup runs on component unmount/re-render to prevent leaks across navigations.

- Use hash-based routing with React Router.
  - Browser extensions do not support normal history routing because Chrome handles `/` routes.

- Notion integration uses access tokens.
  - As Notion does not support PKCE.
  - But PATs get full access to user workspace which is not ideal.

* NEVER modify files inside `node_modules`.

## Debugging

To debug issues, follow these steps:

Enable remote debugging in `wxt.config`:

```
    webExt: {
        chromiumArgs: ['--remote-debugging-port=9222'],
    }
```

Use a Puppeteer script like the following to inspect logs:

```js
// npm i puppeteer-core -g

import puppeteer from 'puppeteer-core'
import { setTimeout as sleep } from 'timers/promises'

const browser = await puppeteer.connect({
	browserURL: 'http://localhost:9222',
	defaultViewport: null,
})

const url = `https://leetcode.com/problems/two-sum/`
const page = await browser.newPage()
await page.goto(url)

// or use:
// const pages = await browser.pages();
// const page = pages.find(...);

page.on('console', (msg) => {
	console.log(msg.type(), msg.text())
})

page.on('pageerror', (err) => {
	console.error(err.message)
})

// Other page.on listeners: requestfailed, request, frameattached

// To mimic user typing:
// await page.keyboard.press('KeyA')

console.log('Attached:', page.url())
await sleep(15000)
```

Modify this script as needed to take autonomous control of the browser.
