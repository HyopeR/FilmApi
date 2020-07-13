const fetch = require('node-fetch');

let Services = function(){};

Services.getMp4 = async(url, result) => {

    const getPageData = await fetch(url);
    getPageData.text().then(data => {

        let startChar = data.search("sources");
        let finishChar = data.search("bitrate");
        let filterResult = data.substring(startChar + 9, finishChar - 6);

        if(filterResult.search("m3u8") !== -1) {
            filterResult = filterResult.substring(filterResult.search("m3u8") + 7,  finishChar)
        }
        if(filterResult.search("image") !== -1){
            filterResult = filterResult.substring(0, filterResult.search("image") - 6)
        }

        filterResult = filterResult.split(",");

        let resultObject = {};
        let mp4List = [];

        let quatlityCounter = 0;

        for(let i = 0; i < filterResult.length; i++){
            if(filterResult[i].search('mp4') !== -1) {
                let mp4 = filterResult[i].substring(
                    filterResult[i].search('{file:') + 7, filterResult[i].search('mp4') + 3
                );
                mp4List.push(mp4.toString())
            }

            if(filterResult[i].search('label:') !== -1) {
                let quality = filterResult[i].substring(
                    filterResult[i].search('label:') + 7, 11
                );
                resultObject[quality.toString()] = mp4List[quatlityCounter];
                quatlityCounter++;
            }
        }

        result(null, resultObject);
    });

};

module.exports= Services;
