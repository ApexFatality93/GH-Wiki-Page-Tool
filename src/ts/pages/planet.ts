type PlanetPageData = SharedPageData & {
	moons: string[];
};

type PlanetInputs = SharedGlobalInputs & {
	moonInputs: HTMLElement;
};

type PlanetOutputs = SharedGlobalOutputs & {
	moonList: HTMLElement;
};

const planetPageData = pageData as PlanetPageData;
const planetInputs = globalElements.input as PlanetInputs;
const planetOutputs = globalElements.output as PlanetOutputs;

function planetStartupFunctions() {
	moonList();
}

const planetElements = {
	input: {
		moonInputs: 'moonInputs',
	},
	output: {}
};
updateGlobalElements(planetElements);

function addMoon(element: HTMLButtonElement) {
	const inputSection = element.parentElement;
	if (!inputSection) return;
	const elementList = document.querySelectorAll('[data-moon]');
	const childIndex = getChildIndex(elementList, 'dataset.moon');
	const moonInput = 'moon_input' + childIndex;

	const inputHTML = `<div class="tableCell text removable" data-moon="section${childIndex}">
		<button class="button is-outlined is-danger icon is-small" title="Remove moon" type="button" data-remove-moon="section${childIndex}">&#10006</button>
		<label for="${moonInput}">Moon name:</label>
	</div>
	<div class="tableCell data" data-moon="section${childIndex}">
		<input type="text" id="${moonInput}">
	</div>`;

	inputSection.insertAdjacentHTML('beforebegin', inputHTML);
	document.getElementById(moonInput)?.addEventListener('input', moonList);
	document.querySelector(`[data-remove-moon="section${childIndex}"]`)?.addEventListener('click', () => {
		removeSpecificSection(`section${childIndex}`, 'moon');
		enableMoonAdd();
	});

	const moonInputSectionCount = document.querySelectorAll('[data-moon]').length / 2;
	if (moonInputSectionCount + 1 > 4) {
		element.disabled = true;
	}
}

function enableMoonAdd() {
	const addButton = planetInputs.moonInputs.querySelector('button') as HTMLButtonElement | null;
	if (addButton) addButton.disabled = false;
	moonList();
}

function moonList() {
	const moonInputs = document.querySelectorAll<HTMLInputElement>('[data-moon] input');
	const moons: string[] = [];
	for (const input of moonInputs) {
		if (input.value) moons.push(`[[${input.value}]]`);
	}

	planetOutputs.moonList.innerText = moons.join(', ');
	planetPageData.moons = moons;
	moonSentence();
}

function moonSentence() {
	const moons = planetPageData.moons;
	const output = (!moons || moons.length === 0)
		? 'This planet has no moons.'
		: moons.length === 1
			? `This planet's [[moon]] is ${moons[0]}.`
			: `This planet's [[moon]]s are ${formatMoonList(moons)}.`;
	wikiCode(output, 'moonSentence');
}

function formatMoonList(moons: string[]) {
	if (moons.length <= 1) return moons[0] ?? '';
	if (moons.length === 2) return `${moons[0]} and ${moons[1]}`;
	return `${moons.slice(0, -1).join(', ')}, and ${moons[moons.length - 1]}`;
}

function galleryExplanationExternal() {
	return `There is a preferred order of pictures:
	<div class='dialog-center'>
		<ol class='dialog-list'>
			<li>Landscape</li>
			<li>Night View</li>
			<li>Cave System</li>
			<li>Coast Area</li>
			<li>Underwater</li>
			<li>Analysis Visor</li>
			<li>Planet Exploration Guide</li>
			<li>Planet Page</li>
			<li>System Page</li>
			<li>Galaxy Map</li>
		</ol>
	</div>`;
}
