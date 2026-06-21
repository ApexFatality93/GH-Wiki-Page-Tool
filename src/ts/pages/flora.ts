type FloraPageData = SharedPageData & {
	element_primary: string;
	element_secondary: string;
};

type FloraOutputs = SharedGlobalOutputs & {
	usage: HTMLElement;
};

const floraPageData = pageData as FloraPageData;
const floraOutputs = globalElements.output as FloraOutputs;

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
	pageName();
	bundlePropFunctions();
	planetMoonSentence();
	noLineBreak();
};
(window as typeof window & { startupFunctions?: () => void }).startupFunctions = floraStartupFunctions;

const floraElementFunctions = {
	planetInput: ['planetMoonSentence()'],
	moonInput: ['planetMoonSentence()'],
	element_primary_input: ['resourceHarvest()'],
	element_secondary_input: ['resourceHarvest()'],
};

assignElementFunctions(floraElementFunctions);
