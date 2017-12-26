var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

app.get('/', function(req, res)
{
	var url = 'https://www.reddit.com/r/wallpapers/top/?sort=top&t=day';
	request(url, function(err, msg, html)
	{
		const images = getImages(html);

		images.forEach(function(image)
		{
			var filename = convertFileName(image);
			request(image).pipe(fs.createWriteStream("images/" + filename + '.png'));
			file = filename
		})

		
		res.send("a");
	});
});

app.listen('3000');

function getImages(html)
{
	const $ = cheerio.load(html);

	links = $('a');
	var filteredLinks = [];
	var idx = 0;
  	$(links).each(function(i, link){
    	link = String($(link).attr('href'));
    	if (link.includes("imgur") && link.includes("http") && !link.includes("/a/"))
    	{
    		filteredLinks.push(addJpg(link));
    	}
  	});
  	console.log(filteredLinks);
	return filteredLinks;
}

function addJpg(str)
{
	if (!str.includes("jpg")) return str + ".jpg";
	else return str;
}

function convertFileName(a)
{
	var filename = a.slice(8, a.length - 4);
	filename = filename.split('.').join('');
	filename = filename.split('/').join('');
	return filename;
}