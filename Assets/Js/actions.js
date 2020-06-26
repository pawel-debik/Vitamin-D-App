
// UI elements
const uvLevel = document.querySelector('.uv-level');
const getCurrent = document.getElementById('get-current');
const getForecast = document.getElementById('get-forecast');
const singleUvIndex = document.querySelector('.uv-index-now_number');
const clothesSlider = document.getElementById('clothes-slider');
const cloudCoverageSlider = document.getElementById('cloud-coverage-slider');
const ageSlider = document.getElementById('age-slider');
const spfSlider = document.getElementById('spf-slider');
const bmiSlider = document.getElementById('bmi-slider');
const ageNumber = document.querySelector('.factor-age_number');
const spfNumber = document.querySelector('.factor-spf_number');
const bmiNumber = document.querySelector('.factor-bmi_number');

// API stuff
const urlGetCurrentUv = 'https://api.openuv.io/api/v1/uv?lat=52.07&lng=4.28';
const urlGetForecastUv = 'https://api.openuv.io/api/v1/forecast?lat=52.07&lng=4.28';
const token = 'a4919b716dbadd90a2b85094147fadb7';

/* Charts */
let timeChart = '';

// Placeholder forecast and current UV data. Will be local store later
// const forecast = [{"result":[{"uv":0, "uv_time":"2020-06-25T03:24:51.453Z", "sun_position":{"azimuth":-2.294562007703575, "altitude":-0.012770363434723526 } }, {"uv":0.1065, "uv_time":"2020-06-25T04:24:51.453Z", "sun_position":{"azimuth":-2.092572489519605, "altitude":0.11777308734579932 } }, {"uv":0.4744, "uv_time":"2020-06-25T05:24:51.453Z", "sun_position":{"azimuth":-1.8984704091529137, "altitude":0.26416079027035716 } }, {"uv":1.2392, "uv_time":"2020-06-25T06:24:51.453Z", "sun_position":{"azimuth":-1.7046646876624245, "altitude":0.42052615353256895 } }, {"uv":2.4784, "uv_time":"2020-06-25T07:24:51.453Z", "sun_position":{"azimuth":-1.5005381619546625, "altitude":0.5810479560717934 } }, {"uv":4.1146, "uv_time":"2020-06-25T08:24:51.453Z", "sun_position":{"azimuth":-1.270601372096058, "altitude":0.7389246056725316 } }, {"uv":5.8185, "uv_time":"2020-06-25T09:24:51.453Z", "sun_position":{"azimuth":-0.9914287462163072, "altitude":0.8843933425161872 } }, {"uv":7.3288, "uv_time":"2020-06-25T10:24:51.453Z", "sun_position":{"azimuth":-0.6317215098936501, "altitude":1.0013417487745344 } }, {"uv":8.1711, "uv_time":"2020-06-25T11:24:51.453Z", "sun_position":{"azimuth":-0.17587846818001684, "altitude":1.0650379621882617 } }, {"uv":7.9581, "uv_time":"2020-06-25T12:24:51.453Z", "sun_position":{"azimuth":0.31801763406504385, "altitude":1.05346796732398 } }, {"uv":6.9029, "uv_time":"2020-06-25T13:24:51.453Z", "sun_position":{"azimuth":0.7473144528189045, "altitude":0.9712435023366099 } }, {"uv":5.3829, "uv_time":"2020-06-25T14:24:51.453Z", "sun_position":{"azimuth":1.0801078888920728, "altitude":0.8436980423894176 } }, {"uv":3.5434, "uv_time":"2020-06-25T15:24:51.453Z", "sun_position":{"azimuth":1.3418016815155316, "altitude":0.6932542236814296 } }, {"uv":2.0137, "uv_time":"2020-06-25T16:24:51.453Z", "sun_position":{"azimuth":1.5621333167796223, "altitude":0.5337443397985737 } }, {"uv":0.9294, "uv_time":"2020-06-25T17:24:51.453Z", "sun_position":{"azimuth":1.7618794698151798, "altitude":0.37377385707239047 } }, {"uv":0.3098, "uv_time":"2020-06-25T18:24:51.453Z", "sun_position":{"azimuth":1.9548188514421405, "altitude":0.21970344524734878 } }, {"uv":0.0678, "uv_time":"2020-06-25T19:24:51.453Z", "sun_position":{"azimuth":2.1505581242235925, "altitude":0.07729081714120292 } } ] }];
const forecast = [];
const current = {"uv":4.1146,"uv_time":"2020-06-25T08:29:08.758Z","uv_max":8.1711,"uv_max_time":"2020-06-25T11:46:47.435Z","ozone":309.6,"ozone_time":"2020-06-25T06:07:13.969Z","safe_exposure_time":{"st1":41,"st2":49,"st3":65,"st4":81,"st5":130,"st6":243},"sun_info":{"sun_times":{"solarNoon":"2020-06-25T11:46:47.435Z","nadir":"2020-06-24T23:46:47.435Z","sunrise":"2020-06-25T03:24:51.453Z","sunset":"2020-06-25T20:08:43.416Z","sunriseEnd":"2020-06-25T03:29:27.898Z","sunsetStart":"2020-06-25T20:04:06.972Z","dawn":"2020-06-25T02:35:52.794Z","dusk":"2020-06-25T20:57:42.076Z","nauticalDawn":"2020-06-25T01:17:12.396Z","nauticalDusk":"2020-06-25T22:16:22.473Z","nightEnd":null,"night":null,"goldenHourEnd":"2020-06-25T04:20:03.945Z","goldenHour":"2020-06-25T19:13:30.925Z"},"sun_position":{"azimuth":-1.2526193820334395,"altitude":0.7498784630420997}}};

