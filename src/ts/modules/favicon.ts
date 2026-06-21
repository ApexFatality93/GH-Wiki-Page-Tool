(() => {
	const routePages = new Set([
		'about',
		'base',
		'business',
		'fauna',
		'flora',
		'mineral',
		'moon',
		'multitool',
		'planet',
		'sandworm',
		'starship',
		'system',
	]);
	const path = window.location.pathname.replace(/\/index\.html$/, '/');
	const currentSegment = path.split('/').filter(Boolean).at(-1) ?? '';
	const prefix = routePages.has(currentSegment) ? '../' : './';
	const faviconBase = `${prefix}assets/favicon`;

	const faviconLinks: Array<Record<string, string>> = [
		{ rel: 'apple-touch-icon', sizes: '180x180', href: `${faviconBase}/apple-touch-icon.png` },
		{ rel: 'icon', type: 'image/png', sizes: '32x32', href: `${faviconBase}/favicon-32x32.png` },
		{ rel: 'icon', type: 'image/png', sizes: '16x16', href: `${faviconBase}/favicon-16x16.png` },
		{ rel: 'shortcut icon', href: `${faviconBase}/favicon.ico` },
		{ rel: 'manifest', href: `${faviconBase}/site.webmanifest` },
	];

	for (const linkData of faviconLinks) {
		const link = document.createElement('link');
		for (const [key, value] of Object.entries(linkData)) {
			link.setAttribute(key, value);
		}
		document.head.appendChild(link);
	}
})();
