type CreatureData = {
	ecosystems: Record<string, Record<string, { commonName: string; produces: string[] }>>;
	catalogs: Record<string, Record<string, string[]>>;
};

type FaunaPageData = SharedPageData & {
	ecosystem: string;
	galaxy: string;
	catalog: string;
	genus: string;
	gender: string;
	gender2: string;
	notes: string;
	addObservation: string;
	height: string;
	height2: string;
	weight: string;
	weight2: string;
	moon: string | boolean;
	galleryArray: string[];
	[key: string]: any;
};

type FaunaInputs = SharedGlobalInputs & {
	genusInput: HTMLSelectElement;
	catalogInput: HTMLSelectElement;
	nameInput: HTMLInputElement;
	oldNameInput: HTMLInputElement;
	producesInput: HTMLSelectElement;
	weight2Input: HTMLInputElement;
	height2Input: HTMLInputElement;
	gender2Input: HTMLInputElement;
	specialNotesInput?: HTMLInputElement;
	notesInput: HTMLInputElement;
	dmInput?: HTMLTextAreaElement;
	gender1: HTMLElement;
	gender: ArrayLike<HTMLInputElement>;
};

type FaunaOutputs = SharedGlobalOutputs & {
	addInfo: HTMLElement;
	addObservation?: HTMLElement;
};

type FaunaWindow = typeof window & {
	startupFunctions?: () => void;
	genusDropdown?: () => void;
	albumDropdown?: () => void;
	pageName?: () => string;
	bundlePropFunctions?: () => void;
	generateGalleryArray?: () => void;
	noLineBreak?: () => void;
	galleryExplanationExternal?: () => string;
};

const faunaWindow = window as FaunaWindow;
const faunaPageData = pageData as FaunaPageData;
const faunaInputs = globalElements.input as FaunaInputs;
const faunaOutputs = globalElements.output as FaunaOutputs;

const faunaStartupFunctions = () => {
	faunaGenusDropdown();
	faunaAlbumDropdown();
	hideOrgName();
	faunaPageName();
	specialNotes();
	specialNotesTextFunc();
	genusProduces();
	faunaAddInfo();
	addInfoBullet();
	hideSecGenderProps();
	hideCreaturePrio();
	faunaBundlePropFunctions();
	planetMoonSentence();
	faunaNoLineBreak();
};
faunaWindow.startupFunctions = faunaStartupFunctions;

const creatureElements = {
	input: {
		gender: 'Gender',
	},
};
updateGlobalElements(creatureElements);

const creatureElementFunctions = {
	nameInput: ['pageName()'],
	oldNameInput: ['hideOrgName(); pageName()'],
	planetInput: ['planetMoonSentence()'],
	moonInput: ['planetMoonSentence()'],
	ecosystemInput: ['genusDropdown(); albumDropdown(); genusProduces()'],
	genusInput: ['genusProduces()'],
	civ: ['albumDropdown()', null, true],
	notesInput: ['specialNotes(); specialNotesTextFunc()'],
	specialNotesInput: ['specialNotesTextFunc()'],
	catalogInput: ['storeData(this); faunaAddInfo(); addInfoBullet()'],
	researchTeam: ['faunaAddInfo()', null, true],
	genderInput: ['hideSecGenderProps(); hideCreaturePrio(); genderProps("gender", "gender2")'],
	gender2Input: ['hideSecGenderProps(); hideCreaturePrio(); genderProps("gender", "gender2")'],
	heightInput: ['genderProps("height", "height2"); numberError(this)'],
	weightInput: ['genderProps("weight", "weight2"); numberError(this)'],
	height2Input: ['genderProps("height", "height2"); numberError(this)'],
	weight2Input: ['genderProps("weight", "weight2"); numberError(this)'],
	gender: ['bundlePropFunctions()'],
	dmInput: ['noLineBreak()'],
};
assignElementFunctions(creatureElementFunctions);

