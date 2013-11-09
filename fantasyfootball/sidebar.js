 /*
  * Sidebar
  */ 

var teams = [
 	'Dez Martin Luck To It',
 	'Toronto Bad News Bears',
 	'Genius Brand Beat-Down',
 	'DIQ Touch Downloaders',
 	'Not Just a FOG',
 	'NYC Feminists',
 	'Feeble Fumblers',
 	'The Reign of Heisenberg',
 	'East Eggers',
 	'Team Sherard',
 	'Mabel Indians',
 	'Team Galloway'
];

var rosters = [];
for(t in teams) {
	rosters.push(
		{'name': teams[t], 'roster': 
			[
				{'pos': 'QB', 'name': ''},
				{'pos': 'RB', 'name': ''},
				{'pos': 'RB', 'name': ''},
				{'pos': 'WR', 'name': ''},
				{'pos': 'WR', 'name': ''},
				{'pos': 'TE', 'name': ''},
				{'pos': 'FLEX', 'name': ''},
				{'pos': 'DEF', 'name': ''},
				{'pos': 'BE', 'name': ''},
				{'pos': 'BE', 'name': ''},
				{'pos': 'BE', 'name': ''},
				{'pos': 'BE', 'name': ''},
				{'pos': 'BE', 'name': ''}
			]
		}
	)
}

function enterRoster(rosterName) {
	rosterDropdown = d3.select(".sidebar")
		.append('select')
		.on('change', selectRoster)
		.style("margin", 10);
	rosterDropdown.selectAll('option')
		.data(teams)
		.enter()
		.append('option')
		.attr('class', 'd3_curve-selection_area-drop_down_list')
	    .attr('value', function(d) { return d; })
	    .text( function(d) { return d; });

	var roster = rosters.filter(function(d) {
		return d.name==rosterName;
	})[0];

	d3.select('div.sidebar').selectAll('div')
	    .data(roster.roster)
	    .enter()
	    .append('div')	
	    .attr('class', 'rosterSlot')
	    .text(function(d) { return d.pos + ": " + d.name ; })
}

function exitRoster() {
	d3.select('div.sidebar').selectAll('select').remove();
	d3.select('div.sidebar').selectAll('div').remove();
}

function selectRoster() {
	var selectedRoster = rosterDropdown.node().options[rosterDropdown.node().selectedIndex];
		exitRoster();
		enterRoster(selectedRoster.value); 
}

var myTeamName = 'Dez Martin Luck To It';
var activeTeamName = 'Toronto Bad News Bears';
enterRoster(myTeamName);
