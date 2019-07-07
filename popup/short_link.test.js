import {
    copyShortLinkToClipboard,
    getSpecialProductId,
    shortenAmazonLink,
    UnshortenableUrlException,
} from './short_link.js';

describe( 'short_link.js', () => {
    it( 'should shorten a valid amazon link', () => {
        const testLink = new URL( 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf' );

        const expectedShortenedLink = new URL( 'https://amzn.com/B07QRLNW9B' );

        const actualShortenedLink = shortenAmazonLink( testLink );

        expect( actualShortenedLink.toString() )
            .toEqual( expectedShortenedLink.toString() );
    } );

    it( 'should use the part of the path after "/dp/"', () => {
        const testLink = new URL( 'https://amazon.com/foo/dp/123456/bar/baz?whatever=false' );

        const expectedShortenedLink = new URL( 'https://amzn.com/123456' );

        const actualShortenedLink = shortenAmazonLink( testLink );

        expect( actualShortenedLink.pathname )
            .toEqual( expectedShortenedLink.pathname );
    } );

    it( 'should not modify the original link', () => {
        const originalString = 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf';

        const testLink = new URL( 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf' );

        shortenAmazonLink( testLink );

        expect( testLink.toString() ).toEqual( originalString );
    } );

    it( 'should throw an exception when given an invalid argument', () => {
        expect( () => shortenAmazonLink( 'www.amazon.com' ) ).toThrow( TypeError );
    } );

    it( 'should throw an exception if the URL given is not for amazon.com', () => {
        expect( () => shortenAmazonLink( new URL( 'http://google.com' ) ) )
            .toThrow( UnshortenableUrlException );
    } );

    it( 'should throw an exception on non product amazon pages', () => {
        expect( () => shortenAmazonLink( new URL( 'http://amazon.com' ) ) )
            .toThrow( UnshortenableUrlException );
    } );

    describe( 'getSpecialProductId', () => {
        it( 'should work on a \'B\' link', () => {
            const id = getSpecialProductId(
                new URL( 'http://a.co/dp/B123456?foo=bar' ),
            );
            expect( id ).toEqual( 'B123456' );
        } );

        it( 'should work on a book link', () => {
            const id = getSpecialProductId(
                new URL( 'http://a.co/dp/123456/foo/bar' ),
            );
            expect( id ).toEqual( '123456' );
        } );

        it( 'should return null when there is no ID', () => {
            const id = getSpecialProductId(
                new URL( 'http://a.co/whatever/B123456?foo=bar' ),
            );
            expect( id ).toBeNull();
        } );
    } );

    fdescribe( 'copyShortTextToKeyboard', () => {
        beforeEach( () => {
            const mockedWriteText = () => new Promise(
                resolve => resolve(),
            );

            navigator.clipboard = {
                writeText: jest.fn( mockedWriteText ),
            };
        } );

        afterEach( () => {
            delete navigator.clipboard;
        } );

        it( 'should see navigator.clipboard.writeText', () => {
            expect( navigator ).toBeDefined();
            expect( navigator.clipboard ).toBeDefined();
            expect( navigator.clipboard.writeText() ).toBeInstanceOf( Promise );
        } );

        it( 'should copy a shortened link to the clipboard', () => {
            copyShortLinkToClipboard();
            expect( navigator.clipboard.writeText ).toHaveBeenCalled();
        } );

        it( 'should do nothing if there is no shortened link', () => {

        } );
    } );
} );
