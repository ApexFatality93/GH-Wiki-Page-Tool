"use strict";
const albumWindow = window;
function getAlbumPageData() {
    return pageData;
}
function getAlbumOutputs() {
    return globalElements.output;
}
const albumElements = {
    output: {
        albumCiv: 'albumCiv',
        album: 'album',
        albumType: 'albumType',
        albumHeaderName: 'albumHeaderName',
        albumImage: 'albumImage',
        albumName: 'albumName',
        albumOther: 'albumOther',
        albumGlyphs: 'albumGlyphs',
        albumDiscoverer: 'albumDiscoverer',
        albumText: 'albumText',
        albumDesc: 'albumDesc',
    },
};
(() => {
    const wikitext = `<h3 class="title is-5 has-text-left has-text-weight-bold mb-2"><output id="albumCiv"></output>
<output id="album" name="type"></output> <output id="albumType"></output> entry for <output id='albumHeaderName' name="name"></output>:
</h3>
<div id="albumText" class="wikiText">
| {{album| file=<output name="image" id="albumImage"></output> | name=[[<output id="albumName"></output>]]
| other=<output id="albumOther"></output> | glyph=<output id='albumGlyphs' name="portalglyphs"></output> |
<output id="albumDiscoverer"></output>}} <output id="albumDesc"></output>
</div>`;
    const actions = `<button id="albumBtn" class="button is-outlined is-primary">
Copy album wikicode
</button>
<a class="button is-outlined is-primary" id="albumLink">
Open Album
</a>`;
    const albumOutputs = getAlbumOutputs();
    if (!albumOutputs.albumEntry || !albumOutputs.albumActions)
        return;
    albumOutputs.albumEntry.innerHTML = wikitext;
    albumOutputs.albumActions.innerHTML = actions;
    updateGlobalElements(albumElements);
    document.getElementById('albumBtn')?.addEventListener('click', function () {
        copyCode(this, 'albumText');
    });
    document.getElementById('albumLink')?.addEventListener('click', function () {
        albumLink(this);
    });
})();
const albumElementFunctions = {
    civ: ['albumCiv()', null, true],
};
assignElementFunctions(albumElementFunctions);
function albumLink(element) {
    element.style.pointerEvents = 'none';
    if (typeof albumWindow.albumLinkGen !== 'function') {
        element.style.pointerEvents = '';
        return;
    }
    const link = albumWindow.albumLinkGen();
    assignLink(element, link);
}
function albumItemType() {
    const output = typeof albumWindow.albumItemTypeExternal === 'function'
        ? albumWindow.albumItemTypeExternal()
        : getAlbumPageData().type;
    albumElements.output.album.innerText = output;
}
function albumDesc() {
    const output = typeof albumWindow.albumDescExternal === 'function'
        ? albumWindow.albumDescExternal()
        : '';
    albumElements.output.albumDesc.innerText = output;
}
function albumDiscoverer() {
    const output = typeof albumWindow.albumDiscovererExternal === 'function'
        ? albumWindow.albumDiscovererExternal()
        : (() => {
            const { discovered, discoveredlink } = getAlbumPageData();
            return discoveredlink !== '' ? `wiki=${discoveredlink}` : `discoverer=${discovered}`;
        })();
    albumElements.output.albumDiscoverer.innerText = output;
}
function albumCiv() {
    const output = typeof albumWindow.albumCivExternal === 'function'
        ? albumWindow.albumCivExternal()
        : getAlbumPageData().civShort;
    albumElements.output.albumCiv.innerText = output;
}
function albumName() {
    const output = typeof albumWindow.albumNameExternal === 'function'
        ? albumWindow.albumNameExternal()
        : getAlbumPageData().name;
    albumElements.output.albumName.innerText = output;
}
function albumOther() {
    const output = typeof albumWindow.albumOtherExternal === 'function'
        ? albumWindow.albumOtherExternal()
        : '';
    const albumOutputs = getAlbumOutputs();
    if (albumOutputs.albumOther) {
        albumOutputs.albumOther.innerText = output;
    }
}
function albumType() {
    const output = typeof albumWindow.albumTypeExternal === 'function'
        ? albumWindow.albumTypeExternal()
        : '';
    albumElements.output.albumType.innerText = output;
}
function albumFunctions() {
    albumCiv();
    albumDiscoverer();
    albumName();
    albumOther();
    albumType();
    albumItemType();
    albumDesc();
}
