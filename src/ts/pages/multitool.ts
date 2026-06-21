type MultitoolWindow = typeof window & {
	startupFunctions?: () => void;
	galleryExplanationExternal?: () => string;
	generateGalleryArray?: () => void;
};

type GalleryPic = {
	picName?: string;
	desc?: string;
};

type MultitoolPageData = SharedPageData & {
	region: string;
	civShort: string;
	name: string;
	type: string;
	mainColour: string;
	secColour: string;
	srLocName: string;
	planet: string;
	moon: string;
	axes: string;
	location: string;
	srLoc: string;
	actualSrLoc: string;
	srPlanetImg: string;
	sysImg: string;
	cabinetPlanetImg: string;
	axesImg: string;
	size: string;
	class: string;
	slots: string;
	acquirement: string;
	galleryArray: string[];
};

type MultitoolInputs = SharedGlobalInputs & {
	appearanceInput: HTMLInputElement;
	locInput: HTMLInputElement;
	sizeInput: HTMLSelectElement;
	typeInput: HTMLInputElement;
	dmgInput: HTMLInputElement;
	scanInput: HTMLInputElement;
	costInput: HTMLInputElement;
	slotsInput: HTMLInputElement;
	srInput: HTMLInputElement;
};

type MultitoolOutputs = SharedGlobalOutputs & {
	addInfo: HTMLElement;
	acquirementGallery: HTMLElement;
};

const multitoolWindow = window as MultitoolWindow;
const multitoolPageData = pageData as MultitoolPageData;
const multitoolInputs = globalElements.input as MultitoolInputs;
const multitoolOutputs = globalElements.output as MultitoolOutputs;

const multitoolStartupFunctions = () => {
	locGalaxy();
	acquirementBundle();
	multitoolAddInfo();
	autoRoyal();
	autoSentinel();
	autoAtlantid();
	showSizeDropdown();
	MTType();
	bundleNumberStats();
	hideLocName();
	hideSrLocName();
	locHubNr();
};
multitoolWindow.startupFunctions = multitoolStartupFunctions;

const MTElementFunctions = {
	civ: ['locGalaxy(); addInfo(); appearance(); locHubNr()', null, true],
	typeInput: ['addInfo(); appearance(); autoRoyal(); autoSentinel(); autoAtlantid(); showSizeDropdown(); MTType()', null, true],
	sizeInput: ['showSizeDropdown(); MTType()'],
	locInput: ['acquirementBundle(); hideLocName()'],
	srlocInput: ['acquirementBundle(); hideSrLocName()'],
	srInput: ['acquirementBundle()'],
	planetInput: ['acquirementBundle()'],
	moonInput: ['acquirementBundle()'],
	axesInput: ['acquirementAlbumBundle()'],
	dmgInput: ['numberStats(this, 1, true)'],
	scanInput: ['numberStats(this, 1, true)'],
	costInput: ['numberStats(this)'],
	slotsInput: ['numberStats(this)'],
	srImgInput: ['acquirementGallery()'],
	sysImgInput: ['acquirementGallery()'],
	cabInput: ['acquirementGallery()'],
	coordsInput: ['acquirementGallery()'],
	srImgUpload: ['acquirementGallery()', null, true],
	sysImgUpload: ['acquirementGallery()', null, true],
	cabUpload: ['acquirementGallery()', null, true],
	coordsUpload: ['acquirementGallery()', null, true],
	portalglyphsInput: ['locHubNr()', null, true],
	mainColourInput: ['appearance()'],
	secColourInput: ['appearance()'],
};
assignElementFunctions(MTElementFunctions);

function locHubNr() {
	wikiCode(regNr(multitoolPageData.region), 'HubNr');
}

function locGalaxy() {
	const civ = multitoolPageData.civShort;
	const text = HubGal(civ);
	wikiCode(text, 'locGalaxy');
}

function multitoolAddInfo() {
	const civ = shortenGHub(multitoolPageData.civShort);
	const catalog = (() => {
		if (civ === 'CalHub') return 'Multi-Tool Album (Calypso)';
		if (civ === 'EisHub') return 'Multi-Tool Album (Eissentam)';
		return 'Multi-Tool Album (Euclid)';
	})();

	multitoolOutputs.addInfo.innerText = `[[${catalog}]]`;
}

