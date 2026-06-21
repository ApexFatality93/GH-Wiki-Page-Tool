type GalleryPageData = SharedPageData & {
	galleryArray?: string[];
};

type GalleryInputs = SharedGlobalInputs & {
	galleryUpload: HTMLInputElement;
};

type GalleryOutputs = SharedGlobalOutputs & {
	galleryItems: HTMLElement;
	galleryCode: HTMLElement;
};

const galleryPageData = pageData as GalleryPageData;
const galleryInputs = globalElements.input as GalleryInputs;
const galleryOutputs = globalElements.output as GalleryOutputs;

(() => {
	if (window.matchMedia('(pointer: coarse)').matches) return;
	const script = document.createElement('script');
	script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js';
	document.head.appendChild(script);
	script.onload = () => {
		const galleryWrapper = galleryOutputs.galleryItems;
		const gallerySort = new Sortable(galleryWrapper, {
			handle: '.handle',	// handle's class
			animation: 250,
			onUpdate: function (evt: { oldIndex: number; newIndex: number }) { moveItem(evt) },
		});
	}
})();

var galleryUploadShown = false;
// handles gallery images
function galleryUpload() {
	const inp = galleryInputs.galleryUpload;
	if (!inp.value) return;
	const files = inp.files;
	if (!files) return;
	const inputDiv = galleryOutputs.galleryItems;
	const wikiCodeGalleryDiv = galleryOutputs.galleryCode;
	const errors = new Array;
	for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
		const file = files[fileIndex];
		const name = file.name;
		if (file.size > 10000000) {
			errors.push(name);
			continue;
		}
		const imgUrlData = URL.createObjectURL(file);
		const childtree = inputDiv.children;
		const childIndex = getChildIndex(childtree, 'id');
		const inputId = 'pic' + childIndex;
		const dropdownId = 'dropdown' + childIndex;
		const galleryId = 'gallery' + childIndex;
		const wikiCodeGalleryId = 'wikiCodeGallery' + childIndex;
		const wikiCodeGalleryValueId = 'wikiCodeGalleryValue' + childIndex;

		const nameElement = (() => {
			const p = document.createElement('p');
			const span = document.createElement('span');
			p.innerText = name;
			span.classList.add('has-text-weight-bold');
			span.innerText = 'Name: ';
			p.insertAdjacentElement('afterbegin', span);
			return p.outerHTML;
		})();

		const galleryTemplate = `
		<div id="${galleryId}" class="gallery-item">
			<a class="gallery-media" href=${imgUrlData} target="_blank" rel="noopener noreferrer">
				<img src="${imgUrlData}">
			</a>
			<div class="gallery-meta">
				${nameElement}
				<div><select id="${dropdownId}" data-gallery-target="${inputId}" data-gallery-code="${wikiCodeGalleryValueId}"></select></div>
				<div><input id="${inputId}" type="text" placeholder="Description" data-gallery-code="${wikiCodeGalleryValueId}" /></div>
			</div>
			<div class="controlButtons">
				<span class="delete-icon is-clickable" title="Remove picture from gallery" data-gallery-remove="${wikiCodeGalleryId}">&#10060</span>
					<img class="handle" src="../assets/vector/arrow.svg" title="Move picture up or down">
				<button class="button moveButton" title="Move up" data-gallery-code-id="${wikiCodeGalleryId}" data-gallery-direction="up">
					<svg width="36" height="36"><path d="M2 25h32L18 9 2 25Z"></path></svg>
				</button>
				<button class="button moveButton" title="Move down" data-gallery-code-id="${wikiCodeGalleryId}" data-gallery-direction="down">
					<svg width="36" height="36"><path d="M2 11h32L18 27 2 11Z"></path></svg>
				</button>
			</div>
		</div>`;

		inputDiv.insertAdjacentHTML('afterbegin', galleryTemplate);

		const wikiCodeGalleryTemplate = `<div id="${wikiCodeGalleryId}">
			<span>${name}</span><output id="${wikiCodeGalleryValueId}"></output>
		</div>`;

		wikiCodeGalleryDiv.insertAdjacentHTML('afterbegin', wikiCodeGalleryTemplate);

		const galleryElement = document.getElementById(dropdownId) as HTMLSelectElement | null;
		if (!galleryElement) continue;
		galleryElement.addEventListener('change', function () {
			galleryDesc(this, this.dataset.galleryTarget ?? '', this.dataset.galleryCode ?? '');
		});
		document.getElementById(inputId)?.addEventListener('input', function () {
			galleryInput(this as HTMLInputElement, (this as HTMLInputElement).dataset.galleryCode ?? '');
		});

		if (typeof generateGalleryArray == 'function') generateGalleryArray();

		const galleryArray = galleryPageData.galleryArray;
		if (galleryArray) {
			setDropdownOptions(galleryElement, galleryArray);
		} else {
			if (galleryElement.parentElement) {
				galleryElement.parentElement.style.display = 'none';
			}
		}
	}
	if (errors.length) {
		errorMessage(inp, `The following files exceed the 10MB upload limit and couldn't be added: ${errors.join(', ')}`)
	} else {
		errorMessage(inp);
	}
	inp.value = '';

	if (galleryUploadShown) return;
	// the galleryExplanationExternal() function should return string with the popup text. HTML is supported.
	if (typeof galleryExplanationExternal == 'function') {
		explanation('Gallery',
			`${galleryExplanationExternal()}
		<div class="mt-3"><span class="has-text-weight-bold">NOTE</span>: You can access this popup at any time by clicking on the "?" next to the gallery upload button.</div>`);
	}
	galleryUploadShown = true;
}

