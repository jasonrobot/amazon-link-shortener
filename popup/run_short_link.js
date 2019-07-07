import {
    copyShortLinkToClipboard,
    $updateShortLink,
} from './short_link.js';

$updateShortLink();

document
    .querySelector( '.short-link__copy-button' )
    .addEventListener( 'click', async () => {
        await copyShortLinkToClipboard();
        document
            .querySelector( '.short-link__copy-button' )
            .textContent = 'Copied!';
    } );
