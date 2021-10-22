import {
    copyShortLinkToClipboard,
    getProductId,
    shortenAmazonLink,
    UnshortenableUrlException,
} from './short_link.js';

describe( 'short_link.js', () => {
    it( 'should shorten a valid amazon link', () => {
        const testLink = new URL( 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf' );

        const expectedShortenedLink = new URL( 'https://amazon.com/dp/B07QRLNW9B' );

        const actualShortenedLink = shortenAmazonLink( testLink );

        expect( actualShortenedLink.toString() )
            .toEqual( expectedShortenedLink.toString() );
    } );

    it( 'should include "/dp/" in the path', () => {
        const testLink = new URL( 'https://amazon.com/foo/dp/123456/bar/baz?whatever=false' );

        const expectedShortenedLink = new URL( 'https://amazon.com/dp/123456' );

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

    describe( 'international links', () => {
        it( 'should work on multi TLD links', () => {
            const testLink = new URL( 'https://www.amazon.co.uk/Anker-SoundCore-Dual-Driver-Distortion-Microphone-Black/dp/B016MO90GW/?_encoding=UTF8&pd_rd_w=3UxD3&pf_rd_p=6e26e351-4185-4f1d-98cd-3dc57742cc70&pf_rd_r=CXQTDRC5FE5N5SEPJ05J&pd_rd_r=5fd581d9-ff38-43eb-81df-739bf0d9f271&pd_rd_wg=HP6HZ&ref_=pd_gw_unk&th=1' );

            const expectedShortenedLink = new URL( 'https://amazon.co.uk/dp/B016MO90GW' );

            const actualShortenedLink = shortenAmazonLink( testLink );

            expect( actualShortenedLink.toString() )
                .toEqual( expectedShortenedLink.toString() );
        } );

        it( 'should work on single TLD links', () => {
            const testLink = new URL( 'https://www.amazon.de/Player-Games-Culture-Novel/dp/1857231465/ref=sr_1_1?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=player+of+games&qid=1634873580&sr=8-1' );

            const expectedShortenedLink = new URL( 'https://amazon.de/dp/1857231465' );

            const actualShortenedLink = shortenAmazonLink( testLink );

            expect( actualShortenedLink.toString() )
                .toEqual( expectedShortenedLink.toString() );
        } );
    } );

    describe( 'getProductId', () => {
        it( 'should work on a \'B\' link', () => {
            const [
                category,
                id,
            ] = getProductId(
                new URL( 'http://a.co/dp/B123456?foo=bar' ),
            );
            expect( category ).toEqual( 'dp' );
            expect( id ).toEqual( 'B123456' );
        } );

        it( 'should work on a book link', () => {
            const [ , id ] = getProductId(
                new URL( 'http://a.co/dp/123456/foo/bar' ),
            );
            expect( id ).toEqual( '123456' );
        } );

        it( 'should work on a gp/product link', () => {
            const url = new URL( 'https://www.amazon.com/gp/product/B07CJN69MV/ref=s9_acsd_al_bw_c_x_3_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-5&pf_rd_r=F3CNC9EYPP3PA4X4S4XF&pf_rd_t=101&pf_rd_p=559a880c-b191-4be9-9883-341b6eabf178&pf_rd_i=19461882011' );

            const [
                category,
                id,
            ] = getProductId( url );

            expect( category ).toEqual( 'gp/product' );
            expect( id ).toEqual( 'B07CJN69MV' );
        } );

        it( 'should return null when there is no ID', () => {
            const id = getProductId(
                new URL( 'http://a.co/whatever/B123456?foo=bar' ),
            );
            expect( id[0] ).toBeNull();
            expect( id[1] ).toBeNull();
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
            global.browser = {
                tabs: {
                    query: jest.fn( () => new Promise( resolve => resolve( [ { url: 'http://amazon.com/dp/B123456?foo=bar' } ] ) ) ),
                },
            };

            await copyShortLinkToClipboard();
            expect( navigator.clipboard.writeText ).toHaveBeenCalled();
            done();
        } );

        xit( 'should do nothing if there is no shortened link', () => {

        } );
    } );
} );