let uvIndexes = [];
let uvTimes = [];
let uvNumber = '';
let roundedUvNumber = '';

let now = '';
let forecastDate  = '';
let multiplier = 1;

function renderUvChart(data, labels) {
	const ctx = document.getElementById("uv-chart").getContext('2d');
	
	var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
	gradientStroke.addColorStop(0, "#b37bda");
	gradientStroke.addColorStop(0.5, "#d83d83");
	gradientStroke.addColorStop(1, "#b37bda");

	const uvChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'UV Index',
				borderColor: gradientStroke,
				backgroundColor: "#d83d8315",
				borderWidth: 6,
				pointBorderWidth: 0,
				data: data,
				}]
		},
		options: {
			legend: {
				display: false
			}
		}
	});

	Chart.defaults.global.defaultFontColor = "#fff";
}


function renderTimeChart(minimumExposure, maximumExposure) {
	const ctx = document.getElementById("time-chart").getContext('2d');
	timeChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: ['I', 'II', 'III', 'IV', 'V', 'VI'],
			datasets: [{
				label: 'Amount of minutes under current conditions to reach 4000 IU',
				borderColor: '#fff',
				backgroundColor: "#d83d8315",
				borderWidth: 3,
					data: minimumExposure,
				},{
				label: 'Amount of minutes under current conditions to reach 4000 IU',
				borderColor: '#fff',
				backgroundColor: "#d83d8315",
				borderWidth: 3,
					data: maximumExposure
				}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						max: 180
					}
				}]
			}
		}
	});

	Chart.defaults.global.defaultFontColor = "#fff";
}

function getUVData(url){
	const localData = window.localStorage.getItem('uv_forecast');

	if ( localData ) {
		forecast.push(JSON.parse(localData));

		now = new Date();
		forecastDate = new Date(forecast[0].result[forecast[0].result.length -1].uv_time);

		if ( now.getDate() > forecastDate.getDate() ){
			getUVDataFromExternal(url);
		}
	} else {
		getUVDataFromExternal(url);
	}

	for ( i = 0; i < forecast[0].result.length; i++ ){
		let uvHour = new Date(forecast[0].result[i].uv_time);
		uvIndexes.push(forecast[0].result[i].uv);
		uvTimes.push(forecast[0].result[i].uv_time.substring(11, 16));

		if ( now.getHours() === uvHour.getHours() ){
			uvNumber = forecast[0].result[i].uv;
			roundedUvNumber = Math.round((uvNumber + Number.EPSILON) * 10) / 10;
		}
	}

	renderUvChart(uvIndexes, uvTimes);
	renderTimeChart(minimumExposure(roundedUvNumber), maximumExposure(roundedUvNumber));
	renderTimeNumber(roundedUvNumber);
}


