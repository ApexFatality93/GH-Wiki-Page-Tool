"use strict";
const starshipWindow = window;
const starshipPageData = pageData;
const starshipInputs = globalElements.input;
const starshipOutputs = globalElements.output;
const starshipStartupFunctions = () => {
    subtypeDropdown();
    showHideStarshipSelects();
    shipStats();
    calcS();
    introType();
    starshipLoc();
    starshipAddInfo();
    appearanceDropdowns();
    enPrefix(starshipInputs.typeInput.value, 'enPrefix');
};
starshipWindow.startupFunctions = starshipStartupFunctions;
const starshipElementFunctions = {
    nameInput: ['appearanceSentence()'],
    civ: ['loc(); addInfo()', null, true],
    systemInput: ['loc()'],
    planetInput: ['loc()'],
    moonInput: ['loc()'],
    portalglyphsInput: ['loc()', null, true],
    axesInput: ['loc()'],
    typeInput: ['introType(); subtypeDropdown(); showHideStarshipSelects(); shipStats(); appearanceDropdowns(); appearanceSentence(); calcS(); loc(); addInfo(); enPrefix(this.value, "enPrefix")'],
    subtypeInput: ['invDropdown(); calcInv(); appearanceSentence(), loc()'],
    inventoryInput: ['costSlotCalc(); loc()'],
    economyInput: ['calcS()'],
    maneuverBInput: ['numberStats(this, 1)'],
    damageBInput: ['numberStats(this, 1)'],
    shieldBInput: ['numberStats(this, 1)'],
    warpBInput: ['numberStats(this, 1)'],
    researchTeam: ['addInfo()', null, true],
    mainColourInput: ['appearanceSentence()'],
    secColourInput: ['appearanceSentence()'],
    secPartsInput: ['appearanceSentence()'],
    accessoriesInput: ['appearanceSentence()'],
    miscPartsInput: ['appearanceSentence()'],
};
assignElementFunctions(starshipElementFunctions);
function getShipData() {
    const defaultSections = {
        subtypeInput: ['show'],
        exoticInput: ['hide', ''],
        pilotInput: ['hide', ''],
        inventoryInput: ['show'],
        maneuverBInput: ['hide', ''],
        damageBInput: ['hide', ''],
        shieldBInput: ['hide', ''],
        warpBInput: ['hide', ''],
        economyInput: ['show'],
        planetInput: ['hide', ''],
        moonInput: ['hide', ''],
        axesInput: ['hide', ''],
        classInput: ['hide', ''],
    };
    const shipData = {
        Freighter: {
            cost: { Small: '5,000,000 - 23,000,000', Large: '26,150,000 - 178,000,000' },
            slots: { Small: '15-19', Large: '24-34' },
            techslots: { Small: '8-12', Large: '12-20' },
            subtypes: ['Dreadnought', 'Battleship', 'Sentinel', 'Resurgent', 'Imperial', 'Venator', 'Blade', 'Cargo', 'Centrifuge', 'Enterprise', 'Galleon', 'Hammerhead', 'Iris', 'Oculus', 'Revolver'],
            secParts: ['', 'Tower', 'Elevated', 'Spoiler', 'Keiser'],
            accessories: ['', 'Keel', 'Bottom Fin', 'Top Fin', 'W-Wings', 'Wedge', 'Nacelle'],
            miscParts: ['', 'Cargo Boxes', 'Cargo Pods'],
            sections: {
                subtypeInput: ['show'],
                exoticInput: ['hide', ''],
                pilotInput: ['show'],
                inventoryInput: ['hide'],
                maneuverBInput: ['hide', ''],
                damageBInput: ['hide', ''],
                shieldBInput: ['hide', ''],
                warpBInput: ['hide', ''],
                economyInput: ['show'],
                planetInput: ['hide', ''],
                moonInput: ['hide', ''],
                axesInput: ['hide', ''],
            },
        },
        Exotic: {
            cost: { Small: '20,900,000 - 41,000,000' },
            slots: { Small: '24-30' },
            techslots: { Small: '20-28' },
            subtypes: [],
            secParts: ['', 'Small Double Thruster', 'Large Double Thruster', 'Clam Shell Thruster', 'Single Thruster'],
            accessories: ['', 'Side Wings', 'Side Booster', 'V-wing'],
            miscParts: ['', 'Hexagon', 'Acanthus', 'Geometric Plate', 'Circles', 'Sergeant Stripes'],
            sections: {
                subtypeInput: ['hide', ''],
                exoticInput: ['show'],
                pilotInput: ['hide', ''],
                inventoryInput: ['hide', 'Small'],
                maneuverBInput: ['hide', ''],
                damageBInput: ['hide', ''],
                shieldBInput: ['hide', ''],
                warpBInput: ['hide', ''],
                economyInput: ['show'],
                planetInput: ['hide', ''],
                moonInput: ['hide', ''],
                axesInput: ['hide', ''],
            },
        },
        Solar: {
            cost: { Small: '4,000,000 - 14,000,000' },
            slots: { Small: '24-30' },
            techslots: { Small: '13-18' },
            subtypes: ['Falcon', 'Grouper', 'Jackal', 'Marlin', 'Raven', 'Spider'],
            secParts: ['', 'Razor', 'Shielded', 'Double Blade', 'Starburst', 'Talon', 'Grapple'],
            accessories: ['', 'Hex', 'Crescent', 'Rectangle'],
            miscParts: ['', 'Horza', 'Verta', 'Tristar', 'Torpedo', 'Drill'],
            sections: {
                subtypeInput: ['show'],
                exoticInput: ['hide', ''],
                pilotInput: ['hide', ''],
                inventoryInput: ['hide'],
                maneuverBInput: ['hide', ''],
                damageBInput: ['hide', ''],
                shieldBInput: ['hide', ''],
                warpBInput: ['hide', ''],
                economyInput: ['show'],
                planetInput: ['hide', ''],
                moonInput: ['hide', ''],
                axesInput: ['hide', ''],
            },
        },
        Fighter: {
            cost: { Small: '4,050,000 - 15,650,000', Medium: '4,050,000 - 27,650,000', Large: '10,500,000 - 57,500,000' },
            slots: { Small: '24-28', Medium: '24-32', Large: '30-38' },
            techslots: { Small: '14-19', Medium: '14-24', Large: '19-30' },
            subtypes: ['Alpha', 'Barrel', 'Jet', 'Long', 'Needle', 'Rasa', 'Snowspeeder', 'Stubby', 'Viper'],
            secParts: ['', 'Heavy', 'Starjumper', 'Horizon', 'Vector', 'Tie', 'Halo', 'Bowie-H', 'Bowie-V', 'Gull', 'Quasar', 'Vulture', 'Droid', 'Mecha-3', 'Mecha-5', 'Mecha-7', 'E-Wings', 'Aftershock', 'Shockwave', 'Starscream'],
            accessories: ['', 'Box Thruster', 'Single Thruster', 'Triple Thruster'],
            miscParts: ['', 'Serenity', 'Firefly'],
            sections: defaultSections,
        },
        Explorer: {
            cost: { Small: '3,450,000 - 11,900,000', Medium: '3,450,000 - 18,300,000', Large: '9,200,000 - 39,000,000' },
            slots: { Small: '24-29', Medium: '24-32', Large: '30-38' },
            techslots: { Small: '14-19', Medium: '19-24', Large: '24-30' },
            subtypes: ['Hopper', 'Firespray'],
            secParts: ['', 'Curved Cockpit', 'Bubble Cockpit'],
            accessories: ['', 'Ajairu', 'Arc', 'Chick', 'Curved-Tie', 'Dagger', 'Dragonfly', 'Glider', 'Lance', 'No Wings', 'Nucleo', 'Proteus', 'Solar Fins', 'Solar Pods', 'Solar Tie', 'T3 Pods', 'Wraith', 'Xenia', 'Xtara', 'X-Wing'],
            miscParts: [],
            sections: defaultSections,
        },
        Hauler: {
            cost: { Small: '9,700,000 - 37,500,000', Medium: '20,850,000 - 58,500,000', Large: '32,500,000 - 126,000,000' },
            slots: { Small: '30-36', Medium: '36-40', Large: '40-48' },
            techslots: { Small: '12-18', Medium: '18-24', Large: '20-30' },
            subtypes: {
                Aftershock: ['Small'], Ball: ['Small', 'Large'], 'Body only': ['Small'], Box: ['Small', 'Large'], 'C-Wing': ['Small'],
                'Bent Wing': ['Small'], 'D-Flect Wing': ['Medium'], 'E-Wing': ['Small'], 'Fan Wing': ['Large'], 'V-Wing': ['Small'],
                'Thrusters only': ['Small'], 'W-Wing': ['Medium'], Shield: ['Small'], 'Tie-Shield': ['Small'], 'Split Shield': ['Small'],
            },
            secParts: ['', 'Mack', 'Duck', 'Robot', 'Turret', 'Box Nose'],
            accessories: ['', 'Short Tail', 'Long Tail', 'Box Tail'],
            miscParts: ['', 'High Wings', 'Serenity', '2rpedo', 'Sabre', 'V-Blade', 'Tilt'],
            sections: defaultSections,
        },
        Shuttle: {
            cost: { Small: '2,070,000 - 12,650,000', Medium: '4,400,000 - 22,500,000' },
            slots: { Small: '24-32', Medium: '28-36' },
            techslots: { Small: '12-19', Medium: '18-26' },
            subtypes: ['Single Tube', 'Small Box Body', 'Double Tube', 'Large Box Body'],
            secParts: ['', 'Voyager', 'Grill Wings', 'Y-Wings', 'Bent Wings', 'Drop-Wings', 'X-Wings', 'Low Wings', 'Glider', 'V-Wings'],
            accessories: ['', 'Straight Turbine', 'Tapered Turbine', 'Omega Cap', 'Retro Booster', 'Fatboy', 'Magnatreme Adapter', 'Afterburner', 'Hover Fan', 'Magnatreme Dome', 'Magnatreme Ring', 'Magnatreme Shield', 'Wing Turbine'],
            miscParts: ['', 'Micro Thruster', 'Vertical Intake', 'Solar Panel', 'Keg', 'Mr. Fusion', 'R2 Unit', 'Fuel Port', 'Antenna', 'Lunch Box', 'Cargo Vent', 'Cooling Channel', 'Exhaust Cooling Channel', 'Angled Vent', 'Fuel Compressor', 'Coolant Ports'],
            sections: {
                subtypeInput: ['show'],
                exoticInput: ['hide', ''],
                pilotInput: ['hide', ''],
                inventoryInput: ['hide'],
                maneuverBInput: ['hide', ''],
                damageBInput: ['hide', ''],
                shieldBInput: ['hide', ''],
                warpBInput: ['hide', ''],
                economyInput: ['show'],
                planetInput: ['hide', ''],
                moonInput: ['hide', ''],
                axesInput: ['hide', ''],
            },
        },
        'Living Ship': {
            cost: { Medium: '21,850,000' },
            slots: { Medium: '36' },
            techslots: { Medium: '30' },
            subtypes: ['Anvil', 'Hammerhead', 'Shark', 'Tusked', 'Compact'],
            secParts: ['', 'Long Arm', 'Short Arm'],
            accessories: ['', 'Bigfoot', 'Fruitbowl Feet', 'Pedestal Feet'],
            miscParts: ['', 'Single Thruster', 'Triple Thruster'],
            sections: {
                subtypeInput: ['show'],
                exoticInput: ['hide', ''],
                pilotInput: ['hide', ''],
                inventoryInput: ['hide', 'Medium'],
                maneuverBInput: ['show'],
                damageBInput: ['show'],
                shieldBInput: ['show'],
                warpBInput: ['show'],
                economyInput: ['hide', ''],
                planetInput: ['show'],
                moonInput: ['show'],
                axesInput: ['show'],
            },
        },
        Derelict: {
            cost: { '': '' },
            slots: { '': '' },
            techslots: { '': '' },
            subtypes: [''],
            secParts: [''],
            accessories: [''],
            miscParts: [''],
            sections: {
                subtypeInput: ['hide'],
                exoticInput: ['hide', ''],
                pilotInput: ['hide', ''],
                inventoryInput: ['hide', ''],
                maneuverBInput: ['hide', ''],
                damageBInput: ['hide', ''],
                shieldBInput: ['hide', ''],
                warpBInput: ['hide', ''],
                economyInput: ['show'],
                planetInput: ['hide', ''],
                moonInput: ['hide', ''],
                axesInput: ['hide', ''],
                classInput: ['show'],
            },
        },
        Interceptor: {
            cost: { Large: '' },
            slots: { Large: '32-40' },
            techslots: { Large: '22-28' },
            subtypes: [],
            secParts: [],
            accessories: [],
            miscParts: [],
            sections: {
                subtypeInput: ['hide'],
                exoticInput: ['hide', ''],
                pilotInput: ['hide', ''],
                inventoryInput: ['hide', 'Large'],
                classInput: ['show'],
                maneuverBInput: ['show'],
                damageBInput: ['show'],
                shieldBInput: ['show'],
                warpBInput: ['show'],
                economyInput: ['show'],
                planetInput: ['show'],
                moonInput: ['show'],
                axesInput: ['show'],
            },
        },
    };
    shipData.Explorer.miscParts = structuredClone(shipData.Explorer.accessories);
    shipData.Explorer.miscParts.push('Antenna', 'Spike', 'Dish', 'Sensor');
    return shipData;
}
function subtypeDropdown() {
    const type = starshipPageData.type;
    const subtype = starshipInputs.subtypeInput;
    const shipData = getShipData();
    const subtypeData = shipData[type].subtypes;
    if (Array.isArray(subtypeData)) {
        setDropdownOptions(subtype, subtypeData);
    }
    else {
        setDropdownOptions(subtype, Object.keys(subtypeData));
    }
    wikiCode(subtype);
}
function calcS() {
    const econ = starshipPageData.economy.split(' ');
    const type = starshipPageData.type;
    let chance = '';
    let chanceSentence = 'always spawns';
    if (type !== 'Exotic' && type !== 'Living Ship') {
        switch (econ[0]) {
            case '★★★':
                chance = '2%';
                break;
            case '★★':
                chance = '1%';
                break;
            case '★':
                chance = '0%';
                break;
            default:
                chance = '5%';
        }
        chanceSentence = `has a ${chance} chance to spawn`;
    }
    starshipOutputs.sChance.innerText = chanceSentence;
}
function shipStats() {
    const type = starshipPageData.type.split(' ')[0];
    starshipOutputs.stats.innerText = type + 'Ship';
}
function showHideStarshipSelects() {
    const shipData = getShipData();
    const showState = { show: '', hide: 'none' };
    const type = starshipPageData.type;
    invDropdown();
    for (const input of Object.keys(shipData[type].sections)) {
        const data = shipData[type].sections[input];
        const inputElement = globalElements.input[input];
        hideInput(inputElement, showState[data[0]]);
        if (data.length > 1) {
            inputElement.value = data[1];
        }
        else if (inputElement.tagName.toLowerCase() === 'select') {
            inputElement.value ||= inputElement.querySelector('option')?.value ?? '';
        }
        wikiCode(inputElement);
    }
    calcInv();
}
function invDropdown() {
    const type = starshipPageData.type;
    const subtype = starshipPageData.subtype;
    const inventory = starshipInputs.inventoryInput;
    const shipData = getShipData();
    if (type === 'Hauler') {
        setDropdownOptions(inventory, shipData.Hauler.subtypes[subtype]);
        if (shipData.Hauler.subtypes[subtype].length === 1) {
            inventory.value = shipData.Hauler.subtypes[subtype][0];
            hideInput(inventory, 'none');
        }
        else {
            hideInput(inventory, '');
        }
    }
    else {
        setDropdownOptions(inventory, ['Small', 'Medium', 'Large']);
    }
    wikiCode(inventory);
}
function calcInv() {
    const type = starshipPageData.type;
    const subtype = starshipPageData.subtype;
    const inventoryElement = starshipInputs.inventoryInput;
    const shipData = getShipData();
    let inventory = '';
    switch (type) {
        case 'Freighter':
            inventory = shipData[type].subtypes.indexOf(subtype) > 5 ? 'Small' : 'Large';
            break;
        case 'Shuttle':
            inventory = shipData[type].subtypes.indexOf(subtype) > 1 ? 'Medium' : 'Small';
            break;
    }
    if (inventory)
        inventoryElement.value = inventory;
    wikiCode(inventoryElement);
    costSlotCalc();
}
function costSlotCalc() {
    const type = starshipPageData.type;
    const inventory = starshipPageData.inventory;
    const shipData = getShipData();
    starshipOutputs.cost.innerText = shipData[type].cost[inventory];
    starshipOutputs.slots.innerText = shipData[type].slots[inventory];
    starshipOutputs.techslots.innerText = shipData[type].techslots[inventory];
}
function introType() {
    wikiCode(shipType(), 'archetype');
}
function shipType() {
    if (starshipPageData.type === 'Freighter')
        return 'freighter';
    if (starshipPageData.type === 'Derelict')
        return 'derelict';
    return 'starship';
}
function starshipLoc() {
    const systemName = starshipPageData.system;
    const regionName = starshipPageData.region;
    const civ = starshipPageData.civShort;
    const type = starshipPageData.type;
    const shipClass = starshipPageData.class;
    let output = `This ${shipType()} was discovered in the [[${systemName}]] [[star system]] in the [[${regionName}]] [[region]]${regNr(regionName)} of the ${HubGal(civ)}.

	It can be found ${locText()}.`;
    if (type === 'Interceptor') {
        output = `This ${shipType()} was discovered in the [[${systemName}]] [[star system]] in the [[${regionName}]] [[region]]${regNr(regionName)} of the ${HubGal(civ)}.

		The {{Class|${shipClass}}} class version of this starship can be found ${locText()}.`;
    }
    starshipOutputs.location.innerText = output;
    function capitalDetection() {
        const inventory = starshipPageData.inventory;
        if (inventory === 'Large')
            return 'Capital';
    }
    function freighterSpawn() {
        return capitalDetection() === 'Capital'
            ? 'after warping into the star system if a space battle is triggered'
            : 'randomly while pulsing around in the star system';
    }
    function livingShipSpawn() {
        const axes = starshipPageData.axes;
        const celestialBody = planetMoonSentence();
        return `on the ${celestialBody} at the coordinates ${axes}`;
    }
    function derelictSpawn() {
        return 'after activating an [[Emergency Signal Scanner]] and pulsing around in the star system.';
    }
    function locText() {
        switch (type) {
            case 'Freighter':
                return freighterSpawn();
            case 'Derelict':
                return derelictSpawn();
            case 'Interceptor':
            case 'Living Ship':
                return livingShipSpawn();
            default:
                return 'at either the [[Space Station]] or any [[Trade Outpost]]s available in the star system';
        }
    }
}
function starshipAddInfo() {
    let catalog = '';
    const type = starshipPageData.type;
    const galaxy = starshipPageData.galaxy;
    if (type === 'Freighter') {
        catalog = `Freighter Album (${galaxy})`;
    }
    else if (type === 'Derelict') {
        catalog = `Derelict Album (${galaxy})`;
    }
    else {
        catalog = `Starship Album (${galaxy})`;
    }
    starshipOutputs.addInfo.innerText = `[[${catalog}]].`;
}
function appearanceDropdowns() {
    const type = starshipInputs.typeInput.value;
    const secParts = starshipInputs.secPartsInput;
    const accessories = starshipInputs.accessoriesInput;
    const miscParts = starshipInputs.miscPartsInput;
    const shipData = getShipData();
    setDropdownOptions(secParts, shipData[type].secParts);
    setDropdownOptions(accessories, shipData[type].accessories);
    setDropdownOptions(miscParts, shipData[type].miscParts);
}
function appearanceSentence() {
    const mainColour = starshipInputs.mainColourInput.value;
    const secColour = starshipInputs.secColourInput.value;
    const secParts = starshipInputs.secPartsInput.value;
    const accessories = starshipInputs.accessoriesInput.value;
    const miscParts = starshipInputs.miscPartsInput.value;
    if (!(mainColour.trim() || secColour.trim() || secParts || accessories || miscParts))
        return;
    const name = starshipPageData.name;
    const type = starshipPageData.type;
    const subtype = starshipPageData.subtype;
    const exotic = starshipPageData.exotic;
    const textarea = starshipInputs.appearanceInput;
    const accentColour = secColour.trim() ? ` with ${secColour} accents` : '';
    const addParts = (() => {
        let partList = '';
        if (secParts || accessories || miscParts)
            partList += 'It features ';
        const partArray = [secParts.toLowerCase(), accessories.toLowerCase(), miscParts.toLowerCase()];
        const usedParts = [];
        for (const part of partArray) {
            if (part)
                usedParts.push(part);
        }
        for (let i = 0; i < usedParts.length; i++) {
            let prefix = '';
            if (i !== 0 && i !== usedParts.length - 1)
                prefix = ', ';
            else if (i === usedParts.length - 1)
                prefix = ' and ';
            partList += prefix + usedParts[i];
        }
        if (partList)
            partList += '.';
        return partList;
    })();
    const primaryColour = mainColour.trim() ? `${enPrefix(mainColour)} ${mainColour}` : enPrefix(type);
    textarea.value = `${name} is ${primaryColour} ${type.toLowerCase()} of the ${subtype.toLowerCase() || exotic.toLowerCase()} subtype${accentColour}. ${addParts}`;
    wikiCode(textarea);
}
const starshipGenerateGalleryArray = () => {
    const array = [
        '',
        'Rear view of ship',
        'Rear view of freighter',
        'Inventory screen',
        'NPC freighter captain',
        'NPC ship pilot',
        'Analysis Visor Scan',
        'Crash site',
        'Moon Page',
        'Planet Page',
        'System Page',
        'Galaxy Map',
    ];
    const common = ['moon', 'planet', 'crash'];
    const deactivate = {
        'Living Ship': ['npc', 'freighter'],
        Interceptor: ['npc', 'freighter'],
        Freighter: ['ship', ...common],
        default: ['freighter', ...common],
    };
    if (!starshipPageData.moon) {
        const index = array.findIndex(item => item.toLowerCase().includes('moon'));
        array.splice(index, 1);
    }
    const type = starshipPageData.type;
    const lowerCase = structuredClone(array).map(item => item.toLowerCase());
    for (let i = array.length - 1; i >= 0; i--) {
        const element = lowerCase[i];
        for (const word of deactivate[type] ?? deactivate.default) {
            if (element.includes(word))
                array.splice(i, 1);
        }
    }
    starshipPageData.galleryArray = array;
};
starshipWindow.generateGalleryArray = starshipGenerateGalleryArray;
const starshipGalleryExplanationExternal = () => {
    return `There is a preferred order of gallery pictures, depending on ship type:
	<div class='dialog-center is-flex-wrap-wrap mt-2' style='gap: 1rem'>
		<div>
			<div class='has-text-weight-bold'>Normal Ships:</div>
			<ol class='dialog-list mt-1'>
				<li>Rear view of ship</li>
				<li>Inventory screen</li>
				<li>NPC Ship Pilot</li>
				<li>Analysis Visor Scan</li>
				<li>System Page</li>
			</ol>
		</div>
		<div>
			<div class='has-text-weight-bold'>Living Ships/Interceptors:</div>
			<ol class='dialog-list mt-1'>
				<li>Rear view of ship</li>
				<li>Inventory screen</li>
				<li>Analysis Visor Scan</li>
				<li>Crash site</li>
				<li>Planet/Moon Page</li>
				<li>System Page</li>
			</ol>
		</div>
		<div>
			<div class='has-text-weight-bold'>Freighters:</div>
			<ol class='dialog-list mt-1'>
				<li>Rear view of freighter</li>
				<li>Inventory screen</li>
				<li>NPC freighter captain</li>
				<li>Analysis Visor Scan</li>
				<li>System Page</li>
			</ol>
		</div>
	</div>`;
};
starshipWindow.galleryExplanationExternal = starshipGalleryExplanationExternal;
