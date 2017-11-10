require('./adsenseloader.js')($);

module.exports = function(){
  $( '.adsbygoogle' ).adsenseLoader(
    {
      onLoad: function( $ad )
      {
        $ad.addClass( 'adsbygoogle--loaded' );
      }
  });
}
