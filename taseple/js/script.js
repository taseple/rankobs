var alp = [];

$(function() {
    if(!settings.api_key | settings.api_key == 'YOUR_KEY_HERE') {
        $('#summoner_name').text('Error, please check if your API key is set')
    }
	
	if(!settings.summoner_id | settings.summoner_id == 'YOUR_SUMMONERID_HERE') {
		$('#summoner_name').text('Error, please check if your summoner id is set')
	}
	
    getData();
    setInterval(function() {
        getData();
    }, settings.interval);
})

function getData(){
	
	var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
	function doCORSRequest(options, printResult) {
		var x = new XMLHttpRequest();
		x.open(options.method, cors_api_url + options.url);
		x.onload = x.onerror = function() {
		  printResult(
			options.method + ' ' + options.url + '\n' +
			x.status + ' ' + x.statusText + '\n\n' +
			(x.responseText || '')
		  );
		};
		if (/^POST/i.test(options.method)) {
		  x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		x.send(options.data);
	  }
	
    doCORSRequest({
       method: 'GET',
       url: 'https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + settings.summoner_name + '?api_key=RGAPI-d36b4957-4c3b-4239-bcd3-54aea8f5892f'
    }, function printResult(result) {
		var res = result.split("OK");
		var res2 = res[1].split(",");
		var res3 = res2[0].split(":");
		settings.summoner_id = res3[1];
	});
	
	getRankedInfo();
}

function getRankedInfo(){

	var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
	function doCORSRequest(options, printResult) {
		var x = new XMLHttpRequest();
		x.open(options.method, cors_api_url + options.url);
		x.onload = x.onerror = function() {
		  printResult(
			options.method + ' ' + options.url + '\n' +
			x.status + ' ' + x.statusText + '\n\n' +
			(x.responseText || '')
		  );
		};
		if (/^POST/i.test(options.method)) {
		  x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		x.send(options.data);
	  }
	
    doCORSRequest({
       method: 'GET',
       url: 'https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/' + settings.summoner_id + '?api_key=RGAPI-d36b4957-4c3b-4239-bcd3-54aea8f5892f'
    }, function printResult(result) {
		var res = result.split("OK");
		var array = res[1].split(",");
		
		// tier
		var atier = array[2].split(":");		
		var tier = atier[1].split(/"/g);
		
		settings.summoner_tier = tier[1];
		
		// division
		var adiv = array[4].split(":");		
		var div = adiv[1].split(/"/g);
		
		settings.summoner_division = div[1];
		
		// lp
		var alp = array[7].split(":");		
		settings.summoner_lp = alp[1];
		
		$('body').css('color', settings.text_color);
		$('.container').css('width', settings.container_width);
		$('#summoner_name').text(settings.summoner_name).css('font-size', settings.summoner_name_size);
		$('#summoner_lp').text(settings.summoner_lp + ' LP').css('font-size', settings.summoner_lp_size);
		$('#summoner_tier').text(settings.summoner_tier).css('font-size', settings.summoner_tier_size);
		$('#summoner_division').text(settings.summoner_division).css('font-size', settings.summoner_division_size);
		$('#division_img').attr('src', 'tiers/' + settings.summoner_tier.toLowerCase() + '_' + settings.summoner_division.toLowerCase() + '.png')
		
	});
}
