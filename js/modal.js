showStreamers = () => {
	$('#top-bar, #main').fadeOut(500, () => {
		$('#streamers-modal').fadeIn();
	});
}

hideStreamers = () => {
	$('#streamers-modal').fadeOut(500, () => {
		$('#top-bar, #main').fadeIn();
	});
}

$('#streamers').click(showStreamers);
$('.ex').click(hideStreamers);