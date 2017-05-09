window.addEventListener( 'message', function (e) {
  var data = e.data;
  var type = data.type;
  var payload = data.payload;
  switch (type) {
    case 'sync_data_init':
      display( payload );
      break;
    default:
      // do nothing
  }
}, false );

let last;
function display( json ) {
  if ( last ) {
    last.$inject( false );
    last.destroy();
  }

  last = new JSONTree( {
    data: {
      source: json || {}
    }
  } ).$inject( '#app' );
}
