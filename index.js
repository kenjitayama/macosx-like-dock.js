
function createDock() {
	var dock = new MacStyleDock(document.getElementById('dock'), [ {
		name :'images/blue_w_umbrella_', // path for image
		extension :'.jpg', // file extension
		sizes : [ {width: 66, height: 100}, {width: 133, height: 200} ], // image sizes (small, large)
		onclick : function() { // function to call when clicked
		}
	}, {
		name :'images/brown_',
		extension :'.jpg',
		sizes : [ {width: 66, height: 100}, {width: 133, height: 200} ],
		onclick : function() {
		}
	}, {
		name :'images/brown_w_umbrella_',
		extension :'.jpg',
		sizes : [ {width: 66, height: 100}, {width: 133, height: 200} ],
		onclick : function() {
		}
	}, {
		name :'images/red_',
		extension :'.jpg',
		sizes : [ {width: 66, height: 100}, {width: 133, height: 200} ],
		onclick : function() {
		}
	}, {
		name :'images/yellow_',
		extension :'.jpg',
		sizes : [ {width: 66, height: 100}, {width: 133, height: 200} ],
		onclick : function() {
		}
	} ], {width: 66, height: 100}, // smallest size
	{width: 133, height: 200}, // largest size
	{width: 300, height: 24}, // caption size
	1,
	true, // no reflections
	false, // don't use xxx-full.jpg
	false // show caption images
	);
}

