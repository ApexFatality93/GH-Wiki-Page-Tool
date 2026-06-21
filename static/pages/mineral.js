"use strict";
const mineralPageData = pageData;
const mineralInputs = globalElements.input;
const mineralOutputs = globalElements.output;
const mineralPageName = () => {
    const newName = mineralInputs.nameInput.value;
    const orgName = mineralInputs.oldNameInput.value;
    const name = orgName || newName;
    wikiCode(name, 'name');
    return name;
};
window.pageName = mineralPageName;
const mineralResourceHarvest = () => {
    const primaryElement = mineralPageData.element_primary;
    const secondaryElement = mineralPageData.element_secondary;
    let output = '';
    if (primaryElement && secondaryElement) {
        output = `This mineral provides the elements [[${primaryElement}]] and [[${secondaryElement}]] when mined.`;
    }
    else if (primaryElement) {
        output = `This mineral provides the element [[${primaryElement}]] when mined.`;
    }
    mineralOutputs.usage.innerText = output;
};
window.resourceHarvest = mineralResourceHarvest;
const mineralGalleryExplanationExternal = () => {
    return `The preferred order of pictures is as follows:
	<div class='dialog-center'>
		<ol class='dialog-list'>
			<li>Scanner view</li>
			<li>Other image</li>
			<li>Discovery Menu</li>
			<li>Planet Page</li>
			<li>Moon Page</li>
			<li>System Page</li>
			<li>Galaxy Map</li>
		</ol>
	</div>`;
};
window.galleryExplanationExternal = mineralGalleryExplanationExternal;
const mineralStartupFunctions = () => {
    mineralResourceHarvest();
    summaryText();
    hideOrgName();
    mineralPageName();
    planetMoonSentence();
    generateGalleryArray();
};
window.startupFunctions = mineralStartupFunctions;
const mineralElementFunctions = {
    nameInput: ['pageName(); summaryText()'],
    oldNameInput: ['hideOrgName(); pageName(); summaryText()'],
    descriptionInput: ['summaryText()'],
    planetInput: ['planetMoonSentence(); generateGalleryArray()'],
    moonInput: ['planetMoonSentence(); generateGalleryArray()'],
    element_primary_input: ['resourceHarvest()'],
    element_secondary_input: ['resourceHarvest()'],
    addInfoInput: ['addInfoBullet()'],
};
assignElementFunctions(mineralElementFunctions);
function summaryText() {
    const name = mineralPageName();
    const description = mineralPageData.description;
    const output = description
        ? `'''${name}''' is a type of [[mineral]]. It is ${enPrefix(description)} ${description}.`
        : `'''${name}''' is a type of [[mineral]].`;
    mineralOutputs.summaryText.innerText = output;
}
function generateGalleryArray() {
    const array = [
        '',
        'Scanner view',
        'Other image',
        'Discovery Menu',
        'Planet Page',
        'Moon Page',
        'System Page',
        'Galaxy Map',
    ];
    if (!mineralPageData.moon) {
        const index = array.indexOf('Moon Page');
        if (index >= 0)
            array.splice(index, 1);
    }
    mineralPageData.galleryArray = array;
}
