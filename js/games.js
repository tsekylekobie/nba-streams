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

class Game {
	constructor(title, link) {
		var teams = this._parseTitle(title)
        this.away = teams[0];
		this.home = teams[1];
		this.permalink = link;
		this.comments = [];
		this.links = {}; // Maps streamer to link(s)
	}

    _parseTitle(title) {
        var teams = [];
        for (var team in team_abbr) {
            if (title.includes(team))
                teams.push(team_abbr[team]);
        }
        if (teams.length == 2) 
            return teams
    }
	
    title() {
		return this.away + " vs " + this.home;
	}
}