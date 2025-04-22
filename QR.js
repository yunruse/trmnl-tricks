// Adapted, with thanks, from this recipe: https://usetrmnl.com/recipes/14428/install

Array.from(document.querySelectorAll('[data-qr-mode]')).forEach(element => {
    const attr = t => element.getAttribute(`data-${t}`);

    let size = parseInt(attr('qr-size'));
    if (isNaN(size)) {
        size = 250;
        // TODO: Determine *ratio* instead (pixel size) for nice legible unmangled e-ink QRs
    }

    let text;
    switch (attr('qr-mode')) {
        case 'wifi':
            text = `WIFI:S:${attr('wifi-ssid')};`
                + `T:${attr('wifi-encryption') || 'WPA'};`
                + `P:${attr('wifi-password')};`
                + (attr('wifi-hidden') ? 'H:true;' : '')
                + `;`
            break;
        case 'sms':
            let sM = attr('sms-message');
            text = `sms:${attr('sms-number')}${sM ? ('?body='+encodeURI(sM)) : ''}`
            break;
        // TODO: `geo`
        default:
            text = element.innerText;
            break;
    }
    element.innerText = "";

    const qrErrCorr = { L: 1, M: 0, Q: 3, H: 2 };
    let correctLevel = qrErrCorr[attr('qr-correction')] || qrErrCorr.L;

    if (text) {
        new QRCode(element, {
            text,
            width: size,
            height: size,
            correctLevel,
            colorDark: attr('qr-color-dark') || '#000000',
            colorLight: attr('qr-color-dark') || '#ffffff',
        });
    }
});