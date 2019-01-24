// var snoowrap = require('snoowrap'); // snoowrap-v1
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
    $('#main').html(game_threads.length + " games found");
}

function filterComments(index) {
    reddit.comments(game_threads[index].data.id, "nbastreams").sort("hot").fetch(function(res) {
        comments = res[1].data.children;
        // console.log("Number of comments in thread:" + comments.length);
        // for (var j = 0; j < comments.length; j++) {
        //     if ($.inArray(comments[j].data.author, bots) != -1) {
        //         filtered_comments[index].comments.push(comments[j]);
        //         break;
        //     }
        // }
        filtered_comments[index].comments = res[1].data.children;
        getURL(filtered_comments[index]);
        counter++;

        if (counter == filtered_comments.length) {
            displayGames();
            $('#select-game').change(generateTable);
        }
    });
}

function getURL(obj) {
    var cmts = obj.comments;
    var links = []
    for (var j = 0; j < cmts.length; j++) {
        if ($.inArray(cmts[j].data.author, bots) != -1) {
            var streams = cmts[j].data.body.match(/(?<=\/u\/).*/g);
            console.log(streams);
            for (var k = 0; k < streams.length; k++) {
                var name = streams[k].match(/([^\| ]+)/g)[0]; // Gets the first word
                var thread_id = streams[k].match(/(?<=\/comments\/).+?(?=\/)/g)[0];
                var comment_id = streams[k].match(/[^\/]+?(?=\/\))/g)[0];
                obj.links[name] = getLinksFromComment(cmts, comment_id);
            }
        }
    }
}

function getLinksFromComment(obj, cid) {
    for (var i in obj) {
        if (comments[i].data.id == cid) {
            var body = comments[i].data.body;
            var links = body.match(/(?<=\()http.+?(?=\))/g); // Matches anything in parentheses
            return links;
        }
    }
    return [];
}

// Populate filtered_comments
reddit.hot('nbastreams').fetch(getGameThreads);