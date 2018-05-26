// TODO: Clean up async calls. Use async,await, promises
game_threads = [];
filtered_comments = [];
gotGameThreads = false;
gotComments = false;
streamers = ["buffstreams", "velocityraps", "rippledotis"];
const team_abbr = {
    "Hawks": "ATL",
    "Nets": "BKN",
    "Celtics": "BOS",
    "Hornets": "CHA",
    "Bulls": "CHI",
    "Cavaliers": "CLE",
    "Mavericks": "DAL",
    "Nuggets": "DEN",
    "Pistons": "DET",
    "Warriors": "GSW",
    "Rockets": "HOU",
    "Pacers": "IND",
    "Clippers": "LAC",
    "Lakers": "LAL",
    "Grizzlies": "MEM",
    "Heat": "MIA",
    "Bucks": "MIL",
    "Timberwolves": "MIN",
    "Pelicans": "NOP",
    "Knicks": "NYK",
    "Thunder": "OKC",
    "Magic": "ORL",
    "76ers": "PHI",
    "Suns": "PHX",
    "Blazers": "POR",
    "Kings": "SAC",
    "Spurs": "SAS",
    "Raptors": "TOR",
    "Jazz": "UTA",
    "Wizards": "WAS"
}

function addStreamer(name) {
    if (streamers.includes(name)) {
        return false;
    } else {
        streamers.push(name);
        return true;
    }
}

function removeStreamer(name) {
    index = streamers.indexOf(name);
    if (index > -1) {
        streamers.splice(index, 1);
        return true;;
    } else {
        return false;
    }
}

function generateTable(title) {
    console.log(title);
}

// ------BELOW ARE FUNCTIONS TO GET THE STREAM LINKS------

function getGameThreads(res) {
    rdc = res.data.children;
    
    for (var i = 0; i < rdc.length; i++) {
        if (rdc[i].data.link_flair_css_class == "gamethread" &&
            rdc[i].data.link_flair_text != "Channel Thread") {
            game_threads.push(rdc[i]);
        }
    }
    gotGameThreads = true;
}

function parseTitle(title) {
    // Find two teams playing, returns String "TEAM1 @ TEAM2"
    teams = [];
    for (team in team_abbr) {
        if (title.includes(team)) {
            teams.push(team_abbr[team]);
        }
    }
    return teams[0] + " vs " + teams[1];
}

function getStreams() {
    if (!gotGameThreads) {
        window.setTimeout(getStreams, 100); /* this checks the flag every 100 milliseconds*/
    } else {
        console.log("Number of games today: " + game_threads.length);
        for (var i = 0; i < game_threads.length; i++) {
            filtered_comments.push({"title": parseTitle(game_threads[i].data.title),
                                    "permalink": game_threads[i].data.permalink,
                                    "comments": [],
                                    "links": {}
                                });
            filterComments(i);
        }
    }
}

function filterComments(index) {
    reddit.comments(game_threads[index].data.id, "nbastreams").sort("hot").fetch(function(res) {
        comments = res[1].data.children;
        console.log("Number of comments in thread:" + comments.length);
        for (var j = 0; j < comments.length; j++) {
            if (streamers.includes(comments[j].data.author)) {
                filtered_comments[index]["comments"].push(comments[j]);
            }
        }
        gotComments = true;
    });
}

function getURLs() {
    if (!gotComments) {
        window.setTimeout(getURLs, 100);
    } else {
        for (var i = 0; i < filtered_comments.length; i++) {
            var cmts = filtered_comments[i]["comments"];
            for (var j = 0; j < cmts.length; j++) {
                var stream_name = cmts[j].data.author;
                var links = cmts[j].data.body.match(/(?<=\()http.+?(?=\))/g);
                filtered_comments[i]["links"][stream_name] = links;
            }
        }
    }
}

// Populate filtered_comments
reddit.hot('nbastreams').fetch(getGameThreads);
getStreams()
getURLs();
console.log(filtered_comments);
// 


// Add events to buttons
$('#select-game').click(generateTable);
