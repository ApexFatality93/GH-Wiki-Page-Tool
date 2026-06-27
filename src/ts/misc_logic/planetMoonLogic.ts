type PlanetMoonWindow = typeof window & {
	startupFunctions?: () => void;
	locationSentence?: () => void;
	addResource?: (element?: HTMLButtonElement | HTMLInputElement | null) => void;
	genusDropdown?: (element: HTMLSelectElement) => void;
	resetExternal?: () => void;
};

type PlanetMoonPageData = SharedPageData & {
	pageType: string;
	system: string;
	region: string;
	civShort: string;
	sentinel: string;
};

type PlanetMoonInputs = SharedGlobalInputs & {
	resourceInputs: HTMLElement;
};

type PlanetMoonOutputs = SharedGlobalOutputs & {
	location: HTMLElement;
	resourceList: HTMLElement;
	resourceBullets: HTMLElement;
	sentinelSentence: HTMLElement;
};

const planetMoonWindow = window as PlanetMoonWindow;
const planetMoonPageData = pageData as PlanetMoonPageData;
const planetMoonInputs = globalElements.input as PlanetMoonInputs;
const planetMoonOutputs = globalElements.output as PlanetMoonOutputs;

const planetMoonLogicStartupFunctions = () => {
	celestialStartupFunctions();
	autoInfested();
	if (typeof planetStartupFunctions === 'function') planetStartupFunctions();
};
planetMoonWindow.startupFunctions = planetMoonLogicStartupFunctions;

const planetMoonElements = {
	input: {
		resourceInputs: 'resourceInputs',
	},
	output: {
		resourceBullets: 'resourceBullets',
		creatures: 'creatures',
		plants: 'plants',
		minerals: 'minerals',
	},
};
updateGlobalElements(planetMoonElements);

const planetMoonElementFunctions = {
	systemInput: ['locationSentence()'],
	faunaNumberInput: ['numberStats(this); plural(pageData[this.dataset.destNoauto], "faunaSentencePlural")'],
	sentinelInput: ['sentinelSentence()'],
	descriptionInput: ['autoInfested(this); planetDescriptor(this)'],
};
assignElementFunctions(planetMoonElementFunctions);

function plural(number: number, dest: string | null = null) {
	const word = number === 1 ? 'is' : 'are';
	if (!dest) return word;
	wikiCode(word, dest);
}

function planetDescriptor(element: HTMLInputElement) {
	const dest = element.dataset.destNoauto as string;
	const output = buildDescriptor(element.value, planetMoonPageData.pageType, ' ');
	const outputElement = globalElements.output[dest];
	if (outputElement) outputElement.innerText = output;
}

const planetMoonLocationSentence = () => {
	const systemName = planetMoonPageData.system;
	const regionName = planetMoonPageData.region;
	const civ = planetMoonPageData.civShort;
	const output = `It can be found in the [[${systemName}]] [[star system]] in the [[${regionName}]] [[region]] (HUB${getHubNumber(regionName)}) of the ${HubGal(civ)}.`;
	planetMoonOutputs.location.innerText = output;
};
planetMoonWindow.locationSentence = planetMoonLocationSentence;

const planetMoonAddResource = (element: HTMLButtonElement | HTMLInputElement | null = planetMoonInputs.resourceInputs.querySelector('button') as HTMLButtonElement | null) => {
	if (!(element instanceof HTMLButtonElement)) return;
	const inputSection = element.parentElement;
	if (!inputSection) return;
	const elementList = document.querySelectorAll('[data-resource]');
	const childIndex = getChildIndex(elementList, 'dataset.resource');
	const resource_input = 'resource_input' + childIndex;

	const inputHTML = `<div class="tableCell text removable" data-resource="section${childIndex}">
		<button class="button is-outlined is-danger icon is-small" title="Remove resource" type="button" disabled onclick="removeSpecificSection('section${childIndex}', 'resource'); enableResourceAdd()">&#10006</button>
		<label for="${resource_input}">Resource name:</label>
	</div>
	<div class="tableCell data" data-resource="section${childIndex}">
		<input type="text" list="resources" id="${resource_input}" oninput="resourceList()" onchange="forceDatalist(this)">
	</div>`;

	inputSection.insertAdjacentHTML('beforebegin', inputHTML);

	const resourceRemoveButtons = document.querySelectorAll<HTMLButtonElement>('[data-resource] button');
	const resourceInputSectionCount = resourceRemoveButtons.length;

	while (document.querySelectorAll('[data-resource] button').length < 3) {
		planetMoonAddResource(element);
	}

	if (resourceInputSectionCount + 1 > 6) {
		element.disabled = true;
	}

	if (resourceInputSectionCount > 3) {
		for (const button of resourceRemoveButtons) {
			button.disabled = false;
		}
	}
};
planetMoonWindow.addResource = planetMoonAddResource as (element?: HTMLInputElement | HTMLButtonElement | null) => void;

