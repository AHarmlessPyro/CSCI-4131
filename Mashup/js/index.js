/// Misc Region ///
String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (let i = 0; i < this.length; i++) {
        let char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function clamp(num, clamp) {
    if (num < clamp) {
        return num;
    } return clamp;
}

function formatDate(date) {
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function NatoToKey(NatoKey) {
    key = "";
    NatoKey.forEach(element => {
        key += keyInfo[element];
    });
    return key;
}

function keyToNato(key, dict) {
    let val = [];
    for (let i = 0; i < key.length; i++) {
        val.push(dict[key.charAt(i)]);
    }
    return val;
}

function distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }
}

/// Startup Region ///
const SIZEOFVALUES = 10;

var map;
var infowindows = [];
var markers = [];
var circles = [];

var workingSetPos = [];
var workingSet = [];
var BasicHeader;

var bearerToken;
var cityInfo;
var keyInfo;
var bounds;

function initMap() {
    map = new google.maps.Map(document.getElementById('mapsDiv'), {
        center: { lat: 39.83334, lng: -98.58334 },
        gestureHandling: 'auto',
        zoomControl: false,
        zoom: 2
    });

    bounds = new google.maps.LatLngBounds();
}

/// Further Work ///
function reworkList() {
    list = document.getElementById('txtar').value;
    list = list.split(',');

    list.forEach(element => {
        if (element == "\n") {
            return;
        }
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${element}&key=${NatoToKey(keyFakeGoogle)}`)
            .then(response => {
                response.json()
                    .then(data => {
                        //console.log(data);

                        dist = 0;
                        if (data.results[0].address_components[0].types.includes["locality", "political", "administrative_area_level_1", "postal_town"]) {
                            dist = 30;
                        } else {
                            dist = clamp(distance(data.results[0].geometry.viewport.northeast.lat, data.results[0].geometry.viewport.northeast.lng, data.results[0].geometry.viewport.southwest.lat, data.results[0].geometry.viewport.southwest.lng), 30);
                        }

                        //console.log(citySize);
                        fetchFromTwitter(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng, dist, element);
                        console.log(`city : ${element} has size ${dist}`);
                    })
            })
    });

    //console.log(list);
}

window.onload = function () {
    fetch('./data/dat.json')
        .then(response => {
            response.json()
                .then(data => { cityInfo = data; })
                .then(() => {
                    fetch('./data/keyMap.json')
                        .then(response => {
                            response.json()
                                .then(data => { keyInfo = data; })
                                .then(() => {
                                    let text = `Bearer AAAAAAAAAAAAAAAAAAAAANV1AQEAAAAAtNAA%2BgRFfjkl4vEOOeg8Hvz5kY0%3DTX9fHSNBBky7Z1Om6YlkJYEE72P1MH5EpIDwNH0qwKMhspTdS4`
                                    fetch("https://evening-badlands-84665.herokuapp.com/https://api.twitter.com/oauth2/token", {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': text,
                                            'Content-Type': `application/x-www-form-urlencoded;charset=UTF-8`,
                                            'Accept-Encoding': 'gzip'
                                        },
                                        body: 'grant_type=client_credentials'
                                    }, error => { console.log(error); })
                                        .then(response => {
                                            response.json()
                                                .then(dat => {
                                                    bearerToken = dat.access_token;
                                                    createMap();
                                                });
                                        }, error => { console.log(error); })
                                }, error => { console.log(error); });
                        })
                });
        })
}

function fetchFromTwitter(lat, lng, rad, city) {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    //fetch(`https://evening-badlands-84665.herokuapp.com/https://api.twitter.com/1.1/search/tweets.json?q=${document.getElementById('topicBox').value}&geocode=${cityInfo[temp].center.lat},${cityInfo[temp].center.lng},${Math.ceil(Math.sqrt(cityInfo[temp]["city size in km"]))}km&since=${formatDate(date)}&result_type=recent&count=100`,
    fetch(`https://evening-badlands-84665.herokuapp.com/https://api.twitter.com/1.1/search/tweets.json?q=${document.getElementById('topicBox').value}&geocode=${lat},${lng},${rad}km&since=${formatDate(date)}&result_type=recent&count=100`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Accept-Encoding': 'gzip',
                'x-requested-with': 'localhost'
            }
        })
        .then(
            response => {
                response.json()
                    .then(dat => {
                        let obj = {
                            "center": {
                                "lat": lat,
                                "lng": lng
                            },
                            "city": city,
                            "city size in km": rad,
                            "data": dat.statuses
                        };
                        workingSet.push(obj);
                        mapExtras_Neue(obj);
                    }
                    )
            }, (error) => { console.log(error); }
        );
}

function mapExtras_Neue(city) {
    let tmp = city.data;
    let text = '<div class="content">';
    if (tmp.length > 0) {
        for (let element in tmp) {
            //console.log(tmp[element]);
            text += createPopUp(tmp[element].text ? tmp[element].text : tmp[element].retweeted_status.text, `twitter.com/text/status/${tmp[element].id_str}`, `twitter.com/${tmp[element].user.screen_name}`, tmp[element].user.profile_image_url);
        };
    } else {
        text += `Nothing Here !`
    }

    bounds.extend(city.center);
    map.fitBounds(bounds);


    let infowindow = new google.maps.InfoWindow({
        content: text
    });

    let marker = new google.maps.Marker({
        position: city.center,
        map: map,
        title: city.city
    });

    let cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: city.center,
        radius: clamp(Math.log(city.data.length), 300) * 10000
    });

    //console.log(cityCircle.radius);

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    markers.push(marker);
    infowindows.push(infowindow);
    circles.push(cityCircle);

}