// takes description from gallery dropdown into input field
function galleryDesc(dropdownElement: HTMLSelectElement, inputId: string, codeId: string) {
	const dropdown = dropdownElement.value;
	const input = document.getElementById(inputId) as HTMLInputElement | null;
	if (!input) return;
	input.value = dropdown;
	galleryInput(input, codeId);
}

// adds or removes descriptions from the gallery
function galleryInput(input: HTMLInputElement, galleryId: string) {
	const desc = sanitiseString(input.value);
	const galleryOutput = document.getElementById(galleryId);
	if (!galleryOutput) return;
	galleryOutput.innerText = desc ? `|${desc}` : '';
}

// removes gallery row if X is clicked
function rmGallery(galleryNode: HTMLElement, wikiCodeGalleryId: string) {
	const wikiCodeGalleryNode = document.getElementById(wikiCodeGalleryId);
	if (!wikiCodeGalleryNode) return;
	wikiCodeGalleryNode.remove();
	galleryNode.closest('.gallery-item')?.remove();
}

// moves item in gallery and gallery wikicode up or down depending on dragging direction
function moveItem(evt: { oldIndex: number; newIndex: number }) {
	const oldIndex = evt.oldIndex;
	const newIndex = evt.newIndex;
	const galleryCode = document.getElementById('galleryCode');
	if (!galleryCode) return;
	const galleryItems = Array.from(galleryCode.children);
	const extractedItem = galleryItems.splice(oldIndex, 1);
	galleryItems.splice(newIndex, 0, extractedItem[0])
	const HTML = new Array;
	for (const item of galleryItems) {
		const code = item.outerHTML;
		HTML.push(code);
	}
	galleryCode.innerHTML = HTML.join('')
}

// moves item in gallery and gallery wikicode up or down depending on user input
function mobileMoveItem(element: HTMLElement, codeId: string, direction: string) {
	const galleryItem = element.closest('.gallery-item')
	const galleryCodeItem = document.getElementById(codeId);
	if (!galleryItem || !galleryCodeItem) return;
	const elements = [galleryItem, galleryCodeItem];
	for (const element of elements) {
		const wrapper = element.parentNode;
		if (!wrapper) continue;

		if (direction == 'up' && element.previousElementSibling) {
			wrapper.insertBefore(element, element.previousElementSibling);
		} else if (direction == 'down' && element.nextElementSibling) {
			wrapper.insertBefore(element, element.nextElementSibling.nextElementSibling);
		}
	}
}

function resetGallery() {
	galleryOutputs.galleryItems.innerHTML = '';
}

galleryOutputs.galleryItems?.addEventListener('click', (event: Event) => {
	const target = event.target as HTMLElement | null;
	const removeTrigger = target?.closest('[data-gallery-remove]') as HTMLElement | null;
	if (removeTrigger) {
		rmGallery(removeTrigger, removeTrigger.dataset.galleryRemove ?? '');
		return;
	}

	const moveTrigger = target?.closest('[data-gallery-direction]') as HTMLElement | null;
	if (!moveTrigger) return;
	mobileMoveItem(moveTrigger, moveTrigger.dataset.galleryCodeId ?? '', moveTrigger.dataset.galleryDirection ?? '');
});
