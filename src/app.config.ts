import { links } from '@/../package.json'
import { moderok } from '@wxt-dev/analytics/providers/moderok'

export default defineAppConfig({
	analytics: {
		debug: false,
		enabled: {
			getValue: () => true, // auto enable Analytics
		},
		providers: [
			moderok({
				appKey: import.meta.env.WXT_MODEROK_APP_KEY,
				trackUninstalls: true,
				uninstallUrl: links.uninstall,
			}),
		],
	},
})

// user consent
// import { analytics } from "#analytics"
// analytics.setEnabled(true)

// todo: add options
