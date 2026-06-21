type ActionsPageData = SharedPageData & {
	debug: boolean;
	name: string;
};

type ActionsOutputs = SharedGlobalOutputs & {
	actions: HTMLElement;
	fullArticle: HTMLElement;
};

const actionsPageData = pageData as ActionsPageData;
const actionsOutputs = globalElements.output as ActionsOutputs;

(() => {
	const actions = `
<button class="button is-outlined is-primary" id="copy" type="button">Copy wikicode</button>
<a class="button is-outlined is-primary" id="download">Download file</a>
<a class="button is-outlined is-primary" href="https://nmsgalactichub.miraheze.org/wiki/Special:Upload?multiple=true" id="uploadLink" rel="noopener noreferrer" target="_blank">Upload Pictures</a>
<a class="button is-outlined is-primary" id="create">Create page</a>
<button class="button is-warning" id="reset" type="reset">Reset inputs</button>`;

	const copyNote = `<p class="has-text-centered">You must copy the code first, then paste it into the wiki page. Also don't forget to upload any images you have put here.</p>`;

	actionsOutputs.actions.innerHTML = actions;
	actionsOutputs.actions.insertAdjacentHTML('beforebegin', copyNote);

	const copyButton = document.getElementById('copy');
	copyButton?.addEventListener('click', () => {
		copyCode(copyButton as HTMLElement, 'fullArticle');
	});

	const downloadButton = document.getElementById('download');
	downloadButton?.addEventListener('click', () => {
		downloadFile(downloadButton as HTMLAnchorElement);
	});

	const createButton = document.getElementById('create');
	createButton?.addEventListener('click', () => {
		createPage(createButton as HTMLAnchorElement);
	});

	document.getElementById('reset')?.addEventListener('click', reset);

	const url = window.location;
	if (url.hostname !== '127.0.0.1' && url.protocol !== 'file:') {
		addStaticPageData('debug', false);
		return;
	}

	const skipCheck = `<label style="display:flex; gap: .3rem"><input class="checkbox" type="checkbox" id="skipCheck">Enable debug (no checks, no popups)</label>`;
	actionsOutputs.actions.insertAdjacentHTML('beforeend', skipCheck);
	const skipCheckElement = document.getElementById('skipCheck') as HTMLInputElement | null;
	skipCheckElement!.onchange = (e) => {
		const target = e.target as HTMLInputElement;
		const checkState = target.checked;
		actionsPageData.debug = checkState;
		uploadShown = checkState;
		galleryUploadShown = checkState;
		document.documentElement.dataset.debug = `${checkState}`;
		enableTextMarking();
	};

	const urlParams = new URLSearchParams(url.search);
	if (!urlParams.has('debug') || !skipCheckElement) return;

	skipCheckElement.checked = true;
	const event = new Event('change', {
		bubbles: true,
		cancelable: true,
	});
	skipCheckElement.dispatchEvent(event);
})();

function reset() {
	const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.table .data input, .table .data textarea');
	const selects = document.querySelectorAll<HTMLSelectElement>('.table .data select');
	const outputs = document.getElementsByTagName('output');

	for (const input of inputs) {
		switch (input.type) {
			case 'checkbox':
				(input as HTMLInputElement).checked = false;
				break;
			case 'radio': {
				const uncheckedRadios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([checked])');
				const checkedRadios = document.querySelectorAll<HTMLInputElement>('input[type="radio"][checked]');
				for (const radio of uncheckedRadios) radio.checked = false;
				for (const radio of checkedRadios) radio.checked = true;
				break;
			}
			default:
				input.value = '';
		}
	}

	for (const select of selects) {
		select.value = select.querySelector('option')?.value ?? '';
	}

	for (const output of outputs) {
		output.innerText = '';
	}

	if (typeof resetGallery === 'function') resetGallery();

	for (const key in pageData) {
		delete pageData[key];
	}

	const errors = document.querySelectorAll<HTMLElement>('.error');
	for (const error of errors) {
		const previous = error.previousElementSibling;
		if (previous) {
			errorMessage(previous);
		}
	}

	for (const key in links) {
		delete links[key];
	}

	if (typeof resetExternal === 'function') resetExternal();

	showAll();
}

function copyCode(input: HTMLElement, wikiCodeId: string) {
	input.style.pointerEvents = 'none';
	const buttonText = input.innerText;
	dataIntegrityObj.text = JSON.stringify(pageData);
	dataIntegrityObj.copy = false;
	const dataIntegrity = checkDataIntegrity();
	if (dataIntegrity) {
		input.classList.remove('is-primary');
		input.classList.add('is-danger');
		input.innerText = dataIntegrity;
		setTimeout(() => {
			input.classList.remove('is-danger');
			input.classList.add('is-primary');
			input.innerText = buttonText;
			input.style.pointerEvents = '';
		}, 1500);
		return;
	}

	const outputElement = globalElements.output[wikiCodeId];
	if (!outputElement) return;
	const copyTextContent = outputElement.innerText.replaceAll('\n\n\n', '\n\n');
	navigator.clipboard.writeText(copyTextContent).then(() => {
		dataIntegrityObj.copy = true;
		input.innerText = 'Copied!';
		setTimeout(() => {
			input.innerText = buttonText;
			input.style.pointerEvents = '';
		}, 1500);
	}).catch(() => {
		input.classList.remove('is-primary');
		input.classList.add('is-danger');
		input.innerText = 'Clipboard failed!';
		setTimeout(() => {
			input.classList.remove('is-danger');
			input.classList.add('is-primary');
			input.innerText = buttonText;
			input.style.pointerEvents = '';
		}, 1500);
	});
}

function downloadFile(button: HTMLAnchorElement) {
	const downloadFileContent = actionsOutputs.fullArticle.innerText.replaceAll('\n\n\n', '\n\n');
	const mimeType = 'data:text/plain';
	const name = actionsPageData.name;
	button.href = `${mimeType},${encodeURIComponent(downloadFileContent)}`;
	button.download = `${name}.txt`;
}

const wikiLink = 'https://nmsgalactichub.miraheze.org/wiki/';

function createPage(element: HTMLAnchorElement) {
	element.style.pointerEvents = 'none';
	const name = actionsPageData.name;
	const link = wikiLink + 'Special:EditPage/' + encodeURIComponent(name);
	assignLink(element, link);
}

function assignLink(element: HTMLAnchorElement, link: string) {
	const dataIntegrity = checkDataIntegrity();
	if (!dataIntegrity) {
		element.href = link;
		element.target = '_blank';
		element.rel = 'noopener noreferrer';
		element.style.pointerEvents = '';
	} else {
		const buttonText = element.innerText;
		element.removeAttribute('href');
		element.className = 'button is-danger';
		element.innerText = dataIntegrity;
		setTimeout(() => {
			element.className = 'button is-outlined is-primary';
			element.innerText = buttonText;
			element.style.pointerEvents = '';
		}, 1500);
	}
}