function appearance() {
	const name = multitoolPageData.name;
	const type = multitoolPageData.type.toLowerCase();
	const colour1 = multitoolPageData.mainColour;
	const colour2 = multitoolPageData.secColour;
	const appearanceInput = multitoolInputs.appearanceInput;

	if (!(colour1.trim() || colour2.trim())) return;

	const mainColour = colour1.trim()
		? `${enPrefix(colour1)} ${colour1.trim()}`
		: enPrefix(type);
	const accentColour = colour2.trim() ? ` with ${colour2} accents` : '';
	appearanceInput.value = `${name} is ${mainColour} ${type} multi-tool${accentColour}.`;
	wikiCode(appearanceInput);
}

function acquirementAlbumBundle() {
	acquirement();
}

function acquirementBundle() {
	acquirementAlbumBundle();
	acquirementGallery();
}

function acquirement() {
	const srName = multitoolPageData.srLocName;
	const planet = multitoolPageData.planet;
	const moon = multitoolPageData.moon;
	const coords = multitoolPageData.axes;
	const loc = multitoolPageData.location.toLowerCase();
	const body = planetMoonSentence(planet, moon) as string;
	let instructions = '';
	let savereload = '';

	const srloc = (() => {
		const preSrloc = multitoolPageData.srLoc;
		if (preSrloc.includes('Space') || srName) return preSrloc;
		if (loc.includes('Space')) return loc;
		return body;
	})();

	if (loc.includes('space')) {
		instructions = `fly to the ${loc}`;
		savereload = `the ${srloc}`;

		if (loc === srloc || !srName) {
			instructions = 'take from cabinet';
		} else if (!srloc.includes('space')) {
			savereload = `${srloc} [[${srName}]]`;
		}
	} else {
		savereload = `${srloc} [[${srName}]]`;
		instructions = `fly to ${body} (${coords})`;

		if (srloc.includes('space')) {
			savereload = `the ${srloc}`;
		} else if ((moon && srloc === 'moon' && srName === moon) || (!moon && srloc === 'planet' && srName === planet)) {
			instructions = `fly to ${coords}`;
		} else if (!srName) {
			savereload = `${body}`;
			instructions = `fly to ${coords}`;
		}
	}

	const sentence = `Save and reload on ${savereload}, then ${instructions}.`;
	wikiCode(sentence, 'acquirement');
	multitoolPageData.actualSrLoc = srloc;
}

function acquirementGallery() {
	const srName = multitoolPageData.srLocName;
	const srImg = multitoolPageData.srPlanetImg || 'nmsMisc_notAvailable.png';
	const sysImg = multitoolPageData.sysImg || 'nmsMisc_notAvailable.png';
	const cabinetPlanetImg = multitoolPageData.cabinetPlanetImg || 'nmsMisc_notAvailable.png';
	const axesImg = multitoolPageData.axesImg || 'nmsMisc_notAvailable.png';
	const loc = multitoolPageData.location;
	const pics: GalleryPic[] = [{}, {}, {}, {}];
	const body = planetMoon();

	const srloc = (() => {
		const preSrloc = multitoolPageData.srLoc;
		if (preSrloc.includes('Space') || srName) return preSrloc;
		if (loc.includes('Space')) return loc;
		return body;
	})();

	const type = loc === 'Sentinel Pillar' ? 'Pillar' : 'Cabinet';
	const highlight = !loc.includes('Space') ? `(${type} ${body} highlighted)` : '';

	function fillPicObj(obj: GalleryPic, img: string, desc: string) {
		obj.picName = img;
		obj.desc = desc;
	}

	fillPicObj(pics[0], srImg, `Save/Reload ${srloc}`);
	fillPicObj(pics[1], sysImg, `System ${highlight}`);
	if (!loc.includes('Space')) {
		fillPicObj(pics[2], cabinetPlanetImg, `${type} ${body}`);
		fillPicObj(pics[3], axesImg, 'Coordinates');
	}

	const codeArray: string[] = [];
	for (const picObj of pics) {
		const pic = picObj.picName;
		const desc = picObj.desc;
		if (!pic || !desc) continue;
		const gallery = document.createElement('span');
		gallery.style.display = 'block';
		gallery.innerText = `${pic}|${desc}`;
		codeArray.push(gallery.outerHTML);
	}
	multitoolOutputs.acquirementGallery.innerHTML = codeArray.join('');
}

function autoRoyal() {
	const type = multitoolPageData.type;
	const locElement = multitoolInputs.locInput;

	if (type === 'Royal') {
		hideInput(locElement, 'none');
		locElement.value = 'Sentinel Pillar';
		wikiCode(locElement);
	} else {
		hideInput(locElement, '');
	}
}

