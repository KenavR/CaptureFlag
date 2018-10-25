window.onload = function() {

	//Create array of options to be added
	var array = ["", "Wall", "Border Wall", "Spike", "Boost Up", "Boost Right", "Boost Down", "Boost Left", "Flag Spawn", "Red Team Spawn", "Blue Team Spawn"];
	var select = document.getElementsByTagName('select');
	var map = document.getElementById('map');
	var currentMap = [
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 8, 0, 8, 0, 8, 2, 3,
		3, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 4.4, 4.4, 0, 1, 0, 8, 0, 8, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 8, 4.4, 5, 0, 8, 2, 3,
		3, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 8, 4.3, 8, 0, 2, 3,
		3, 2, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 1, 8, 0, 8, 2, 3,
		3, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 3,
		3, 2, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 4.1, 0, 1, 4.3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 3, 0, 3, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4.3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4.2, 3, 0, 3, 4.4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 4.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 3, 0, 3, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4.1, 1, 0, 4.3, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 2, 3,
		3, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 2, 3,
		3, 2, 9, 0, 9, 1, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 2, 3,
		3, 2, 0, 9, 4.1, 9, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 3,
		3, 2, 9, 0, 5, 4.2, 9, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 9, 0, 9, 0, 1, 0, 4.2, 4.2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 3,
		3, 2, 9, 0, 9, 0, 9, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
	];



	//Create and append select list
	for (var i = 0; i < 625; i++) {
		var selectList = document.createElement("select");
		selectList.id = "mySelect";

		//Create and append the options
		for (var j = 0; j < array.length; j++) {
			var option = document.createElement("option");
			option.value = array[j];
			option.text = array[j];
			selectList.appendChild(option);
		}

		map.appendChild(selectList);

		select[i].selectedIndex = currentMap[i] == 4.1 ? 4 :
			currentMap[i] == 4.2 ? 5 :
			currentMap[i] == 4.3 ? 6 :
			currentMap[i] == 4.4 ? 7 :
			currentMap[i];

		changeGrid(selectList);

		selectList.addEventListener('change', function() {
			changeGrid(this);
		});
	}



	function changeGrid(grid) {

		if (grid.selectedIndex < 8) {
			var img = "url(../client/images/" + grid.value + ".png)"
			grid.style.backgroundImage = img.replace(' ', '');
			grid.style.backgroundColor = 'transparent';
		} else {
			grid.value == 'Flag Spawn' ? grid.style.backgroundColor = 'rgba(255, 255, 102, .5)' :
				grid.value == 'Red Team Spawn' ? grid.style.backgroundColor = 'rgba(255, 0, 0, .5)' :
				grid.value == 'Blue Team Spawn' ? grid.style.backgroundColor = 'rgba(0, 0, 255, .5)' : 0;
		}
	}

}


function exportMap() {
	var select = document.getElementsByTagName('select');

	var mapArr = [];

	for (var i = 0; i < select.length; i++) {
		var selectIndex = select[i].selectedIndex == 4 ? 4.1 :
			select[i].selectedIndex == 5 ? 4.2 :
			select[i].selectedIndex == 6 ? 4.3 :
			select[i].selectedIndex == 7 ? 4.4 :
			select[i].selectedIndex == 8 ? 5 :
			select[i].selectedIndex == 9 ? 8 :
			select[i].selectedIndex == 10 ? 9 :
			select[i].selectedIndex;

		mapArr.push(selectIndex);
	}

	window.open('mailto:captureflagio@gmail.com?subject=Map&body=' + mapArr);

}