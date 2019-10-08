/**
 * short_link.js
 */

/* eslint-disable no-use-before-define */
export {
    // copyShortLinkToClipboard,
    // getSpecialProductId,
    // shortenAmazonLink,
    ShortLink,
    UnshortenableUrlException,
    // $updateShortLink,
};
/* eslint-enable no-use-before-define */

/**
 * Exception type used when a link cannot be shortened with amzn.com.
 */
class UnshortenableUrlException extends Error {}

class ShortLink {
    /**
     * @param {Url} [linkUrl=] Url to shorten. Defaults to the current tab's URL.
     */
    constructor( linkUrl ) {
        if ( linkUrl !== undefined ) {
            this.fullLink = linkUrl;
        } else {
            this.fullLink = this.getCurrentTabUrl();
        }

        this.setShortLink = ShortLink.shortenAmazonLink( this.fullLink );
    }

    get getShortLink() {
        return this.shortLink;
    }

    set setShortLink( link ) {
        this.shortLink = link;
    }

    static isAmazonComUrl( link ) {
        return link.hostname.match( /amazon\.co/i ) === null;
    }

    /**
     * @param {URL} [link]
     * @return {(String|null)}
     */
    static getSpecialProductId( link ) {
        const productIdPart = link.pathname.match( /\/(?:dp|gp\/product)\/([\w\d]+)/ );

        if ( productIdPart ) {
            return productIdPart[1];
        }
        return null;
    }

    /**
     * Shorten an amazon.com product link.
     * @param {URL} [link] The full link to an amazon.com product.
     */
    static shortenAmazonLink( link ) {
        if ( ( link instanceof URL ) === false ) {
            throw new TypeError( 'Argument must be instanceof URL.' );
        }

        if ( ShortLink.isAmazonComUrl( link ) ) {
            throw new UnshortenableUrlException( 'Can only shorten Amazon links.' );
        }

        const shortenedLink = new URL( link.toString() );
        const specialId = ShortLink.getSpecialProductId( link );

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
    static async getCurrentTabUrl() {
        const [ { url: urlString } ] = await browser.tabs.query( {
            currentWindow: true,
            active: true,
        } );
        return new URL( urlString );
    }

    /**
     * Update the link to the shortened URL.
     */
    async $updateShortLink() {
        const shortLinkAnchor = document.querySelector( '.short-link__link' );

        const longUrl = await ShortLink.getCurrentTabUrl();
        try {
            const shortLinkString = this.shortenAmazonLink( longUrl ).toString();

            shortLinkAnchor.innerText = shortLinkString;
            shortLinkAnchor.setAttribute( 'href', shortLinkString );
        } catch ( exception ) {
            shortLinkAnchor.innerText = exception.message;
        }
    }

    async copyShortLinkToClipboard() {
        const shortLinkString = this.getShortLink.toString();
        navigator.clipboard.writeText( shortLinkString );
    }
}
