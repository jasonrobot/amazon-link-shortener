/**
 * short_link.js
 */

/* eslint-disable no-use-before-define */
export {
    copyShortLinkToClipboard,
    getSpecialProductId,
    shortenAmazonLink,
    UnshortenableUrlException,
    $updateShortLink,
};
/* eslint-enable no-use-before-define */

/**
 * Exception type used when a link cannot be shortened with amzn.com.
 */
class UnshortenableUrlException extends Error {}

function isAmazonComUrl( link ) {
    return link.hostname.match( /amazon\.co/i ) === null;
}

/**
 * @param {URL} [link]
 * @return {(String|null)}
 */
function getSpecialProductId( link ) {
    const productIdPart = link.pathname.match( /\/dp\/([\w\d]+)/ );

    if ( productIdPart ) {
        return productIdPart[1];
    }
    return null;
}

/**
 * Shorten an amazon.com product link.
 * @param {URL} [link] The full link to an amazon.com product.
 * @returns {URL} The short URL to the same product.
 */
function shortenAmazonLink( link ) {
    if ( ( link instanceof URL ) === false ) {
        throw new TypeError( 'Argument must be instanceof URL.' );
    }

    if ( isAmazonComUrl( link ) ) {
        throw new UnshortenableUrlException( 'Can only shorten Amazon links.' );
    }

    const shortenedLink = new URL( link.toString() );
    const specialId = getSpecialProductId( link );

    if ( specialId === null ) {
        throw new UnshortenableUrlException( 'Not a product.' );
    }

    shortenedLink.pathname = specialId;
    shortenedLink.search = '';
    shortenedLink.hostname = 'amzn.com';
    return shortenedLink;
}

/**
 * Get the URL of the current tab.
 * @returns {URL}
 * @throws {Error} When the current tab's url isnt a valid url (wtf?)
 */
async function getCurrentTabUrl() {
    const [ { url: urlString } ] = await browser.tabs.query( {
        currentWindow: true,
        active: true,
    } );
    return new URL( urlString );
}

/**
 * Update the link to the shortened URL.
 */
async function $updateShortLink() {
    const shortLinkAnchor = document.querySelector( '.short-link__link' );

    const longUrl = await getCurrentTabUrl();
    try {
        const shortLinkString = shortenAmazonLink( longUrl ).toString();

        shortLinkAnchor.innerText = shortLinkString;
        shortLinkAnchor.setAttribute( 'href', shortLinkString );
    } catch ( exception ) {
        shortLinkAnchor.innerText = exception.message;
    }
}

async function copyShortLinkToClipboard() {
    const longUrl = await getCurrentTabUrl();

    const shortLinkString = shortenAmazonLink( longUrl ).toString();
    navigator.clipboard.writeText( shortLinkString );
}
