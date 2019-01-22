const NBA = require("nba");
var game_threads = [];
var filtered_comments = [];
var counter = 0;
var bots = ["NBAstreamsBot", "nbanicks"];

function displayGames() {
    for (var i = 0; i < filtered_comments.length; i++) {
        var title = filtered_comments[i].title();
        var game = $('<option></option>')
                    .attr("value", title)
                    .text(title);
        $('#select-game').append(game);
    }
}

function generateTable() {
    $('#main').empty();
    game = findGame(this.value);
    if (game == null || Object.keys(game.links).length == 0) {
        $('#main').text("No streams found");
    } else {
        $("#main").append(tableMaker(game));
    }
    $('#game-thread').prop("disabled", false);
    $('#game-thread').click(() => {
        window.open("http://www.reddit.com" + game["permalink"]);
    });
}

function tableMaker(game) {
    var table = $('<table></table>');
    for (var streamer in game.links)
        table.append(rowMaker(streamer));
    return table;
}

function rowMaker(streamer) {
    row = $('<tr></tr>').append($('<th></th>').text(streamer));
    for (var j = 0; j < game.links[streamer].length; j++) {
        link = $('<td></td>').append(
                $('<a></a>')
                    .attr({
                        class: "link",
                        target: "_blank",
                        href: game.links[streamer][j]
                    })
                    .text("Link " + (j+1)));
        row.append(link);
    }
    return row;
}

function findGame(title) {
    for (var i = 0; i < filtered_comments.length; i++) {
        if (filtered_comments[i].title() == title)
            return filtered_comments[i];
    }
    return null;
}

// ------BELOW ARE FUNCTIONS TO GET THE STREAM LINKS------

function getGameThreads(res) {
    rdc = res.data.children;
    
    for (var i = 0; i < rdc.length; i++) {
        if (rdc[i].data.link_flair_css_class == "gamethread" &&
            rdc[i].data.link_flair_text != "Channel Thread")
            game_threads.push(rdc[i]);
    }
    
    getStreams();
}

function getStreams() {
    console.log("Number of games today: " + game_threads.length);
    for (var i = 0; i < game_threads.length; i++) {
        var game = new Game(game_threads[i].data.title, game_threads[i].data.permalink);
        filtered_comments.push(game);
        filterComments(i);
    }
}

function filterComments(index) {
    reddit.comments(game_threads[index].data.id, "nbastreams").sort("hot").fetch(function(res) {
        comments = res[1].data.children;
        console.log("Number of comments in thread:" + comments.length);
        for (var j = 0; j < comments.length; j++) {
            if ($.inArray(comments[j].data.author, bots) != -1) {
                filtered_comments[index].comments.push(comments[j]);
                break;
            }
        }
        getURL(filtered_comments[index]);
        counter++;

        if (counter == filtered_comments.length) {
            displayGames();
            $('#select-game').change(generateTable);
            $('#main').html(game_threads.length + " games found");
        }
    });
}

function getURL(obj) {
    var cmts = obj.comments;
    var links = []
    for (var j = 0; j < cmts.length; j++) {
        var streams = cmts[j].data.body.match(/(?<=\/u\/).*/g);
        for (var k = 0; k < streams.length; k++) {
            var name = streams[k].match(/([^\| ]+)/g)[0]; // Gets the first word
            var links = streams[k].match(/(?<=\()http.+?(?=\))/g); // Matches anything in parentheses
            obj.links[name] = links;
        }
    }
}

// Populate filtered_comments
reddit.hot('nbastreams').fetch(getGameThreads);

const curry = NBA.findPlayer('Stephen Curry');
console.log(curry);
/* logs the following:
{
  firstName: 'Stephen',
  lastName: 'Curry',
  playerId: 201939,
  teamId: 1610612744,
  fullName: 'Stephen Curry',
  downcaseName: 'stephen curry'
}
*/
params = {gameDate: "12/26/2018"}
NBA.stats.scoreboard(params).then(console.log);
