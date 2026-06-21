"use strict";
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
    const currentFooterLinkId = (() => {
        if (currentSegment === '')
            return 'footer-home';
        if (currentSegment === 'about')
            return 'footer-about';
        return null;
    })();
    const content = `<div class="site-footer-shell">
		<div class="site-footer-copy">
			<p class="site-footer-eyebrow">Galactic Hub Wiki Page Creator</p>
			<p class="site-footer-text">A tool to help create pages for the Galactic Hub Wiki</p>
		</div>
		<nav class="site-footer-nav" aria-label="Footer">
			<a href="${prefix}" id="footer-home">Home</a>
			<a href="${prefix}about/" id="footer-about">About</a>
			<a href="https://nmsgalactichub.miraheze.org/wiki/Main_Page" rel="noreferrer noopener" target="_blank">Wiki</a>
			<a href="https://forms.gle/uDABQyPh1AvPAczs9" rel="noreferrer noopener" target="_blank">Feedback</a>
		</nav>
	</div>`;
    const footerElement = document.getElementById('footer');
    if (!footerElement)
        return;
    if (typeof globalElements == 'undefined') {
        footerElement.innerHTML = content;
    }
    else {
        const footerOutputs = globalElements.output;
        footerOutputs.footer.innerHTML = content;
    }
    const currentPageLink = currentFooterLinkId
        ? document.getElementById(currentFooterLinkId)
        : null;
    if (currentPageLink) {
        currentPageLink.setAttribute('aria-current', 'page');
    }
})();
