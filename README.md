Leaflet.TileBuffer
==================

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