function fetchEverything() {
    workingSet.length = 0;
    workingSetPos.length = 0;
    //console.log(document.getElementById('txtar').value);
    if (document.getElementById('txtar').value) {
        reworkList();
    }
    else {
        while (workingSetPos.length < SIZEOFVALUES) {
            let temp = Math.floor(Math.random() * cityInfo.length);
            if (!workingSetPos.includes(temp)) {
                workingSetPos.push(temp);
            } else {
                continue;
            }
        }
    }
    for (let temp = 0; temp < workingSetPos.length; temp++) {
        fetchFromTwitter(
            cityInfo[temp].center.lat,
            cityInfo[temp].center.lng,
            cityInfo[temp]["city size in km"],
            cityInfo[temp].city
        );
    }
};

function createMap() {
    let createScript = document.createElement('script');
    createScript.src = `https://maps.googleapis.com/maps/api/js?key=${
        NatoToKey(keyFakeGoogle)}&callback=initMap`;
    createScript.defer = true;
    document.body.insertAdjacentElement("beforeend", createScript);
};

function createPopUp(text, url, user, image) {
    var subcontent =
        `<div class = "subcontent" style="display:grid;grid-template-columns:15% 85%;">` +
        `<a href="${'https://' + user}">
            <div class="profile-image" style="background-image:url(${image})"> </div>
        </a>` +
        `<a href="${'https://' + url}">
            <div>${text}</div>
        </a>` +
        `</div>`;
    return subcontent;
}

/// A lot of extra information ///
const keyFakeGoogle = [
"Alpha",
"India",
"Zulu",
"Alpha",
"Sierra",
"Yankee",
"Bravo",
"X-ray",
"Foxtrot",
"November",
"Kilo",
"Romeo",
"Eight",
"Zulu",
"One",
"Three",
"Hotel",
"Whiskey",
"Echo",
"Lima",
"Quebec",
"Alpha",
"Foxtrot",
"India",
"Papa",
"Uniform",
"Echo",
"Eight",
"Eight",
"Oscar",
"Zero",
"Hotel",
"Sierra",
"Kilo",
"Kilo",
"Victor",
"Echo",
"Oscar",
"Four"
]

const consumerKey = [
    'quebec',
    'Zulu',
    'india',
    'tango',
    'november',
    'Sierra',
    'Kilo',
    'bravo',
    'papa',
    'lima',
    'Victor',
    'Oscar',
    'Nine',
    'Oscar',
    'Uniform',
    'Sierra',
    'delta',
    'Zulu',
    'quebec',
    'Six',
    'yankee',
    'tango',
    'Delta',
    'oscar',
    'Papa']
const consumerSecret = [
    'Alpha',
    'Uniform',
    'Charlie',
    'november',
    'lima',
    'bravo',
    'Seven',
    'Charlie',
    'Sierra',
    'Lima',
    'Sierra',
    'Victor',
    'November',
    'victor',
    'x-ray',
    'Eight',
    'bravo',
    'hotel',
    'Sierra',
    'alpha',
    'lima',
    'charlie',
    'Echo',
    'Seven',
    'whiskey',
    'Papa',
    'yankee',
    'Lima',
    'Five',
    'Yankee',
    'Charlie',
    'Yankee',
    'Four',
    'delta',
    'Eight',
    'delta',
    'Tango',
    'lima',
    'whiskey',
    'whiskey',
    'november',
    'Zero',
    'whiskey',
    'alpha',
    'Seven',
    'sierra',
    'zulu',
    'One',
    'delta',
    'delta']
const accessToken = [
    'Seven',
    'Three',
    'Eight',
    'Five',
    'Three',
    'Five',
    'Two',
    'Zero',
    'Six',
    'One',
    'Nine',
    'Zero',
    'Two',
    'One',
    'One',
    'Zero',
    'Seven',
    'Two',
    'Dash',
    'hotel',
    'Zulu',
    'whiskey',
    'Five',
    'Zero',
    'bravo',
    'delta',
    'oscar',
    'Sierra',
    'whiskey',
    'Echo',
    'Yankee',
    'alpha',
    'Mike',
    'india',
    'india',
    'sierra',
    'delta',
    'delta',
    'Uniform',
    'papa',
    'papa',
    'Yankee',
    'echo',
    'Seven',
    'whiskey',
    'Six',
    'whiskey',
    'Papa',
    'mike',
    'Alpha']
const tokenSecret = [
    'One',
    'One',
    'Zulu',
    'Foxtrot',
    'Lima',
    'hotel',
    'Alpha',
    'Eight',
    'uniform',
    'whiskey',
    'Hotel',
    'Kilo',
    'romeo',
    'alpha',
    'Sierra',
    'Papa',
    'Alpha',
    'papa',
    'Uniform',
    'whiskey',
    'november',
    'Mike',
    'hotel',
    'kilo',
    'alpha',
    'Echo',
    'juliett',
    'lima',
    'mike',
    'lima',
    'Tango',
    'Nine',
    'romeo',
    'Alpha',
    'oscar',
    'November',
    'Zulu',
    'quebec',
    'One',
    'yankee',
    'Seven',
    'foxtrot',
    'Papa',
    'foxtrot',
    'Zero']
