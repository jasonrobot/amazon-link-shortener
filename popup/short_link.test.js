import {
    ShortLink,
    UnshortenableUrlException,
} from './short_link.js';

describe( 'short_link.js', () => {
    it( 'should shorten a valid amazon link', () => {
        const testLink = new URL( 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf' );

        const expectedShortenedLink = new URL( 'https://amzn.com/B07QRLNW9B' );

        const actualShortenedLink = new ShortLink( testLink ).getShortLink;

        expect( actualShortenedLink.toString() )
            .toEqual( expectedShortenedLink.toString() );
    } );

    it( 'should use the part of the path after "/dp/"', () => {
        const testLink = new URL( 'https://amazon.com/foo/dp/123456/bar/baz?whatever=false' );

        const expectedShortenedLink = new URL( 'https://amzn.com/123456' );

        const actualShortenedLink = new ShortLink( testLink ).getShortLink;

        expect( actualShortenedLink.pathname )
            .toEqual( expectedShortenedLink.pathname );
    } );

    /* eslint-disable no-unused-expressions */
    it( 'should not modify the original link', () => {
        const originalString = 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf';

        const testLink = new URL( 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf' );

        new ShortLink( testLink ).getShortLink;

        expect( testLink.toString() ).toEqual( originalString );
    } );
    /* eslint-enable no-unused-expressions */

    it( 'should throw an exception when given an invalid argument', () => {
        expect( () => new ShortLink( 'www.amazon.com' ) ).toThrow( TypeError );
    } );

    it( 'should throw an exception if the URL given is not for amazon.com', () => {
        expect( () => new ShortLink( new URL( 'http://google.com' ) ) )
            .toThrow( UnshortenableUrlException );
    } );

    it( 'should throw an exception on non product amazon pages', () => {
        expect( () => new ShortLink( new URL( 'http://amazon.com' ) ) )
            .toThrow( UnshortenableUrlException );
    } );

    describe( 'getSpecialProductId', () => {
        it( 'should work on a \'B\' link', () => {
            const id = ShortLink.getSpecialProductId(
                new URL( 'http://a.co/dp/B123456?foo=bar' ),
            );
            expect( id ).toEqual( 'B123456' );
        } );

        it( 'should work on a book link', () => {
            const id = ShortLink.getSpecialProductId(
                new URL( 'http://a.co/dp/123456/foo/bar' ),
            );
            expect( id ).toEqual( '123456' );
        } );

        it( 'should work on a gp/product link', () => {
            const url = new URL( 'https://www.amazon.com/gp/product/B07CJN69MV/ref=s9_acsd_al_bw_c_x_3_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-5&pf_rd_r=F3CNC9EYPP3PA4X4S4XF&pf_rd_t=101&pf_rd_p=559a880c-b191-4be9-9883-341b6eabf178&pf_rd_i=19461882011' );

            const id = ShortLink.getSpecialProductId( url );

            expect( id ).toEqual( 'B07CJN69MV' );
        } );

        it( 'should return null when there is no ID', () => {
            const id = ShortLink.getSpecialProductId(
                new URL( 'http://a.co/whatever/B123456?foo=bar' ),
            );
            expect( id ).toBeNull();
        } );
    } );

    describe( 'copyShortTextToKeyboard', () => {
        beforeEach( () => {
            const mockedWriteText = () => new Promise(
                ( resolve ) => {
                    console.log( 'calling mock write text' );
                    resolve();
                },
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

        it( 'should copy a shortened link to the clipboard', async ( done ) => {
            const testLink = new URL( 'http://amazon.com/dp/B123456?foo=bar' );

            const shortLink = new ShortLink( testLink );
            await shortLink.copyShortLinkToClipboard();
            expect( navigator.clipboard.writeText ).toHaveBeenCalled();
            done();
        } );

        xit( 'should do nothing if there is no shortened link', () => {

        } );
    } );
} );
