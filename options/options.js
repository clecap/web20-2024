document.addEventListener('DOMContentLoaded', () => {
    // Lade gespeicherte Optionen
    browser.storage.local.get(['endpointUrl', 'apiKey']).then((result) => {
        document.getElementById('endpointUrl').value = result.endpointUrl || '';
        document.getElementById('apiKey').value = result.apiKey || '';
    });

    // Speichere Optionen beim Klick auf den Speichern-Button
    document.getElementById('saveButton').addEventListener('click', () => {
        const endpointUrl = document.getElementById('endpointUrl').value;
        const apiKey = document.getElementById('apiKey').value;

        browser.storage.local.set({
            endpointUrl: endpointUrl,
            apiKey: apiKey
        }).then(() => {
            console.log('Optionen gespeichert');
        });
    });
});