function renderTimeNumber(uvNumber){
	singleUvIndex.innerHTML = Math.round((uvNumber + Number.EPSILON) * 10) / 10;
}

/* * * * * * * * * * * * * * * * * * * */
/* EVENTS                              */
/* * * * * * * * * * * * * * * * * * * */

clothesSlider.oninput = function() { // I could add onchange for IE10 support spfSlider.onchange = function() { }

}

spfSlider.oninput = function() {
	spfNumber.textContent = spfSlider.value;
}

cloudCoverageSlider.oninput = function() {
}

ageSlider.oninput = function() {
	ageNumber.textContent = ageSlider.value;
	recalculate('age', ageSlider.value);
}

bmiSlider.oninput = function() {
	bmiNumber.textContent = bmiSlider.value;
	recalculate('bmi', bmiSlider.value);
}

function recalculate(type, value){
	let output = '';

	if ( type === 'bmi' ) {
		if ( value <= 999 ) { multiplier = 2; }
		if ( value <= 30 ) { multiplier = 1.5; }
		if ( value <= 20 ) { multiplier = 0.7; }
		if ( value <= 10 ) { multiplier = 0.5; }
	}

	if ( type === 'age' ) {
		if ( value <= 999 ) { multiplier = 2; }
		if ( value <= 80 ) { multiplier = 1.5; }
		if ( value <= 50 ) { multiplier = 0.7; }
		if ( value <= 30 ) { multiplier = 0.5; }
		if ( value <= 10 ) { multiplier = 0.3; }
	}

	updateChart(multiplier);
}

let originalChartArray = [['undefined'],['undefined']];
let newChartArray = [['undefined'],['undefined']];

function updateChart(multiplier) {

	timeChart.data.datasets.forEach((dataset, i) => {
		
		// reset
		if ( dataset.data == newChartArray[i] ){
			dataset.data = originalChartArray[i] 
		}

		dataset.data.forEach(function(value, index){

			if ( originalChartArray[i][index] === undefined || originalChartArray[i][index] === 'undefined' ) {
				if ( newChartArray[i].length < dataset.data.length ) {
					if ( newChartArray[i][index] == 'undefined') {
						newChartArray[i].pop();
						originalChartArray[i].pop();
					}

					newChartArray[i].push(dataset.data[index] * multiplier);
					originalChartArray[i].push(dataset.data[index]);
				}
			} else {
				originalChartArray[i][index] = dataset.data[index];
				newChartArray[i][index] = dataset.data[index] * multiplier;
			}

console.log(i, 
			'data',dataset.data[index], 
			'multiplier',multiplier, 
			'orig',originalChartArray[i][index], 
			'new',newChartArray[i][index]);

		});
		dataset.data = newChartArray[i];
	});
	timeChart.update();
}

/* * * * * * * * * * * * * * * * * * * */
/* API CALL                            */
/* * * * * * * * * * * * * * * * * * * */
function getUVDataFromExternal(url){
	// console.log('getting data from url: ' , url);

	var getUv = new XMLHttpRequest();

	getUv.open('GET', url);
	
	getUv.setRequestHeader('x-access-token', token);

	getUv.onload = function(){
		var bla = (getUv.responseText);
		// console.log('bla from API : ', bla);
		window.localStorage.setItem('uv_forecast', bla);
	}

	getUv.send();
}
getUVData(urlGetForecastUv);


/* * * * * * * * * * * * * * * * * * * */
/* UV REQUIREMENT CALCULATION          */
/* * * * * * * * * * * * * * * * * * * */