function enableResourceAdd() {
	const addButton = planetMoonInputs.resourceInputs.querySelector('button') as HTMLButtonElement | null;
	if (addButton) addButton.disabled = false;

	const resourceRemoveButtons = document.querySelectorAll<HTMLButtonElement>('[data-resource] button');
	const resourceInputSectionCount = resourceRemoveButtons.length;

	if (resourceInputSectionCount < 4) {
		for (const button of resourceRemoveButtons) {
			button.disabled = true;
		}
	}
	resourceList();
}

function resourceList() {
	const resourceShorts = getResourceData();
	const resourceInputs = document.querySelectorAll<HTMLInputElement>('[data-resource] input');
	const resources = new Set<string>();
	for (const input of resourceInputs) {
		if (input.value) resources.add(input.value);
	}
	const resourceData: Record<string, string> = {};
	for (const resource of Array.from(resources)) {
		resourceData[resource] = resourceShorts[resource];
	}

	const usedResources = Object.keys(resourceData);
	const usedResourceShorts = Object.values(resourceData);

	for (let i = 0; i < usedResources.length; i++) {
		const resource = usedResources[i];
		usedResources[i] = `* {{ilink|${resource}}}`;

		const resourceShort = usedResourceShorts[i];
		usedResourceShorts[i] = `[[${resourceShort}]]`;
	}
	planetMoonOutputs.resourceList.innerText = usedResourceShorts.join(', ');
	planetMoonOutputs.resourceBullets.innerText = usedResources.join('\n');
}

function sentinelSentence() {
	const sentDescriptor = planetMoonPageData.sentinel;
	const sentinels = getSentinelData();
	const sentLevel = (() => {
		for (const level in sentinels) {
			if (sentinels[level].includes(sentDescriptor)) return level;
		}
		return '';
	})();

	const output = `[[Sentinel]] activity on this ${planetMoonPageData.pageType.toLowerCase()} is classified as: ''${sentDescriptor}''. The sentinels ${(sentLevel === 'aggressive') ? 'do' : "don't"} present an immediate threat.`;
	planetMoonOutputs.sentinelSentence.innerText = output;
}

function addFauna(element: HTMLButtonElement) {
	const inputSection = element.parentElement;
	if (!inputSection) return;
	const outputSection = globalElements.output[(element.dataset.destNoauto as string)] as HTMLElement;
	const sectionType = 'fauna';
	const elementList = document.querySelectorAll(`[data-${sectionType}]`);
	const i = getChildIndex(elementList, `dataset.${sectionType}`);

	const inputHTML = `<div class="tableHeader text sectionToggle" data-fauna="section${i}" data-section="fauna">
		<p style="margin-right:auto">Creature: <output class="has-text-weight-bold" name="faunaName${i}"></output></p>
		<button class="button is-danger is-outlined" type="button" onclick="removeSpecificSection('section${i}', 'fauna'); changeTableEntry(this)">Remove</button>
		<button class="button" onclick="toggleSection('fauna${i}', this)">Hide</button>
	</div>
	<div class="tableCell text" data-fauna="section${i}" data-section="fauna fauna${i}">
		<label for="faunaNameInput${i}">Creature name:</label>
		<span class="tooltip">
			<data>Enter exactly as seen in game. Watch out for 0 (zero) and O (o).</data>
			<data>Creature Name</data>
			<data>Enter exactly as seen in game. Watch out for 0 (zero) and O (o).</data>
			<data>../assets/bitmap/creature/creatureName.jpg</data>
	</div>
	<div class="tableCell data" data-fauna="section${i}" data-section="fauna fauna${i}">
		<input type="text" data-dest="faunaName${i}" id="faunaNameInput${i}">
	</div>
	<div class="tableCell text" data-fauna="section${i}" data-section="fauna fauna${i}">
		<label for="faunaFile_input${i}">Creature file name:</label>
	</div>
	<div class="tableCell data" data-fauna="section${i}" data-section="fauna fauna${i}">
		<input type="text" id="faunaFile_input${i}" data-dest="faunaFile${i}" data-default="NmsMisc_NotAvailable.png">
		<input type="file" id="faunaFileUpl${i}" accept="image/*" oninput="image(this)">
	</div>
	<div class="tableCell text" data-fauna="section${i}" data-section="fauna fauna${i}">
		<label for="faunaDiscovererInput${i}">Discoverer:</label>
	</div>
	<div class="tableCell data" data-fauna="section${i}" data-section="fauna fauna${i}">
		<input data-dest="faunaDiscoverer${i}" type="text" id="faunaDiscovererInput${i}">
	</div>`;

	const outputHTML = `<div data-fauna="section${i}">{{FaunaCard</div>
	<div data-fauna="section${i}">|image = <output id="faunaFile${i}"></output></div>
	<div data-fauna="section${i}">|name = <output id="faunaName${i}" name="faunaName${i}"></output></div>
	<div data-fauna="section${i}">|discovered = <output id="faunaDiscoverer${i}"></output></div>
	<div data-fauna="section${i}">}}</div>`;

	inputSection.insertAdjacentHTML('beforebegin', inputHTML);
	outputSection.insertAdjacentHTML('beforeend', outputHTML);
	postProcessSection(element, sectionType, i);
}

