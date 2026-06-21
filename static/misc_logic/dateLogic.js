"use strict";
function processDate(element) {
    const date = element.value;
    const dest = element.dataset.destNoauto;
    wikiCode(date.replaceAll('-', '/'), dest);
}
function getCurrentYear(outputId) {
    const currentYear = new Date().getFullYear();
    wikiCode(currentYear.toString(), outputId);
}
document.addEventListener('DOMContentLoaded', () => {
    const lastEditedField = document.getElementById('lastEditedInput');
    if (lastEditedField && lastEditedField.value.trim() === '') {
        const today = new Date();
        let formatted = 'YYYY-MM-DD';
        if (!isNaN(today.getTime())) {
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            formatted = `${year}-${month}-${day}`;
        }
        lastEditedField.value = formatted;
        const dest = lastEditedField.dataset.dest;
        if (dest) {
            wikiCode(formatted, dest);
        }
    }
});