function minimumExposure(uvi, skinType, age, spf, bmi, skin){
	let output = [];
	let skinTypeMultiplier = 0;
	let uviStart = 0;
	let i = 1;

	if ( uvi <= 15 ) { uviStart = 0.5; }
	if ( uvi <= 14 ) { uviStart = 0.6; }
	if ( uvi <= 13 ) { uviStart = 0.7; }
	if ( uvi <= 12 ) { uviStart = 0.8; }
	if ( uvi <= 11 ) { uviStart = 0.9; }
	if ( uvi <= 10 ) { uviStart = 1; }
	if ( uvi <= 9 ) { uviStart = 1.2; }
	if ( uvi <= 8 ) { uviStart = 1.7; }
	if ( uvi <= 7 ) { uviStart = 1.8; }
	if ( uvi <= 6 ) { uviStart = 2; }
	if ( uvi <= 5 ) { uviStart = 3; }
	if ( uvi <= 4 ) { uviStart = 4; }
	if ( uvi <= 3 ) { uviStart = 5; }
	if ( uvi <= 2 ) { uviStart = 8; }
	if ( uvi <= 1 ) { uviStart = 20; }

	while ( i < 6) {
		let skinType = i;

		if ( skinType === 1 ) { skinTypeMultiplier = 0.5; }
		if ( skinType === 2 ) { skinTypeMultiplier = 1; }
		if ( skinType === 3 ) { skinTypeMultiplier = 2; }
		if ( skinType === 4 ) { skinTypeMultiplier = 3; }
		if ( skinType === 5 ) { skinTypeMultiplier = 4; }
		if ( skinType === 6 ) { skinTypeMultiplier = 6; }

		output.push(uviStart * skinTypeMultiplier);
		// console.log('uviStart: ', uviStart, 'skinTypeMultiplier: ', skinTypeMultiplier, 'calc: ', uviStart * skinTypeMultiplier);
		i++;
	}

	// console.log('uvi', uvi);
	// console.log('uviStart', uviStart);
	// console.log('skinTypeMultiplier in min exp', skinTypeMultiplier);
	// console.log('output', output);
	return output;
}

function maximumExposure(uvi, skinType, age, spf, bmi, skin){
	let output = [];
	let skinTypeMultiplier = 0;
	let uviStart = 0;
	let i = 1;

	// console.log('uvi', uvi);

	if ( uvi <= 1 ) { uviStart = 200; }
	if ( uvi <= 2 ) { uviStart = 80; }
	if ( uvi <= 3 ) { uviStart = 42; }
	if ( uvi <= 4 ) { uviStart = 30; }
	if ( uvi <= 5 ) { uviStart = 25; }
	if ( uvi <= 6 ) { uviStart = 20; }
	if ( uvi <= 7 ) { uviStart = 18; }
	if ( uvi <= 8 ) { uviStart = 17; }
	if ( uvi <= 9 ) { uviStart = 16; }
	if ( uvi <= 10 ) { uviStart = 15; }
	if ( uvi <= 11 ) { uviStart = 14; }
	if ( uvi <= 12 ) { uviStart = 13; }
	if ( uvi <= 13 ) { uviStart = 12; }
	if ( uvi <= 14 ) { uviStart = 11; }
	if ( uvi <= 15 ) { uviStart = 10; }

	while ( i < 6) {
		let skinType = i;

		if ( skinType === 1 ) { skinTypeMultiplier = 0.5; }
		if ( skinType === 2 ) { skinTypeMultiplier = 1; }
		if ( skinType === 3 ) { skinTypeMultiplier = 2; }
		if ( skinType === 4 ) { skinTypeMultiplier = 3; }
		if ( skinType === 5 ) { skinTypeMultiplier = 4; }
		if ( skinType === 6 ) { skinTypeMultiplier = 6; }

		output.push(uviStart * skinTypeMultiplier);
		i++;
	}

	// console.log('skinTypeMultiplier in max exp', skinTypeMultiplier);
	return output;
}