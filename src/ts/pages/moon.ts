type MoonOutputs = SharedGlobalOutputs & {
	galleryCode: HTMLElement;
	moonGalleryCode: HTMLElement;
	planetGalleryCode: HTMLElement;
	locationGalleryCode: HTMLElement;
};

const moonOutputs = globalElements.output as MoonOutputs;

const moonGalleryExplanationExternal = () => {
	return `There is a preferred order of pictures:
	<div class='dialog-center'>
		<ol class='dialog-list'>
			<li>Space View</li>
			<li>Night View</li>
			<li>Cave System</li>
			<li>Coast Area</li>
			<li>Underwater</li>
			<li>Analysis Visor</li>
			<li>Moon Exploration Guide</li>
			<li>Moon Page</li>
			<li>Planet</li>
			<li>Planet Page</li>
			<li>System Page</li>
			<li>Galaxy Map</li>
		</ol>
	</div>`;
};
(window as typeof window & { galleryExplanationExternal?: () => string }).galleryExplanationExternal = moonGalleryExplanationExternal;

function renderMoonGallerySections() {
	const galleryItems = Array.from(moonOutputs.galleryCode.children);
	const moonEntries: string[] = [];
	const planetEntries: string[] = [];
	const locationEntries: string[] = [];

	for (const item of galleryItems) {
		const fileName = item.querySelector('span')?.innerText ?? '';
		const caption = item.querySelector('output')?.innerText ?? '';
		const entry = `${fileName}${caption}`;
		const normalizedCaption = caption.toLowerCase();

		if (!entry.trim()) continue;

		if (normalizedCaption.includes('system page') || normalizedCaption.includes('galaxy map')) {
			locationEntries.push(entry);
		} else if (normalizedCaption === '|planet' || normalizedCaption.includes('planet page')) {
			planetEntries.push(entry);
		} else {
			moonEntries.push(entry);
		}
	}

	moonOutputs.moonGalleryCode.innerText = moonEntries.join('\n');
	moonOutputs.planetGalleryCode.innerText = planetEntries.join('\n');
	moonOutputs.locationGalleryCode.innerText = locationEntries.join('\n');
}

const moonGalleryObserver = new MutationObserver(() => {
	renderMoonGallerySections();
});

moonGalleryObserver.observe(moonOutputs.galleryCode, {
	childList: true,
	subtree: true,
	characterData: true,
});

renderMoonGallerySections();
