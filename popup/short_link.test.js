import {
    helloWorld,
    shortenAmazonLink,
} from "./short_link.js";

describe( 'helloWorld', () => {
    it( 'should say hello', () => {
        expect( helloWorld() ).toEqual( expect.stringMatching( /hello/i ) );
    } );
} );

describe( 'shortenAmazonLink', () => {
    it( 'should shorten a valid amazon link', () => {
        const testLink = new URL( 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf' );

        const expectedShortenedLink = new URL( 'https://amzn.com/B07QRLNW9B' );

        const actualShortenedLink = shortenAmazonLink( testLink );

        expect( actualShortenedLink.toString() )
            .toEqual( expectedShortenedLink.toString() );
    } );

    it( 'should not modify the original link', () => {
        const originalString = 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf';

        const testLink = new URL( 'https://www.amazon.com/Chon/dp/B07QRLNW9B?pf_rd_p=5cc0ab18-ad5f-41cb-89ad-d43149f4e286&pd_rd_wg=0YiVS&pf_rd_r=BBQGR1ZWZBMTFG2TZG4D&ref_=pd_gw_wish&pd_rd_w=yEzK2&pd_rd_r=56e3b574-f148-4f3e-9ab8-555ecf3de5cf' );

        shortenAmazonLink( testLink );

        expect( testLink.toString() ).toEqual( originalString );
    } );
} );
