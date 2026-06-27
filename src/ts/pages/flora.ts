type FloraPageData = SharedPageData & {
	element_primary: string;
	element_secondary: string;
	moon: string | boolean;
	galleryArray: string[];
};

type FloraOutputs = SharedGlobalOutputs & {
	usage: HTMLElement;
};

type FloraWindow = typeof window & {
	startupFunctions?: () => void;
	generateGalleryArray?: () => void;
	galleryExplanationExternal?: () => string;
};

const floraPageData = pageData as FloraPageData;
const floraOutputs = globalElements.output as FloraOutputs;
const floraWindow = window as FloraWindow;

const floraResourceHarvest = () => {
	const primaryElement = floraPageData.element_primary;
	const secondaryElement = floraPageData.element_secondary;
	const output = secondaryElement
		? `This flora provides the resources of [[${primaryElement}]] and [[${secondaryElement}]] when harvested.`
		: `This flora provides the resource [[${primaryElement}]] when harvested.`;

	floraOutputs.usage.innerText = output;
};
(window as typeof window & { resourceHarvest?: () => void }).resourceHarvest = floraResourceHarvest;

const floraStartupFunctions = () => {
	floraResourceHarvest();
	hideOrgName();
	planetMoonSentence();
};
floraWindow.startupFunctions = floraStartupFunctions;

const floraElementFunctions = {
	planetInput: ['planetMoonSentence(); generateGalleryArray()'],
	moonInput: ['planetMoonSentence(); generateGalleryArray()'],
	element_primary_input: ['resourceHarvest()'],
	element_secondary_input: ['resourceHarvest()'],
};

assignElementFunctions(floraElementFunctions);

const floraGenerateGalleryArray = () => {
	const array = [
		'',
		'Other image',
		'Scanner view',
		'Discovery Menu',
		'Moon Page',
		'Planet Page',
		'System Page',
		'Galaxy Map',
	];

	if (!floraPageData.moon) {
		const index = array.findIndex(item => item.toLowerCase().includes('moon'));
		array.splice(index, 1);
	}

	floraPageData.galleryArray = array;
};
floraWindow.generateGalleryArray = floraGenerateGalleryArray;

const floraGalleryExplanationExternal = () => {
	return `The preferred order of pictures is as follows:
		<div class='dialog-center'>
			<ol class='dialog-list'>
				<li>Other image</li>
				<li>Scanner view</li>
				<li>Discovery Menu</li>
				<li>Moon Page</li>
				<li>Planet Page</li>
				<li>System Page</li>
				<li>Galaxy Map</li>
			</ol>
		</div>`;
};
floraWindow.galleryExplanationExternal = floraGalleryExplanationExternal;
