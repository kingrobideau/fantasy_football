d3.text('robideau2013.csv', function(csv) {
	var dataset = d3.csv.parse(csv);

	/*--------------------------------------------------------------------------------
	 * GLOBAL DECLARATIONS
	 --------------------------------------------------------------------------------*/
	
	//Elements
	var topNChart,
		posDropdown,
		measureDropdown;

	//Parameters
	var height = 400,
		width = 750,
		pad = 30,
		bannerHeight = 71;
		barHeight = height/15,
		barPad = barHeight/5;

	var nodeColors = ["red", "green", "blue", "orange", "purple"];

	/*--------------------------------------------------------------------------------
	 * DRAFT WIDGET
	 --------------------------------------------------------------------------------*/

	$.widget( "custom.catcomplete", $.ui.autocomplete, {
		_renderMenu: function( ul, items ) {
			var that = this,
			currentCategory = "";
			$.each( items, function( index, item ) {
				if ( item.category != currentCategory ) {
					ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
					currentCategory = item.category;
				}
				that._renderItemData( ul, item );
			});
		}
	});

	var playerNames= _.pluck(dataset, 'name' );
	$('#playerSearch').autocomplete({
		source: playerNames
	});

	draftButton = d3.select('.ui-widget')
		.append('button')
		.text("Draft!")
		.style("margin", 10)
		.style("width", 150)
		.style("height", 50)
		.style("font", "18px georgia")
		.style("font-style", "italic")
		.on('click', draft);

	function draft() {
		var searchedPlayer = d3.select('#playerSearch')[0][0].value; //get value from textbox in ui-widget
		
		//Mark player drafted in dataset
		for(i=0; i<dataset.length; i++){
			if(dataset[i].name == searchedPlayer) {
				dataset[i].drafted = 1;
				var updatedPos = dataset[i].pos;
				break;
			}
		}

		//Add player to roster of team marked as activeTeam
		//NEED TO ACCOUNT FOR ROSTER ALREADY HAVING MAX NUMBER OF PLAYERS AT A POSITION
		for(rost=0; rost<rosters.length; rost++){
			if(rosters[rost].name == activeTeamName) {
				for(plyr=0; plyr<rosters[rost].roster.length; plyr++) {
					if(rosters[rost].roster[plyr].pos == updatedPos) {
						if(rosters[rost].roster[plyr].name == '') {
							rosters[rost].roster[plyr].name = searchedPlayer;
							break;
						}
					}
				}
			}
		}

		exitTopNChart();
		enterTopNChart(updatedPos, 10);
		pickNum++;
		nowDrafting(pickNum);
	}

	/*--------------------------------------------------------------------------------
	 D3 VISUALIZATION SELECTOR
	 --------------------------------------------------------------------------------*/

	 d3.select('#topNButton')
	 	.style("background", "purple")
	 	.style("width", "100px")
		.style("height", "20px")
		.style("border", "2px solid #708090")
	 	.style("color", "white")
	 	.style("font-family", "arial")
		.style("font-size", "12px")
	 	.on('click', defaultTopNChart);

	 d3.select('#forceButton')
	 	.style("background", "green")
	 	.style("width", "100px")
		.style("height", "20px")
		.style("border", "2px solid #708090")
	 	.style("color", "white")
	 	.style("font-family", "arial")
		.style("font-size", "12px")
	 	.on('click', defaultForceGraph);

 	/*--------------------------------------------------------------------------------
 	 * D3 VISUALIZATIONS
 	 --------------------------------------------------------------------------------*/

 	 /*
 	  * TOP N CHART
 	  */

	 function defaultTopNChart() {
	 	exitForceGraph();
	 	exitTopNChart();''
	 	enterTopNChart("QB", 10);
	 }

	function enterTopNChart(pos, n, measure) {
		topNChart = d3.select(".canvas")	
			.append("svg")
			.attr("width", width)		
			.attr("height", height);

		//Get top N at position
		var filtered = dataset.filter(function(obj) {
				return obj.pos==pos;
		});
		var topNAtPos = _.first(filtered, n);

		var xScale = d3.scale.linear()
			.domain([0, d3.max(topNAtPos, function(d) { return d.total_pts; })])
			.range([0, width]);

		//Autocomplete dropdown
		posDropdown = d3.select(".canvas")
			.append('select')
			.on('change', updateTopNPos)
			.style("margin", 10);

		posDropdown.selectAll('option')
			.data(["Positions", "QB", "RB", "WR", "TE", "K"])
			.enter()
			.append('option')
			.attr('class', 'd3_curve-selection_area-drop_down_list')
		    .attr('value', function(d) { return d; })
		    .text( function(d) { return d; });

		measureDropdown = d3.select('.canvas')
			.append('select')
			.on('change', updateTopNMeasure)
			.style('margin', 10);

		var measures = [];
		for (key in dataset[0]) {
			measures.push(key);
		}

		measureDropdown.selectAll('option')
			.data(measures)
			.enter()
			.append('option')
			.attr('class', 'd3_curve-selection_area-drop_down_list')
			.attr('value', function(d) { return d; })
			.text( function(d) { return d });

		var gradient = topNChart
		    .append("linearGradient")
		    .attr("y1", "0")
		    .attr("y2", "0")
		    .attr("x1", "0")
		    .attr("x2", width)	
		    .attr("id", "gradient")
		    .attr("gradientUnits", "userSpaceOnUse")

		gradient
		    .append("stop")
		    .attr("offset", "0")
		    .attr("stop-color", "#1909AB")

		gradient
		    .append("stop")
		    .attr("offset", "0.5")
		    .attr("stop-color", "#4DABF2")
				
		topNChart.selectAll("rect")
			.data(topNAtPos)
			.enter()
			.append("rect")
			.attr("x", 0)
			.attr("y", function(d, i) {
				return barHeight*i + pad + (i-1)*barPad;
			})
			.attr("width", function(d) {
				return xScale(d.total_pts);
			})	
			.attr("height", barHeight)
			.attr("fill", function(d) {
				if(d.drafted==1) { return "#C0C0C0"; }
				else { return "url(#gradient)"; }
			});
		topNChart.selectAll("text")
			.data(topNAtPos)
			.enter()
			.append("text")
			.text(function(d) {
				return d.name;
			})
			.attr("x", 10)
			.attr("y", function(d, i) {
				return barHeight*i + pad + (i-1)*barPad + barPad + barHeight/2;
			})
			.style("font-family", "arial")
			.style("font-weight", "bold")
			.style("fill", "#DCDCDC");
	}

	function updateTopNPos() {
		var posSelection = posDropdown.node().options[posDropdown.node().selectedIndex];
		exitTopNChart();
		enterTopNChart(posSelection.value, 10, 'total_pts'); 
	}

	function updateTopNMeasure() {
		var measureSelection = measureDropdown.node().options[measureDropdown.node().selectedIndex];
		exitTopNChart();
		enterTopNChart('QB', 10, measureSelection.value)
	}

	function exitTopNChart() {
		topNChart.remove();
		d3.select('div.canvas').selectAll("select").remove();
	}

	/*
 	 * FORCE DIRECTED LAYOUT
 	 */

 	 function defaultForceGraph() {
 	 	exitTopNChart();
 	 	enterForceGraph();
 	 }

 	 function enterForceGraph() {
 	 	forceGraph = d3.select(".canvas")	
			.append("svg")
			.attr("width", width)		
			.attr("height", height);

 	 	var forceData = {
 	 	 	nodes: [
 	 	 		{name: "Mike"},
 	 	 		{name: "Bob"},
 	 	 		{name: "John"},
 	 	 		{name: "Doug"},
 	 	 		{name: "Carl"},
 	 	 	],
 	 	 	edges: [
 	 	 		{source: 0, target: 1},
 	 	 		{source: 0, target: 2},
 	 	 		{source: 1, target: 2},
 	 	 		{source: 2, target: 3},
 	 	 		{source: 2, target: 4},
 	 	 		{source: 3, target: 4}
 	 	 	]
 	 	 } 

 	 	 var force = d3.layout.force()
 	 	 	.nodes(forceData.nodes)
 	 	 	.links(forceData.edges)
 	 	 	.size([width, height])
 	 	 	.start();

 	 	 var edges = forceGraph.selectAll("line")
 	 	 	.data(forceData.edges)
 	 	 	.enter()
 	 	 	.append("line")
 	 	 	.style("stroke", "#ccc")
 	 	 	.style("stroke-width", 1);

 	 	 var nodes = forceGraph.selectAll("circle")	
 	 	 	.data(forceData.nodes)
 	 	 	.enter()
 	 	 	.append("circle")
 	 	 	.attr("r", 10)
 	 	 	.style("fill", function(d, i) {
 	 	 		return nodeColors[i];
 	 	 	})
 	 	 	.call(force.drag);

 	 	 force.on("tick",function(d) {
 	 	 	edges.attr("x1", function(d) { return d.source.x; })
 	 	 		.attr("y1", function(d) { return d.source.y; })
 	 	 		.attr("x2", function(d) { return d.source.x; })
 	 	 		.attr("y2", function(d) { return d.source.y; });

 	 	 	nodes.attr("cx", function(d) { return d.x; })
 	 	 		.attr("cy", function(d) { return d.y; })
 	 	 });

 	 }

 	 function exitForceGraph() {
 	 	forceGraph.remove();
 	 }

	/*--------------------------------------------------------------------------------
 	 * INITIALIZATION
 	 --------------------------------------------------------------------------------*/

	 enterTopNChart("QB", 10);
});