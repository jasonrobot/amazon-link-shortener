/**
 * short link
 */

/* eslint-disable no-use-before-define */
export {
    shortenAmazonLink,
    UnshortenableUrlException,
    $updateShortLink,
};
/* eslint-enable no-use-before-define */

class UnshortenableUrlException extends Error {}

/**
 * @param {URL} [link]
 * @returns {URL}
 */
function shortenAmazonLink( link ) {
    if ( ( link instanceof URL ) === false ) {
        throw new TypeError( 'Argument must be instanceof URL.' );
    }

    if ( link.hostname.match( /amazon\.co/i ) === null ) {
        throw new UnshortenableUrlException( 'Can only shorten Amazon links.' );
    }

    const shortenedLink = new URL( link.toString() );
    const specialId = link.pathname.match( /\/B[a-zA-Z0-9]+/ );

    if ( specialId === null ) {
        throw new UnshortenableUrlException( 'Not a product.' );
    }

    shortenedLink.pathname = specialId;

    shortenedLink.search = '';
    shortenedLink.hostname = 'amzn.com';
    return shortenedLink;
}

function $updateShortLink() {
    const shortLinkAnchor = document.querySelector( '.short-link__link' );

    browser.tabs.query( {
        currentWindow: true,
        active: true,
    } ).then( ( [activeTab] ) => {
        try {
            const shortLinkString = shortenAmazonLink( new URL( activeTab.url ) );

            shortLinkAnchor.innerText = shortLinkString;
            shortLinkAnchor.setAttribute( 'href', shortLinkString );
        } catch ( exception ) {
            shortLinkAnchor.innerText = exception.message;
        }
    } );
}
