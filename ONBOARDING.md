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

Note: If you need extra help, just create an issue and I will help.

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

This extension uses the WXT framework. Get started with the docs on [project structure](https://wxt.dev/guide/essentials/project-structure.html) and [entrypoints](https://wxt.dev/guide/essentials/entrypoints.html). If you're new to browser extensions, check out this [playlist](https://www.youtube.com/playlist?list=PL73_IyyS-6PWIlsGL9c_dX7lTtBElzBPd).

<details>
<summary>Using element-ready</summary>

Let's say you're on [leetcode.com](https://leetcode.com/problems/two-sum/) and want to select the main logo.

Right-click on the logo in the top-left, and select Inspect to open DevTools. You'll find something like:

```html
<img
    class="h-full"
    alt="LeetCode Logo"
    src="/_next/static/images/logo-dark.png"
/>
```

To select this element, you can use:

```js
document.querySelector(`img[alt="LeetCode Logo"]`)
```

(Try pasting this into the browser console—you'll get the `<img>` element.)

Now let's try to modify it:

```js
const img = document.querySelector(`img[alt="LeetCode Logo"]`)
img.src = 'https://c.tenor.com/x8v1oNUOmg4AAAAd/'
```

:)

Most UI customizations in this extension work exactly like this.

If you navigate to another page, the change will be gone. So we need to run this on every page.

The Problem: SPAs

LeetCode is an SPA, so navigating between pages changes the URL without reloading the page. This means we need to listen for route changes instead of page loads.

Even after the URL changes, the element we're looking for might not exist yet because the page is still rendering. So we wait. We could do this with polling (`setInterval`) or `MutationObserver`.

This project uses `element-ready`, which is a convenient wrapper around `MutationObserver`.

```js
const img = await elementReady('img[alt="LeetCode Logo"]')
// the promise resolves when the element appears in the DOM
```

Using It Inside a Hook:

```js
useEffect(() => {
	const controller = new AbortController()
	const { signal } = controller

	;(async () => {
		const target = await elementReady('img[alt="LeetCode Logo"]', { signal })

		if (!target || signal.aborted) return

		target.src = 'https://c.tenor.com/x8v1oNUOmg4AAAAd/'
	})()

	return () => controller.abort()
}, [])
```

At first glance this looks a little scary, but most of it is just cleanup logic.

Why Do We Need Cleanup?

Imagine this: User opens Page 1. `elementReady()` starts waiting for some target. The element never appears. User navigates to Page 2. A new hook runs and creates another observer. Now you have two active observers and you may end up with duplicate UI injections! So it's important to kill the observer when the hook unmounts.

Also, if you inject buttons, badges, etc, those changes should be removed when leaving the page. Otherwise you may end up with duplicate UI or unexpected behavior because remnants of the previous injection are still there.

You'll find all the hooks here: [`src/entrypoints/content/hooks`](./src/entrypoints/content/hooks)

</details>

### 🤗 Credits

- [leetcode_problem_rating](https://github.com/zerotrac/leetcode_problem_rating)
- [leetcode-screenshotter](https://github.com/akhilkammila/leetcode-screenshotter)
- [leetcode-companywise-interview-questions](https://github.com/snehasishroy/leetcode-companywise-interview-questions)
- [neetcode](https://github.com/neetcode-gh/leetcode)
- [hitarth-gg/CP](https://github.com/hitarth-gg/CP)
- [element-ready](https://github.com/sindresorhus/element-ready)
- [wxt](https://github.com/wxt-dev/wxt)
