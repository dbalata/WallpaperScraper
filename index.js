var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'https://www.reddit.com/r/wallpapers/top/?sort=top&t=all';
downloadImages(url);

function downloadImages(url)
{
	request(url, function(err, msg, html)
	{
		const images = isAlbumLink(url) ? getAlbumImages(html) : getImages(html);

		images.forEach(function(image)
		{
			var filename = convertFileName(image);
			request(image).pipe(fs.createWriteStream("images/" + filename));
		})
	});
}

function getImages(html)
{
	const $ = cheerio.load(html);

	links = $('a');
	var filteredLinks = [];
	var idx = 0;
  	$(links).each(function(i, link){
    	link = String($(link).attr('href'));
    	if (isImageLink(link)) filteredLinks.push(link);
    	else if (isAlbumLink(link)) downloadImages(link);
  	});
	return filteredLinks;
}

function getAlbumImages(html)
{
	const $ = cheerio.load(html);

	links = $('a');
	var filteredLinks = [];
	var idx = 0;
  	$(links).each(function(i, link){
    	link = String($(link).attr('href'));
    	if (isImageLink(link)) filteredLinks.push(addHttp(link));
  	});
	return filteredLinks;
}

function isImageLink(link)
{
	return link.includes('.jpg') || link.includes('.png')
}

function isAlbumLink(link)
{
	return link.includes('/a/');
}

function addJpg(str)
{
	if (!str.includes("jpg")) return str + ".jpg";
	else return str;
}

// imgur links within albums don't contain http: prefix
function addHttp(str)
{
	if(str.substring(0, 2) == "//") return "http:" + str;
	else return str;
}

function convertFileName(a)
{
	// get last portion for unique name
	return a.split('/')[3];
}