const faunaGenusDropdown = () => {
	const creatureData = getCreatureData() as CreatureData;
	const ecosystem = faunaPageData.ecosystem;
	const genera = Object.keys(creatureData.ecosystems[ecosystem]);
	const commonNames: string[] = [];

	for (const genus of genera) {
		if (genus === '') {
			commonNames.push(creatureData.ecosystems[ecosystem][genus].commonName);
		} else {
			commonNames.push(`${genus} (${creatureData.ecosystems[ecosystem][genus].commonName})`);
		}
	}

	setDropdownOptions(faunaInputs.genusInput, genera, commonNames);
	wikiCode(faunaInputs.genusInput);
};
faunaWindow.genusDropdown = faunaGenusDropdown;

const faunaAlbumDropdown = () => {
	const creatureData = getCreatureData() as CreatureData;
	const ecosystem = faunaPageData.ecosystem;
	const catalogInput = faunaInputs.catalogInput;
	const galaxy = faunaPageData.galaxy;

	const albums = creatureData.catalogs[galaxy][ecosystem];
	const albumValues = [albums[0]];
	const albumTexts = [albums[0]];
	for (let i = 1; i < albums.length; i++) {
		const text = `${albums[i]}`;
		albumValues.push(`${text} Album (${galaxy})`);
		albumTexts.push(text);
	}
	setDropdownOptions(catalogInput, albumValues, albumTexts);
	storeData(catalogInput);
};
faunaWindow.albumDropdown = faunaAlbumDropdown;

function faunaAddInfo() {
	const outputElement = faunaOutputs.addInfo;
	const catalog = faunaPageData.catalog;

	if (!catalog) {
		outputElement.style.display = 'none';
		return;
	}
	outputElement.style.display = '';
	outputElement.innerText = `Featured in the [[${catalog}]]`;
	addInfoBullet();
}

const faunaPageName = () => {
	const newName = faunaInputs.nameInput.value;
	const orgName = faunaInputs.oldNameInput.value;
	const name = orgName || newName;
	wikiCode(name, 'name');
	return name;
};
faunaWindow.pageName = faunaPageName;

function genusProduces() {
	const genus = faunaPageData.genus;
	const creatureData = getCreatureData() as CreatureData;
	const ecosystems = Object.keys(creatureData.ecosystems);
	const producesElement = faunaInputs.producesInput;

	for (const ecosystem of ecosystems) {
		if (!Object.keys(creatureData.ecosystems[ecosystem]).includes(genus)) continue;

		const food = creatureData.ecosystems[ecosystem][genus].produces;
		setDropdownOptions(producesElement, food);
		hideInput(producesElement, food.length > 1 ? '' : 'none');
		wikiCode(producesElement);
	}
}

function hideSecGenderProps() {
	const gen1 = faunaPageData.gender;
	const gen2 = faunaPageData.gender2;
	const gen2Weight = faunaInputs.weight2Input;
	const gen2Height = faunaInputs.height2Input;
	const gen2Input = faunaInputs.gender2Input;

	if (gen2 !== '' && gen1 !== gen2) {
		hideInput(gen2Weight, '');
		hideInput(gen2Height, '');
		return;
	}

	hideInput(gen2Weight, 'none');
	hideInput(gen2Height, 'none');
	gen2Weight.value = '';
	gen2Height.value = '';
	gen2Input.value = '';
	storeData(gen2Weight);
	storeData(gen2Height);
	storeData(gen2Input);
}

function specialNotes() {
	const notes = faunaPageData.notes;
	const specialNotesElement = faunaInputs.specialNotesInput;
	if (!specialNotesElement) return;
	specialNotesElement.value = notes;
	if (notes === 'Evil' || notes === 'Sheds and regrows bones') {
		hideInput(specialNotesElement, '');
	} else {
		hideInput(specialNotesElement, 'none');
	}
	storeData(specialNotesElement);
}

function specialNotesTextFunc() {
	const notes = faunaPageData.notes;
	const specialNotesValue = faunaPageData.addObservation;
	const notesElement = faunaInputs.notesInput;
	const addObservationElement = faunaOutputs.addObservation;
	if (!addObservationElement) return;
	if (!notes) {
		addObservationElement.innerText = "'''Additional Observations''': ";
		return;
	}

	const noteText = (specialNotesValue === notes || specialNotesValue === '')
		? `'''Additional Observations''': ${notes}`
		: specialNotesValue;
	addObservationElement.innerText = noteText;
}

