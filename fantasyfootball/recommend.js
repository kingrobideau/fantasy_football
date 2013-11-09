
//enterPosRankChart("QB", 10);
function recommend() {
	
}

function getAvailable(pickNum, pos) {
	var availableAtPos = dataset.filter(function(d) {
		return d.pos == pos & d.drafted == 0 & Number(d.adp_avg) >= pickNum;
	});
	return availableAtPos[0];
}

//APPEARS TO BE WORKING CORRECTLY
//HOWEVER, FIRST PICK IS HARD-CODED - NEED TO FIX
function kickoffRecursiveDraft() {
	var remainPickNums = [1, 24, 25, 48];
	var remainPos = ["QB", "RB", "WR", "TE"];
	var hypothTeamStart = [];
	hypothTeamStart.push(
		getAvailable(pickNums=remainPickNums[0], pos=remainPos[0])
	);
	recursiveDraft(
		pickNums = _.rest(remainPickNums),
		pos = _.rest(remainPos),
		team = hypothTeamStart
	)
}

function recursiveDraft(pickNums, pos, team) {
	var remainPickNums = pickNums;
	var remainPos = pos;
	var hypothTeamPart = team;

	//base case
	if(pickNums.length == 1) {
		console.log("Base case!");
		hypothTeamPart.push(
				getAvailable(
					pickNum = remainPickNums[0], 
					pos = remainPos[0],
					team = hypothTeamPart
				)
			);
		console.log(hypothTeamPart);
		return;
	}

	//recursive case
	console.log("Recursive case!");				
	for(i=0; i<remainPos.length; i++) {
		console.log(i);
		console.log(remainPos.length);
		console.log(remainPos);
		hypothTeamPart.push(
			getAvailable(
				pickNum = remainPickNums[1], 
				pos = remainPos[i],
				team = hypothTeamPart
			)
		);
		remainPickNums.splice(1,1);
		remainPos.splice(i,1);

		recursiveDraft(
			remainPickNums,
			remainPos,
			hypothTeamPart
		)	
	}
}
