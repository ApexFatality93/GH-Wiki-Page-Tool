type BusinessPageData = SharedPageData & {
	currency: string;
};

type BusinessInputs = SharedGlobalInputs & {
	contentsInput: HTMLElement;
};

type BusinessOutputs = SharedGlobalOutputs & {
	contents: HTMLElement;
};

const businessPageData = pageData as BusinessPageData;
const businessInputs = globalElements.input as BusinessInputs;
const businessOutputs = globalElements.output as BusinessOutputs;

const businessStartupFunctions = () => {
	const input = document.querySelector('[oninput*="enPrefix"]') as HTMLInputElement | null;
	if (input) {
		enPrefix(input.value, 'enPrefix');
	}
};
(window as typeof window & { startupFunctions?: () => void }).startupFunctions = businessStartupFunctions;

const businessElements = {
	input: {
		contentsInput: 'contentsInput',
	},
	output: {
		contents: 'contents',
	}
};
updateGlobalElements(businessElements);

const businessElementFunctions = {
	ownerInput: ['hideDiscoverer("ownerInput", "ownerlinkInput")'],
	ownerlinkInput: ['hideDiscoverer("ownerlinkInput", "ownerInput")'],
	currencyInput: ['fixHC(this); enPrefix(this.value, "enPrefix")'],
};
assignElementFunctions(businessElementFunctions);

(() => {
	const currencyDatalist = {
		currencies: ['{{CurrencyHubCoin}}']
	};
	datalists(currencyDatalist);
})();

function fixHC(element: HTMLInputElement) {
	const value = businessPageData.currency.toLowerCase();
	const dest = element.dataset.dest;
	if (value === 'hubcoin') wikiCode('{{CurrencyHubCoin}}', dest);
}

function addSection() {
	const inputSection = businessInputs.contentsInput;
	const outputSection = businessOutputs.contents;
	const elementList = document.querySelectorAll('[data-section]');
	const childIndex = getChildIndex(elementList, 'dataset.section');
	const heading = 'heading' + childIndex;
	const img = 'img' + childIndex;
	const text = 'text' + childIndex;
	const headingInput = 'heading_input' + childIndex;
	const imgInput = 'img_input' + childIndex;
	const imgUpload = 'img_upload' + childIndex;
	const textInput = 'text_input' + childIndex;

	const inputTemplate = `<div class="tableHeader text sectionToggle" data-section="section${childIndex}">
		<div><span class="has-text-weight-bold">Title: </span><output name=${heading}></output></div>
		<button class="button is-danger is-outlined" type="button" data-remove-section="section${childIndex}">Remove</button>
	</div>
	<div class="tableCell text" data-section="section${childIndex}">
		<label for="${headingInput}">Section heading:</label>
	</div>
	<div class="tableCell data" data-section="section${childIndex}">
		<input type="text" id="${headingInput}" data-dest="${heading}">
	</div>
	<div class="tableCell text" data-section="section${childIndex}">
		<label for="${imgInput}">Image name, including file extension:</label>
	</div>
	<div class="tableCell data" data-section="section${childIndex}">
		<input type="text" id="${imgInput}" data-dest="${img}">
		<input type="file" id="${imgUpload}" accept="image/*">
	</div>
	<div class="tableHeader data no-flex" data-section="section${childIndex}">
		<label for="${textInput}">Content:</label>
		<textarea class="mb-2" id="${textInput}" data-dest="${text}"></textarea>
	</div>`;

	const codeTemplate = `<div data-section="section${childIndex}">==<output name="${heading}"></output>==</div>
	<div style="display:none" data-section="section${childIndex}">[[File:<output id="${img}"></output>|thumb]]</div>
	<div data-section="section${childIndex}"><output id="${text}"></output><br><br></div>`;

	inputSection.insertAdjacentHTML('beforebegin', inputTemplate);
	outputSection.insertAdjacentHTML('beforeend', codeTemplate);

	const inputs = document.querySelectorAll(`[data-section="section${childIndex}"] :is(input, textarea)`);
	for (const input of inputs) {
		assignFunction(input, 'wikiCode(this)');
	}

	document.getElementById(imgInput)?.addEventListener('input', function () {
		showContentImg(this as HTMLInputElement);
	});
	document.getElementById(imgUpload)?.addEventListener('change', function () {
		image(this as HTMLInputElement);
		showContentImg((this as HTMLInputElement).previousElementSibling as HTMLInputElement);
	});
	document.querySelector(`[data-remove-section="section${childIndex}"]`)?.addEventListener('click', () => {
		removeSpecificSection(`section${childIndex}`);
	});
}

function showContentImg(element: HTMLInputElement) {
	const dest = element.dataset.dest;
	if (!dest) return;
	const target = document.getElementById(dest)?.parentElement;
	if (!target) return;
	target.style.display = element.value ? '' : 'none';
}

const businessResetExternal = () => {
	const contentSections = document.querySelectorAll('[data-section]');
	businessOutputs.contents.innerText = '';
	removeSection(contentSections);
};
(window as typeof window & { resetExternal?: () => void }).resetExternal = businessResetExternal;