function addFlora(element: HTMLButtonElement) {
	const inputSection = element.parentElement;
	if (!inputSection) return;
	const outputSection = globalElements.output[element.dataset.destNoauto as string] as HTMLElement;
	const sectionType = 'flora';
	const elementList = document.querySelectorAll(`[data-${sectionType}]`);
	const i = getChildIndex(elementList, `dataset.${sectionType}`);

	const inputHTML = `<div class="tableHeader text sectionToggle" data-flora="section${i}" data-section="flora">
		<p style="margin-right:auto">Plant: <output class="has-text-weight-bold" name="floraName${i}"></output></p>
		<button class="button is-danger is-outlined" type="button" onclick="removeSpecificSection('section${i}', 'flora'); changeTableEntry(this)">Remove</button>
		<button class="button" onclick="toggleSection('flora${i}', this)">Hide</button>
	</div>
	<div class="tableCell text" data-flora="section${i}" data-section="flora flora${i}">
		<label for="floraNameInput${i}">Plant name:</label>
		<span class="tooltip">
			<data>Found in the analysis visor.</data>
			<data>Flora Name</data>
			<data>Found in the analysis visor.</data>
			<data>../assets/bitmap/flora/floraName.jpg</data>
		</span>
	</div>
	<div class="tableCell data" data-flora="section${i}" data-section="flora flora${i}">
		<input type="text" data-dest="floraName${i}" id="floraNameInput${i}">
	</div>
	<div class="tableCell text" data-flora="section${i}" data-section="flora flora${i}">
		<label for="floraFile_input${i}">Plant file name:</label>
	</div>
	<div class="tableCell data" data-flora="section${i}" data-section="flora flora${i}">
		<input type="text" id="floraFile_input${i}" data-dest="floraFile${i}" data-default="NmsMisc_NotAvailable.png">
		<input type="file" id="floraFileUpl${i}" accept="image/*" oninput="image(this)">
	</div>
	<div class="tableCell text" data-flora="section${i}" data-section="flora flora${i}">
		<label for="floraDiscovererInput${i}">Discoverer:</label>
	</div>
	<div class="tableCell data" data-flora="section${i}" data-section="flora flora${i}">
		<input data-dest="floraDiscoverer${i}" type="text" id="floraDiscovererInput${i}">
	</div>`;

	const outputHTML = `<div data-flora="section${i}">{{FloraCard</div>
	<div data-flora="section${i}">|image = <output id="floraFile${i}"></output></div>
	<div data-flora="section${i}">|name = <output id="floraName${i}" name="floraName${i}"></output></div>
	<div data-flora="section${i}">|discovered = <output id="floraDiscoverer${i}"></output></div>
	<div data-flora="section${i}">}}</div>`;

	inputSection.insertAdjacentHTML('beforebegin', inputHTML);
	outputSection.insertAdjacentHTML('beforeend', outputHTML);

	postProcessSection(element, sectionType, i);
}

