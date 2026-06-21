type BaseInputs = SharedGlobalInputs & {
	censusDiscordInput: HTMLInputElement;
	censusRedditInput: HTMLInputElement;
	censusFriendInput: HTMLInputElement;
	censusPlayerInput: HTMLInputElement;
	censusShowInput: HTMLInputElement;
};

const baseInputs = globalElements.input as BaseInputs;

const baseElementFunctions = {
	planetInput: ['planetMoonSentence()'],
	moonInput: ['planetMoonSentence()'],
	censusRedditInput: ['validateReddit()'],
	censusFriendInput: ['capitaliseFriendCode()'],
	censusPlayerInput: ['createCensusEntry()'],
	builderInput: ['hideDiscoverer("builderInput", "builderlinkInput"); docBy()'],
	builderlinkInput: ['hideDiscoverer("builderlinkInput", "builderInput"); docBy()'],
	addInfoInput: ['addInfoBullet()'],
};
assignElementFunctions(baseElementFunctions);

const baseStartupFunctions = () => {
	getCurrentYear('censusrenewal');
};
(window as typeof window & { startupFunctions?: () => void }).startupFunctions = baseStartupFunctions;

baseInputs.censusDiscordInput.onchange = () => {
	const element = baseInputs.censusDiscordInput;
	const tag = element.value;
	if (tag === '') {
		errorMessage(element);
		return;
	}
	const discriminator = tag.substring(tag.length - 5);
	const hashtag = discriminator.substring(0, 1);
	const numeric = discriminator.substring(1);
	if (hashtag === '#' && /^\d+$/.test(numeric)) {
		if (tag.substring(tag.length - 6, tag.length - 5) === ' ') {
			errorMessage(element, 'There is a space between the name and the #xxxx. Ignore this message if this is correct.');
		} else {
			errorMessage(element);
		}
	} else {
		errorMessage(element, 'Include #xxxx at the end if applicable. Ignore this message if this is correct.');
	}
};

function validateReddit() {
	const element = baseInputs.censusRedditInput;
	const value = element.value.trim();
	const redditName = value.toLowerCase().startsWith('u/') ? value.substring(2) : value;
	if (redditName.includes(' ')) {
		errorMessage(element, 'Reddit name must not include spaces');
		return;
	}
	errorMessage(element);
	const dest = element.dataset.destNoauto;
	wikiCode(redditName, dest);
}

function capitaliseFriendCode() {
	const element = baseInputs.censusFriendInput;
	element.value = element.value.toUpperCase();
	const dest = element.dataset.destNoauto;
	wikiCode(element, dest);
}

baseInputs.censusFriendInput.onchange = () => {
	const element = baseInputs.censusFriendInput;
	const friendCode = element.value;
	const friendCodeRegex = new RegExp(/(?:[0-9A-Za-z]{4}-){2}[0-9A-Za-z]{5}/);
	if (!friendCode || regexMatch(friendCode, friendCodeRegex)) {
		errorMessage(element);
	} else {
		errorMessage(element, 'Wrong friend code format');
	}
};

function createCensusEntry() {
	const input = baseInputs.censusPlayerInput;
	const inputBool = Boolean(input.value);
	const checkbox = baseInputs.censusShowInput;
	if (checkbox.checked === inputBool) return;
	checkbox.checked = inputBool;
	checkboxWikiCode(checkbox);
}
