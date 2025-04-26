
// Adapted from this recipe: https://usetrmnl.com/recipes/14428/install

Array.from(document.querySelectorAll('qr')).forEach(element => {
    const $ = t => element.getAttribute(`qr-${t}`);

    let mode = $('qr-mode')
    if (!mode) {
        if ($('email-address')) mode = 'email';
        if ($('telephone')) mode = 'tel';
        if ($('sms-number')) mode = 'sms';
        if ($('wifi-ssid')) mode = 'wifi';
        if ($('apple-shortcut')) mode = 'apple-shortcut';
    }


    let text;
    switch (mode) {
        case 'email':
            text = `mailto:${$('email-address')}`;
            break;
        case 'tel':
            text = `tel:${$('telephone')}`;
            break;
        case 'sms':
            let sM = $('sms-message');
            text = `sms:${$('sms-number')}${sM ? ('?body=' + encodeURI(sM)) : ''}`
            break;
        case 'wifi':
            text = `WIFI:S:${$('wifi-ssid')};`
                + `T:${$('wifi-encryption') || 'WPA'};`
                + `P:${$('wifi-password')};`
                + ($('wifi-hidden') ? 'H:true;' : '')
                + `;`
            break;
        case 'apple-shortcut':
            text = `shortcuts://run-shortcut?name=${$('apple-shortcut')}`;
            break;
        // TODO: `geo`
        default:
            text = element.innerText;
            break;
    }
    element.innerText = "";

    const qrErrCorr = { L: 1, M: 0, Q: 3, H: 2 };
    // Assume the display can be scanned clearly, so needs no correction
    let correctLevel = qrErrCorr[$('correction')] || qrErrCorr.L;


    let qr;
    if (text) {
        qr = new QRCode(element, {
            text,
            correctLevel,
            colorDark: $('qr-color-dark') || '#000000',
            colorLight: $('qr-color-dark') || '#ffffff',
        });
    }

    const pixels_per_cell = 4;
    const modules = qr._oQRCode.getModuleCount();
    let size = modules * pixels_per_cell

    let img = element.querySelector('img');
    img.style.width = `${size}px`;
    img.style.imageRendering = 'pixelated';
});