function addMineral(element: HTMLButtonElement) {
	const inputSection = element.parentElement;
	if (!inputSection) return;
	const outputSection = globalElements.output[element.dataset.destNoauto as string] as HTMLElement;
	const sectionType = 'mineral';
	const elementList = document.querySelectorAll(`[data-${sectionType}]`);
	const i = getChildIndex(elementList, `dataset.${sectionType}`);

	const inputHTML = `<div class="tableHeader text sectionToggle" data-mineral="section${i}" data-section="mineral">
		<p style="margin-right:auto">Mineral: <output class="has-text-weight-bold" name="mineralName${i}"></output></p>
		<button class="button is-danger is-outlined" type="button" onclick="removeSpecificSection('section${i}', 'mineral'); changeTableEntry(this)">Remove</button>
		<button class="button" onclick="toggleSection('mineral${i}', this)">Hide</button>
	</div>
	<div class="tableCell text" data-mineral="section${i}" data-section="mineral mineral${i}">
		<label for="mineralNameInput${i}">Mineral name:</label>
		<span class="tooltip">
			<data>Found in the analysis visor.</data>
			<data>Mineral Name</data>
			<data>Found in the analysis visor.</data>
			<data>../assets/bitmap/mineral/mineralName.jpg</data>
		</span>
	</div>
	<div class="tableCell data" data-mineral="section${i}" data-section="mineral mineral${i}">
		<input type="text" data-dest="mineralName${i}" id="mineralNameInput${i}">
	</div>
	<div class="tableCell text" data-mineral="section${i}" data-section="mineral mineral${i}">
		<label for="mineralFile_input${i}">Mineral file name:</label>
	</div>
	<div class="tableCell data" data-mineral="section${i}" data-section="mineral mineral${i}">
		<input type="text" id="mineralFile_input${i}" data-dest="mineralFile${i}" data-default="NmsMisc_NotAvailable.png">
		<input type="file" id="mineralFileUpl${i}" accept="image/*" oninput="image(this)">
	</div>
	<div class="tableCell text" data-mineral="section${i}" data-section="mineral mineral${i}">
		<label for="mineralDiscovererInput${i}">Discoverer:</label>
	</div>
	<div class="tableCell data" data-mineral="section${i}" data-section="mineral mineral${i}">
		<input data-dest="mineralDiscoverer${i}" type="text" id="mineralDiscovererInput${i}">
	</div>`;

	const outputHTML = `<div data-mineral="section${i}">{{MineralCard</div>
	<div data-mineral="section${i}">|image = <output id="mineralFile${i}"></output></div>
	<div data-mineral="section${i}">|name = <output id="mineralName${i}" name="mineralName${i}"></output></div>
	<div data-mineral="section${i}">|discovered = <output id="mineralDiscoverer${i}"></output></div>
	<div data-mineral="section${i}">}}</div>`;

	inputSection.insertAdjacentHTML('beforebegin', inputHTML);
	outputSection.insertAdjacentHTML('beforeend', outputHTML);

	postProcessSection(element, sectionType, i);
}

function postProcessSection(element: HTMLButtonElement, sectionType: string, i: number) {
	changeTableEntry(element);
	addAllTooltips();

	const sectionElements: { input: Record<string, string>; output: Record<string, string> } = { input: {}, output: {} };

	const inputs = document.querySelectorAll<HTMLInputElement | HTMLSelectElement>(`[data-${sectionType}="section${i}"] :is(input, select)`);
	for (const input of inputs) {
		sectionElements.input[input.id] = input.id;
		if (input.dataset.dest) {
			assignFunction(input, 'wikiCode(this)');
			wikiCode(input);
		}
		if (input.dataset.destNoauto) {
			assignFunction(input, 'storeData(this)');
			storeData(input);
		}
		if ((input as HTMLInputElement).dataset.default) {
			assignFunction(input, 'assignDefaultValue(this)', null, true);
			assignDefaultValue(input as HTMLInputElement);
		}
		if ('list' in input && input.list) {
			assignFunction(input, 'forceDatalist(this)', 'onchange');
		}
	}
	const outputs = document.querySelectorAll<HTMLOutputElement>(`[data-${sectionType}="section${i}"] output`);
	for (const output of outputs) {
		if (output.id) sectionElements.output[output.id] = output.id;
	}
	updateGlobalElements(sectionElements);
}

