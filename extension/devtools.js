chrome.devtools.panels.create(
  "Foxman",
  "/media/icon.png",
  "panel.html",
  function(panel) {
    panel.onShown.addListener( function( panel ) {
      chrome.devtools.inspectedWindow.eval(
        `window.__FOXMAN_SYNC_DATA__`,
        function( result, isException ) {
          if ( isException ) {
            return;
          }

          panel.postMessage( {
            type: 'sync_data_init',
            payload: result
          }, '*' );
        }
      );
    } );
  }
);
