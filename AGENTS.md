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

const REMOTE_DEBUGGING_URL = 'http://localhost:9222'
const SETTLE_MS = 15000

const browser = await puppeteer.connect({
	browserURL: REMOTE_DEBUGGING_URL,
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

console.log('Attached:', page.url())
await sleep(SETTLE_MS)
```

Modify this script as needed to take autonomous control of the browser.

NEVER modify files inside `node_modules`.