function autoSentinel() {
	const type = multitoolPageData.type;
	const locElement = multitoolInputs.locInput;

	if (type === 'Sentinel') {
		locElement.value = 'Harmonic Camp';
		wikiCode(locElement);
	} else {
		hideInput(locElement, '');
	}
}

function autoAtlantid() {
	const type = multitoolPageData.type;
	const locElement = multitoolInputs.locInput;

	if (type === 'Atlantid') {
		locElement.value = 'Monolith';
		wikiCode(locElement);
	} else {
		hideInput(locElement, '');
	}
}

function showSizeDropdown() {
	const type = multitoolPageData.type;
	const size = multitoolPageData.size;
	const sizeInput = multitoolInputs.sizeInput;
	const smgOption = sizeInput.querySelector('option[value="SMG"]') as HTMLOptionElement | null;
	if (smgOption) smgOption.style.display = type === 'Experimental' ? 'none' : '';
	if (type === 'Experimental' && size === 'SMG') sizeInput.value = 'Pistol';

	if (!['Royal', 'Starter Pistol', 'Sentinel', 'Atlantid'].includes(type)) {
		hideInput(sizeInput, '');
	} else {
		hideInput(sizeInput, 'none');
	}
}

function MTType() {
	const typeElement = multitoolInputs.typeInput;
	const type = typeElement.value;
	const typeShort = type.split(' ').slice(-1).join();
	const size = multitoolPageData.size;
	const output = (() => {
		if (type === 'Standard' && size === 'SMG') return 'Rifle';
		if (type === 'Standard') return size;
		return typeShort;
	})();

	enPrefix(output, 'enPrefix');
	const dest = typeElement.dataset.destNoauto;
	wikiCode(output, dest);
	if (!dest) return;
	pageData[dest] = type;
}

function bundleNumberStats() {
	numberStats(multitoolInputs.dmgInput, 1);
	numberStats(multitoolInputs.scanInput, 1);
	numberStats(multitoolInputs.costInput);
	numberStats(multitoolInputs.slotsInput);
}

function hideLocName() {
	const loc = multitoolPageData.location;
	const idArray = ['planetInput', 'moonInput', 'axesInput'];
	if (loc.includes('Space')) {
		for (const id of idArray) {
			const element = globalElements.input[id] as HTMLInputElement;
			hideInput(element, 'none');
			element.value = '';
			wikiCode(element);
			errorMessage(element);
		}
	} else {
		for (const id of idArray) {
			hideInput(globalElements.input[id] as HTMLElement, '');
		}
	}
}

function hideSrLocName() {
	const srLoc = multitoolPageData.srLoc;
	const srLocNameInput = multitoolInputs.srInput;
	if (srLoc.includes('Space')) {
		hideInput(srLocNameInput, 'none');
		srLocNameInput.value = '';
		wikiCode(srLocNameInput);
	} else {
		hideInput(srLocNameInput, '');
	}
}

const multitoolGalleryExplanationExternal = () => {
	return `There is a preferred order of pictures:
	<div class='is-flex is-justify-content-center'>
		<ol class='has-text-left'>
			<li>Discovery Menu</li>
			<li>Price Page</li>
			<li>Base Stats</li>
			<li>Minor Settlement/Sentinel Pillar/Harmonic Camp/Monolith</li>
			<li>Tool in Hand</li>
			<li>First Person View</li>
		</ol>
	</div>`;
};
multitoolWindow.galleryExplanationExternal = multitoolGalleryExplanationExternal;

const multitoolGenerateGalleryArray = () => {
	const array = [
		'',
		'Discovery Menu',
		'Price Page',
		'Base Stats',
		'Minor Settlement',
		'Sentinel Pillar',
		'Harmonic Camp',
		'Monolith',
		'Tool in hand',
		'First Person View',
	];

	const location = multitoolPageData.location;
	const locs = ['Minor Settlement', 'Sentinel Pillar', 'Harmonic Camp', 'Monolith'];
	if (locs.includes(location)) {
		const rmLoc = (() => {
			const index = locs.indexOf(location);
			locs.splice(index, 1);
			return locs[0];
		})();
		const index = array.indexOf(rmLoc);
		array.splice(index, 1);
	} else {
		for (let i = array.length - 1; i >= 0; i--) {
			if (locs.includes(array[i])) array.splice(i, 1);
		}
	}

	multitoolPageData.galleryArray = array;
};
multitoolWindow.generateGalleryArray = multitoolGenerateGalleryArray;
