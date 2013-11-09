 /*
 * Display pick pos at top
 */ 

var pickNum = 1;

function getTeamsFromUrl() {
	var map = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		map[key] = value;
	});
	var teamNames = [];
	for(key in map) {
		var name = map[key].replace("+", " ");
		teamNames.push(name);
	}
	return teamNames;
}

teamNames = getTeamsFromUrl();

d3.select('div.pickContainer').selectAll('div')
 	.data(teamNames)
 	.enter()
 	.append('div')
 	.attr('class', 'pick')
 	.text(function(d) { return d; });

//Snake style draft order
function nowDrafting(pickNum) {
	var remainder = pickNum % teamNames.length;
	var quotientFloor = Math.floor((pickNum - 1) / teamNames.length);
	if(quotientFloor % 2 == 0) { //count left to right
		if(remainder == 0) {
			return teamNames[teamNames.length - 1];
		}
 		else {
 			return teamNames[remainder - 1]; 
 		}
 	} else { //count right to left
 		if (remainder == 0) {
			return teamNames[0];
		}
 		else {
 			return teamNames[teamNames.length - remainder]; 
 		}
 	}
}

var activeTeam = nowDrafting(pickNum);



	 