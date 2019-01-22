const http = new XMLHttpRequest();
const url='https://stats.nba.com/stats/scoreboard/?GameDate=12/17/2018&LeagueID=00&DayOffset=0';
http.open("GET", url);
http.setRequestHeader("Access-Control-Allow-Origin", "*");
http.send();
http.onreadystatechange=(e)=>{
	console.log("my response");
	console.log(http.responseText);
}
