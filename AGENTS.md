## General

- This project uses WXT.
  https://wxt.dev/guide

- WXT uses `unimport`, so many react hooks browser-extension APIs, and WXT framework utilities are auto-imported. (Eg: `useState`, `defineBackground`, `browser`)

- NEVER modify files inside `node_modules`.

- To run: `npm run dev`

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

// To mimic user:
// await page.keyboard.press('KeyA')

console.log('Attached:', page.url())
await sleep(15000)
```

Modify this script as needed to take autonomous control of the browser.
