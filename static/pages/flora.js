"use strict";
const floraPageData = pageData;
const floraOutputs = globalElements.output;
const floraResourceHarvest = () => {
    const primaryElement = floraPageData.element_primary;
    const secondaryElement = floraPageData.element_secondary;
    const output = secondaryElement
        ? `This flora provides the resources of [[${primaryElement}]] and [[${secondaryElement}]] when harvested.`
        : `This flora provides the resource [[${primaryElement}]] when harvested.`;
    floraOutputs.usage.innerText = output;
};
window.resourceHarvest = floraResourceHarvest;
const floraStartupFunctions = () => {
    floraResourceHarvest();
    hideOrgName();
    pageName();
    bundlePropFunctions();
    planetMoonSentence();
    noLineBreak();
};
window.startupFunctions = floraStartupFunctions;
const floraElementFunctions = {
    planetInput: ['planetMoonSentence()'],
    moonInput: ['planetMoonSentence()'],
    element_primary_input: ['resourceHarvest()'],
    element_secondary_input: ['resourceHarvest()'],
};
assignElementFunctions(floraElementFunctions);
