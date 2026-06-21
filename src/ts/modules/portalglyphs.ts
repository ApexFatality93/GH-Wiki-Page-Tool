const validPortalKeys = '0123456789ABCDEF';

type PortalPageData = SharedPageData & {
	portalglyphs: string;
	civShort: string;
};

type PortalInputs = SharedGlobalInputs & {
	portalglyphsInput: HTMLInputElement;
};

type PortalOutputs = SharedGlobalOutputs & {
	portalglyphButtons: HTMLElement;
};

const portalPageData = pageData as PortalPageData;
const portalInputs = globalElements.input as PortalInputs;
const portalOutputs = globalElements.output as PortalOutputs;

(() => {
	const glyphs: string[] = [];
	for (const letter of validPortalKeys) {
		const glyph = `<button type="button" class="button" value="${letter}"><span class="glyph icon is-small">${letter}</span></button>`;
		glyphs.push(glyph);
	}
	portalOutputs.portalglyphButtons.innerHTML = glyphs.join('');
	portalOutputs.portalglyphButtons.addEventListener('click', (event: Event) => {
		const target = event.target as HTMLElement | null;
		const button = target?.closest('button') as HTMLButtonElement | null;
		if (!button) return;
		glyphOnClick(button);
	});
})();

function executeOnInput() {
	const { portalglyphsInput } = portalInputs;
	portalglyphsInput.oninput?.call(portalglyphsInput, new InputEvent('input'));
}

function glyphOnClick(button: HTMLButtonElement) {
	const input = portalInputs.portalglyphsInput;
	const portalCode = input.value;

	if (portalCode.length < 12) {
		input.value += button.value;
	}
	executeOnInput();
}

function displayGlyphs() {
	const input = portalInputs.portalglyphsInput;
	const glyphString = input.value;
	portalPageData.portalglyphs = glyphString;
	const dest = input.dataset.destNoauto;
	wikiCode(glyphString, dest);
	glyphRegion(glyphString);
	if (resolveBoundElements('galacticCoords')) {
		wikiCode(glyphs2Coords(glyphString), 'galacticCoords');
	}
}

function deleteCharacter() {
	const enteredGlyphs = portalInputs.portalglyphsInput.value.split('');
	enteredGlyphs.pop();
	const newString = enteredGlyphs.join('');
	portalInputs.portalglyphsInput.value = newString;
	executeOnInput();
}

function glyphInputOnChange(input?: HTMLInputElement | null) {
	const newValue = input?.value?.toUpperCase?.();
	if (newValue == null || !input) return;

	input.value = newValue
		.split('')
		.filter(char => validPortalKeys.includes(char))
		.join('')
		.substring(0, 12);
	displayGlyphs();
}

function glyphRegion(glyphs: string) {
	const glyphElement = portalInputs.portalglyphsInput;
	const civ = portalPageData.civShort;
	const regionList = regions[civ];
	let region = '';
	const isComplete = glyphs?.length === 12;
	if (isComplete) {
		const regionGlyphs = glyphs.substring(4);
		region = regionList?.[regionGlyphs] ?? '';
	}
	if (isComplete && !region) {
		errorMessage(glyphElement, 'No valid Hub region. See <a href="https://nmsgalactichub.miraheze.org/wiki/Galactic_Hub_Regions" target="_blank" rel="noopener noreferrer">Galactic Hub Regions</a> for a list of valid regions.');
	} else {
		errorMessage(glyphElement);
	}
	wikiCode(region, 'region');
}

function glyphs2Coords(glyphs: string) {
	if (glyphs.length !== 12) return '';

	const X_Z_POS_SHIFT = 2049;
	const X_Z_NEG_SHIFT = 2047;
	const Y_POS_SHIFT = 129;
	const Y_NEG_SHIFT = 127;

	const xGlyphs = parseInt(glyphs.substring(9, 12), 16);
	const yGlyphs = parseInt(glyphs.substring(4, 6), 16);
	const zGlyphs = parseInt(glyphs.substring(6, 9), 16);
	const systemIdx = glyphs.substring(1, 4);

	let coordsX = 0;
	let coordsY = 0;
	let coordsZ = 0;

	if (xGlyphs >= X_Z_POS_SHIFT) {
		coordsX = xGlyphs - X_Z_POS_SHIFT;
	} else {
		coordsX = xGlyphs + X_Z_NEG_SHIFT;
	}

	if (zGlyphs >= X_Z_POS_SHIFT) {
		coordsZ = zGlyphs - X_Z_POS_SHIFT;
	} else {
		coordsZ = zGlyphs + X_Z_NEG_SHIFT;
	}

	if (yGlyphs >= Y_POS_SHIFT) {
		coordsY = yGlyphs - Y_POS_SHIFT;
	} else {
		coordsY = yGlyphs + Y_NEG_SHIFT;
	}

	const coordinates = new Array<string>(4);
	coordinates[0] = coordsX.toString(16).toUpperCase().padStart(4, '0');
	coordinates[1] = coordsY.toString(16).toUpperCase().padStart(4, '0');
	coordinates[2] = coordsZ.toString(16).toUpperCase().padStart(4, '0');
	coordinates[3] = systemIdx.padStart(4, '0');

	return coordinates.join(':');
}
