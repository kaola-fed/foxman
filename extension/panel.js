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

function display( json ) {
  document.querySelector( '#app' ).innerHTML = JSON.stringify( json );
}
