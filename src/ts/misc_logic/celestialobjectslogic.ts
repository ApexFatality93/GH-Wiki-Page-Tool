type CelestialPageData = SharedPageData & {
	discovered: string;
	discoveredlink: string;
	documented: string;
	documentedlink: string;
	docby: string;
	platform: string;
	discDate: string;
	docDate: string;
	pageType: string;
};

type CelestialInputs = SharedGlobalInputs & {
	descriptionInput: HTMLInputElement;
};

type CelestialOutputs = SharedGlobalOutputs & {
	docby: HTMLElement;
};

const celestialPageData = pageData as CelestialPageData;
const celestialInputs = globalElements.input as CelestialInputs;
const celestialOutputs = globalElements.output as CelestialOutputs;

function celestialStartupFunctions() {
	hideOrgName();
	locationSentence();
}

const celestialObjectElementFunctions = {
	docDateInput: ['docByExternal()'],
	discDateInput: ['docByExternal()'],
	platformInput: ['docByExternal()'],
	documentedInput: ['hideDiscoverer("documentedInput", "documentedlinkInput"); docByExternal()'],
	documentedlinkInput: ['hideDiscoverer("documentedlinkInput", "documentedInput"); docByExternal()'],
	oldNameInput: ['hideOrgName()'],
	civ: ['locationSentence()', null, true],
	portalglyphsInput: ['locationSentence()', null, true],
};
assignElementFunctions(celestialObjectElementFunctions);

function docByExternal() {
	const discovered = celestialPageData.discovered;
	const discoveredlink = celestialPageData.discoveredlink;
	const documented = celestialPageData.documented;
	const documentedlink = celestialPageData.documentedlink;
	const documenter = documentedlink || documented || celestialPageData.docby;
	const platform = celestialPageData.platform === 'NS' ? 'Switch' : celestialPageData.platform;

	function formatDate(date: string) {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		const simpleDate = date.replaceAll('-', '/');
		const dateObj = new Date(simpleDate);
		return dateObj.toLocaleString('en-UK', options);
	}

	const discDate = formatDate(celestialPageData.discDate);
	const docDate = formatDate(celestialPageData.docDate);
	const research = `${platform} explorer`;
	const discoverer = !discoveredlink ? formatName(discovered) : `{{profile|${discoveredlink}}}`;
	const documenterName = documentedlink ? `{{profile|${documentedlink}}}` : formatName(documenter);
	const sameDocumenter = Boolean(documenter) && (
		documenter === discovered ||
		documenter === discoveredlink ||
		documentedlink === discoveredlink ||
		documentedlink === discovered
	);

	const explorer = (!documenter || sameDocumenter)
		? `Discovered and uploaded by ${research} ${discoverer} on ${discDate}`
		: `* Discovered and uploaded by ${platform} explorer ${discoverer} on ${discDate}
			* Explored and documented by ${research} ${documenterName} on ${docDate}`;

	celestialOutputs.docby.innerText = explorer;
}

function wikiCodePercentage(element: HTMLInputElement | null = null) {
	if (!element) {
		const inputs = document.querySelectorAll<HTMLInputElement>('[oninput*="wikiCodePercentage"]');
		for (const input of inputs) {
			wikiCodePercentage(input);
		}
		return;
	}
	const dest = element.dataset.destNoauto;
	if (!dest) return;
	const propertyValue = pageData[dest] as string;
	const propertyData = numberError(element, propertyValue);
	wikiCode(propertyData ? `${propertyData}%` : '', dest);
}

function autoInfested(element = celestialInputs.descriptionInput) {
	const descriptorData = getDescriptorData().Infested;
	const infestedDescriptors: string[] = [];
	for (const list in descriptorData) {
		infestedDescriptors.push(...descriptorData[list]);
	}

	const isInfested = infestedDescriptors.includes(element.value);
	if (celestialPageData.pageType === 'System') return isInfested;

	const infestedElement = document.getElementById('infested');
	if (infestedElement) {
		infestedElement.innerText = isInfested ? '([[Biome Subtype - Infested|Infested]]) ' : '';
	}
}

function buildDescriptor(descriptor: string, planetClass: string, filler: string) {
	const data = getDescriptorData();
	const section = (() => {
		for (const biome in data) {
			for (const list in data[biome]) {
				if (data[biome][list]?.includes?.(descriptor.trim())) return list;
			}
		}
	})();

	switch (section) {
		case 'prefix':
			return planetClass + filler + descriptor.trim();
		case 'suffix':
			return descriptor.trim() + filler + planetClass;
		default:
			return descriptor.trim();
	}
}
