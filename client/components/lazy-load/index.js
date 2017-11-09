$( '.adsbygoogle' ).adsenseLoader(
  {
    onLoad: function( $ad )
    {
      $ad.addClass( 'adsbygoogle--loaded' );
    }
});