function changeTableEntry(element: HTMLElement) {
	const parent = element.parentElement as HTMLElement | null;
	if (!parent) return;
	const section = parent.dataset.section as string;
	const elements = document.querySelectorAll<HTMLElement>(`.tableHeader[data-${section}]`);
	for (let i = 0; i < elements.length; i++) {
		const className = 'is-' + oddEven(i + 1);
		const subsection = elements[i].dataset[section] as string;
		const cells = document.querySelectorAll<HTMLElement>(`[data-${section}="${subsection}"]`);
		for (const cell of cells) {
			cell.classList.remove('is-odd', 'is-even');
			cell.classList.add(className);
		}
	}
	if (!parent.dataset[section]) return;

	if (section !== 'fauna') {
		findAndRemove(links.resources?.[section]);
		floraMineralResourceLinks();
	}

	function findAndRemove(object: Record<string, any> | undefined) {
		if (!object) return;
		const subsection = parent?.dataset[section] as string;
		const sectionNumber = extractNumber(subsection);
		const item = Object.keys(object);
		const itemName = item.find(entry => extractNumber(entry) === sectionNumber);
		if (itemName) delete object[itemName];
	}
}

function addGenus(element: HTMLSelectElement | null = null) {
	const genera = (links.genera ??= {});
	if (element) {
		const value = element.value;
		const dest = element.dataset.destNoauto as string;
		genera[dest] = sanitiseString(value);
	}

	const usedGenera = new Set();
	const linkedGenera = sortObj(structuredClone(genera), true) as Record<string, string>;
	for (const creature in linkedGenera) {
		const genus = linkedGenera[creature];
		if (genus && !usedGenera.has(genus)) {
			linkedGenera[creature] = `[[${genus}]]`;
			usedGenera.add(genus);
		}
	}

	for (const key in linkedGenera) {
		const outputElement = globalElements.output[key];
		if (outputElement) outputElement.innerText = linkedGenera[key];
	}
}

function floraMineralResourceLinks(element: HTMLInputElement | null = null) {
	const resources = (links.resources ??= {});
	if (element) {
		const value = element.value;
		const target = element.dataset.destNoauto as string;
		const id = element.id;
		const sectionName = (element.parentElement as HTMLElement).dataset.section?.split(' ')[0] as string;
		const planetProp = sectionName.replace(extractNumber(sectionName), '');

		resources[planetProp] ??= {};
		resources[planetProp][target] ??= {};
		resources[planetProp][target][id] = sanitiseString(value);
	}

	const usedResources = new Set();
	const linkedResources = sortObj(structuredClone(resources)) as Record<string, Record<string, Record<string, string>>>;
	for (const planetPropName in sortObj(linkedResources)) {
		const planetProp = linkedResources[planetPropName];
		for (const destId in sortObj(planetProp)) {
			const resourceGroup = planetProp[destId];
			for (const resourceInput in resourceGroup) {
				const resource = resourceGroup[resourceInput];
				if (resource && !usedResources.has(resource)) {
					resourceGroup[resourceInput] = `[[${resource}]]`;
					usedResources.add(resource);
				}
			}
		}
	}

	for (const prop in linkedResources) {
		for (const outputElement in linkedResources[prop]) {
			const output = Object.values(linkedResources[prop][outputElement]).filter(resource => resource).join(', ');
			const target = globalElements.output[outputElement];
			if (target) target.innerText = output;
		}
	}
}

const planetMoonGenusDropdown = (element: HTMLSelectElement) => {
	const creatureData = getCreatureData();
	const ecosystem = element.value;
	const genera = Object.keys(creatureData.ecosystems[ecosystem]);
	const sectionNumber = extractNumber(element.id);
	const genusInputID = 'faunaGenusInput' + sectionNumber;

	const commonNames: string[] = [];
	for (const genus of genera) {
		commonNames.push(`${genus} (${creatureData.ecosystems[ecosystem][genus].commonName})`);
	}

	setDropdownOptions(globalElements.input[genusInputID] as HTMLSelectElement, genera, commonNames);
	addGenus(globalElements.input[genusInputID] as HTMLSelectElement);
};
planetMoonWindow.genusDropdown = planetMoonGenusDropdown;

const planetMoonResetExternal = () => {
	const sections = document.querySelectorAll('[data-moon], [data-resource], [data-fauna], [data-flora], [data-mineral]');
	removeSection(sections);
};
planetMoonWindow.resetExternal = planetMoonResetExternal;
