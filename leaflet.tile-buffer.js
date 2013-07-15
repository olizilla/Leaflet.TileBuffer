/*
 ______           ___               ____                  ___     ___                 
/\__  _\   __    /\_ \             /\  _`\              /'___\  /'___\                
\/_/\ \/  /\_\   \//\ \       __   \ \ \L\ \   __  __  /\ \__/ /\ \__/    __    _ __  
   \ \ \  \/\ \    \ \ \    /'__`\  \ \  _ <' /\ \/\ \ \ \ ,__\\ \ ,__\ /'__`\ /\`'__\
    \ \ \  \ \ \    \_\ \_ /\  __/   \ \ \L\ \\ \ \_\ \ \ \ \_/ \ \ \_//\  __/ \ \ \/ 
     \ \_\  \ \_\   /\____\\ \____\   \ \____/ \ \____/  \ \_\   \ \_\ \ \____\ \ \_\ 
      \/_/   \/_/   \/____/ \/____/    \/___/   \/___/    \/_/    \/_/  \/____/  \/_/ 

  Leaflet.tile-buffer, a plugin to encourage Leaflet to load tiles beyond the viewport.

  Based on an old idea from OpenLayers, this plugin let's you ask Leaflet to load
  additional tiles beyond the bounds of the current viewport by specifiying a 
  `buffer` config property on a L.tileLayer

  see: http://dev.openlayers.org/releases/OpenLayers-2.11/examples/buffer.html
  see: http://dev.openlayers.org/releases/OpenLayers-2.12/doc/apidocs/files/OpenLayers/Layer/Grid-js.html#OpenLayers.Layer.Grid.buffer

  ## Usage

  - Add leaflet.tile-buffer.js to your page.
  - Add a `buffer` property to your layer definitions. It expects a Number. 8 is a good one.

	```javascript
	L.tileLayer(
		'http://{s}.tiles.mapbox.com/v3/foo.bar/{z}/{x}/{y}.png', 
		{ 
			subdomains: ['a', 'b', 'c'],
			buffer: 8
		}
	)
	```

  - I've found you need a buffer of about 4 per zoom level, if you want a nice zoom out on 1280x1024
  - Fine tune it as required. The optimal value depends on the viewport size, so experiment. 
  - Or be lazy and set it really high, just don't complain when your mobile performance sucks.

  ## Why?

  The issue of missing tiles on zoom out gets more obvious and jarring when you
  slow down the animation speed by over-riding the css with something like:

```css
	-webkit-transition: -webkit-transform 2s; 
	   -moz-transition:    -moz-transform 2s; 
	     -o-transition:      -o-transform 2s; 
	        transition:         transform 2s;
```
  Your layer does an nice scale transform, but you quickly see the limits of the tiles
  as a hard edged box, and only once the zoom is completed are the new tiles allowed to fill in the gap. 
  With extra tiles buffered, you can avoid that issue, at the expense of loading extra tiles.

  ## TODO

  - There is almost certainly a better fix for this, but this was the simplest thing I found that worked.
  - Hey Leaflet, what's with the CamelCase src files and dasherized-dist-files. Pick one?

  Tested with: leaflet 0.6.2
  on: 2013-07-15
  by: @olizilla

  https://github.com/olizilla/
  http://leafletjs.com
*/
(function (window, document, undefined) {

// Edited copy of: https://github.com/Leaflet/Leaflet/blob/v0.6.2/src/layer/tile/TileLayer.js#L271
L.TileLayer.include({

	_update: function () {

		if (!this._map) { return; }

		var bounds = this._map.getPixelBounds(),
			zoom = this._map.getZoom(),
			tileSize = this.options.tileSize;

		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
			return;
		}

		var tileBounds = L.bounds(
				bounds.min.divideBy(tileSize)._floor(),
				bounds.max.divideBy(tileSize)._floor());


		// Add buffer to the tile bounds. Causes tiles outside of the current viewport to be loaded, even though they're not currently visible.
		tileBounds = _addBuffer(tileBounds, this);           

		this._addTilesFromCenterOut(tileBounds);

		if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
			this._removeOtherTiles(tileBounds);
		}

		// The simplest thing that could work. 
		// This can create bounds beyond the limits of a spherical mercator map, 
		// but leaflet is smart enough not to request tiles that are outside the map.
		// @see: _tileShouldBeLoaded(...) https://github.com/Leaflet/Leaflet/blob/v0.6.2/src/layer/tile/TileLayer.js#L335
		function _addBuffer (bounds, layer) {

			if(!layer.options || !layer.options.buffer) {
				// nothing to do here. Move along
				return bounds;
			}
			
			var buffer = layer.options.buffer;

			console.log('buffering', buffer);

			bounds.max.x += buffer;
			bounds.max.y += buffer;

			bounds.min.x -= buffer;
			bounds.min.y -= buffer;

			return bounds;
		}
	}
});

}(this, document));