type SandwormWindow = typeof window & {
	startupFunctions?: () => void;
	generateGalleryArray?: () => void;
	galleryExplanationExternal?: () => string;
};

type SandwormPageData = SharedPageData & {
	planet: string;
	moon: string;
	name: string;
	galaxy: string;
	catalog: string;
	wormclass: string;
	wormmaxdepth: string;
	galleryArray: string[];
};

type SandwormInputs = SharedGlobalInputs & {
	autoSpawn: ArrayLike<HTMLInputElement>;
};

type SandwormOutputs = SharedGlobalOutputs & {
	autoSpawn: HTMLElement;
};

const sandwormWindow = window as SandwormWindow;
const sandwormPageData = pageData as SandwormPageData;
const sandwormInputs = globalElements.input as SandwormInputs;
const sandwormOutputs = globalElements.output as SandwormOutputs;

const sandwormStartupFunctions = () => {
	wormName();
	catalog();
	autoSpawn();
	planetMoonSentence();
};
sandwormWindow.startupFunctions = sandwormStartupFunctions;

const sandwormElements = {
	input: {
		autoSpawn: 'autoSpawnInput',
	},
};
updateGlobalElements(sandwormElements);

const sandwormElementFunctions = {
	civ: ['catalog()', null, true],
	planetInput: ['wormName(); planetMoonSentence()'],
	moonInput: ['wormName(); planetMoonSentence()'],
	autoSpawn: ['autoSpawn()'],
	wormmaxdepthInput: ['numberStats(this, 1)'],
};
assignElementFunctions(sandwormElementFunctions);

function wormName() {
	const planet = sandwormPageData.planet;
	const moon = sandwormPageData.moon;
	if (!planet) {
		sandwormPageData.name = '';
		return;
	}

	const body = moon || planet;
	wikiCode(body, 'bodyName');
	sandwormPageData.name = `Immortal Worm ${body}`;
}

function autoSpawn() {
	const elements = sandwormInputs.autoSpawn;
	let spawn = '';
	for (const element of Array.from(elements)) {
		if (element.checked) {
			spawn = element.value;
			break;
		}
	}

	const output = `This creature ${spawn} automatically spawn on a game reload.`;
	const autoSpawnOutput = sandwormOutputs.autoSpawn;
	if (spawn) {
		autoSpawnOutput.style.display = '';
		autoSpawnOutput.innerText = output;
	} else {
		autoSpawnOutput.style.display = 'none';
	}
	addInfoBullet();
}

function catalog() {
	const album = (() => {
		switch (sandwormPageData.galaxy) {
			case 'Euclid':
				return 'Euclid';
			case 'Calypso':
				return 'Calypso';
			case 'Eissentam':
				return 'Eissentam';
			default:
				return '';
		}
	})();

	const albumName = `Sandworm Album (${album})`;
	const output = `[[${albumName}]]`;
	wikiCode(output, 'addInfo');
	addInfoBullet();
	sandwormPageData.catalog = albumName;
}

const sandwormGenerateGalleryArray = () => {
	const array = [
		'',
		'Worm scan',
		'Moon Page',
		'Planet Page',
		'System Page',
		'Galaxy Map',
	];

	if (!sandwormPageData.moon) {
		const index = array.findIndex(item => item.toLowerCase().includes('moon'));
		array.splice(index, 1);
	}

	sandwormPageData.galleryArray = array;
};
sandwormWindow.generateGalleryArray = sandwormGenerateGalleryArray;

const sandwormGalleryExplanationExternal = () => {
	return `The preferred order of pictures is as follows:
	<div class='dialog-center'>
		<ol class='dialog-list'>
			<li>Worm scan</li>
			<li>Moon Page</li>
			<li>Planet Page</li>
			<li>System Page</li>
			<li>Galaxy Map</li>
		</ol>
	</div>`;
};
sandwormWindow.galleryExplanationExternal = sandwormGalleryExplanationExternal;
