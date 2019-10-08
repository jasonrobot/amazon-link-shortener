import {
    ShortLink,
} from './short_link.js';

const shortLink = new ShortLink();
shortLink.$updateShortLink().then( () => {
    document
        .querySelector( '.short-link__copy-button' )
        .addEventListener( 'click', async () => {
            await shortLink.copyShortLinkToClipboard();
            document
                .querySelector( '.short-link__copy-button' )
                .textContent = 'Copied!';
        } );
} );
