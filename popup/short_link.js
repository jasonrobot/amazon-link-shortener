/**
 * short link
 */

export {
    helloWorld,
    shortenAmazonLink,
};

function helloWorld() {
    return "Hello, world!";
}

/**
 * @param {URL} [link]
 * @returns {URL}
 */
function shortenAmazonLink( link ) {

    const shortenedLink = new URL( link.toString() );
    shortenedLink.pathname = link.pathname.match(/\/B[a-zA-Z0-9]+/);
    shortenedLink.search = '';
    shortenedLink.hostname = 'amzn.com';
    return shortenedLink;
}