function hideCreaturePrio() {
	const radio = faunaInputs.gender1;
	hideInput(radio, faunaPageData.gender2 ? '' : 'none');
}

function creaturePrio() {
	const genderRadios = faunaInputs.gender;
	for (const radio of Array.from(genderRadios)) {
		if (radio.checked) return radio.value;
	}
	return '';
}

function genderProps(property1Name: string, property2Name: string) {
	const prioritise = creaturePrio();
	const gender2 = faunaPageData.gender2;
	const property1Value = faunaPageData[property1Name] as string;
	const property2Value = faunaPageData[property2Name] as string;

	let property1Number: string | undefined;
	let property2Number: string | undefined;
	if (property1Name !== 'gender') {
		property1Number = parseFloat(property1Value) ? parseFloat(property1Value).toFixed(1) : '';
		property2Number = parseFloat(property2Value) ? parseFloat(property2Value).toFixed(1) : '';
	}

	const property1Data = property1Number ?? property1Value;
	const property2Data = property2Number ?? property2Value;
	faunaPageData[property1Name] = property1Data;
	faunaPageData[property2Name] = property2Data;

	const result = (() => {
		if (!gender2) return property1Data;
		if (property1Data === property2Data || !property2Data) return property1Data;
		if (!property1Data) return property2Data;
		return prioritise === 'gender1'
			? `${property1Data} - ${property2Data}`
			: `${property2Data} - ${property1Data}`;
	})();

	const outputElement = globalElements.output[property1Name];
	if (outputElement) outputElement.innerText = result;
}

const faunaBundlePropFunctions = () => {
	genderProps('height', 'height2');
	genderProps('weight', 'weight2');
	genderProps('gender', 'gender2');
};
faunaWindow.bundlePropFunctions = faunaBundlePropFunctions;

const faunaNoLineBreak = () => {
	const element = faunaInputs.dmInput;
	if (!element) return;
	const dest = element.dataset.destNoauto;
	element.value = element.value.replaceAll('\n', ' ');
	wikiCode(element, dest);
};
faunaWindow.noLineBreak = faunaNoLineBreak;

const faunaGenerateGalleryArray = () => {
	let gender1 = '';
	let gender2 = '';
	if (faunaPageData.gender2) {
		const prio = creaturePrio();
		if (prio === 'gender2') {
			gender1 = faunaPageData.gender2;
			gender2 = faunaPageData.gender;
		} else {
			gender1 = faunaPageData.gender;
			gender2 = faunaPageData.gender2;
		}
	}

	const array = [
		'',
		`${gender1} gender`,
		`${gender1} scan`,
		`${gender2} gender`,
		`${gender2} scan`,
		'Creature scan',
		'Discovery Menu',
		'Moon Page',
		'Planet Page',
		'System Page',
		'Galaxy Map',
	];

	if (!faunaPageData.moon) {
		const index = array.findIndex(item => item.toLowerCase().includes('moon'));
		array.splice(index, 1);
	}

	const lowerCase = structuredClone(array).map(item => item.toLowerCase());
	for (let i = array.length - 1; i >= 0; i--) {
		const element = lowerCase[i];
		if (gender2) {
			if (element.includes('creature')) array.splice(i, 1);
		} else if (element.includes('gender')) {
			array.splice(i, 1);
		}
	}

	faunaPageData.galleryArray = array;
};
faunaWindow.generateGalleryArray = faunaGenerateGalleryArray;

const faunaGalleryExplanationExternal = () => {
	return `There is a preferred order of pictures:
	<div class='dialog-center'>
		<ol class='dialog-list'>
			<li>Gender 1</li>
			<li>Gender 2</li>
			<li>Gender 1 scan</li>
			<li>Gender 2 scan</li>
			<li>Discovery Menu</li>
			<li>Moon Page</li>
			<li>Planet Page</li>
			<li>System Page</li>
			<li>Galaxy Map</li>
		</ol>
	</div>`;
};
faunaWindow.galleryExplanationExternal = faunaGalleryExplanationExternal;
