import { short_link } from "./short_link.js";

describe( 'helloWorld', () => {
    it( 'should say hello', () => {
        expect( short_links.helloWorld() ).stringMatching( /hello/i );
    } );
} );
