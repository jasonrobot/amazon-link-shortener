/**
 * short link
 */

export {
    shortenAmazonLink,
    $updateShortLink,
    NonAmazonUrlException
};

class NonAmazonUrlException extends Error {
    constructor( errorMessage ) {
        super( errorMessage );
    }
}

/**
 * @param {URL} [link]
 * @returns {URL}
 */
function shortenAmazonLink( link ) {
    if ( ( link instanceof URL ) === false ) {
        throw new TypeError( 'Argument must be instanceof URL.' );
    }

    if ( link.hostname.match( /amazon\.co/i ) === null ) {
        throw new NonAmazonUrlException( 'Can only shorten Amazon links.' );
    }

    const shortenedLink = new URL( link.toString() );
    shortenedLink.pathname = link.pathname.match(/\/B[a-zA-Z0-9]+/);
    shortenedLink.search = '';
    shortenedLink.hostname = 'amzn.com';
    return shortenedLink;
}

function $updateShortLink() {
    const shortLinkAnchor = document.querySelector( '.short-link__link' );

    browser.tabs.query( {
        currentWindow: true,
        active: true
    } ).then( ( [ activeTab ] ) => {

        try {
            // const shortLinkString = shortenAmazonLink( new URL( 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf' ) ).toString();

            const shortLinkString = shortenAmazonLink( new URL( activeTab.url ) );

            shortLinkAnchor.innerText = shortLinkString;
            shortLinkAnchor.setAttribute( 'href', shortLinkString );
        }
        catch ( exception ) {
            shortLinkAnchor.innerText = exception.message;
        }
    } );
}

$updateShortLink();
