// ==UserScript==
// @name Rarbg.to
// @trackerURL http://www.rarbg.to
// @icon data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAQAUAAAAAAAAAAAAAAAEAAAABAABZW1sAWllbAFtcWgBbWlwAXlxbAFtbWwBdWlwAXVtbAFpcXAD///4A3+HhAP7+/gD///8A4+DiAP3//gDi4OAA/f//AODf4QAAMP4AAy7/AAAr4ADe4d8A///8ANzg4QD//v8A3uDgAFlbXAAAMP8AAC7/AAEp4AD7//8A4uDfAFhbWQABMP4AAiveAAAy/gADL/4A//79AOHf3wD6//4A4eHhAAAx/QAAMf8A4OHfAPz+/wDe4OEA4+HhAFpaWgAAKOIAAjD/APz//QAEL/8AASrdAAIv/wDf398AXFxcAAEp3wAAL/8A3t/jAOLf4QAALN4AAjH/AAAq3wAALv4A4ODgAFlcWgAAKuEA//3/AAEx/wDd398AXVleAFhdXAD9/v8AAirgAAAp4ABdW1oA3d7iAFxbXQBYWloAXF1bAFxYXQBbXFgAV1tcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAgMEBQUFAwAGBwgABgIJCQoLDA0MDg8JCQ8MEAUHERITFBAQFQkWFxgMGQwHGhgUGxwdCRgRGB4fGAwPIAcQISIjJBEMDBUlDCYnGAgHKBIpHSoYKxAsLQwJLhgvAhgwMRIdMjM0NQw2DAstNxoJKjgcKhU5GzgSDDoMFgAFOxIqHTkMPD0bPhIMFQwDAwkUPyMdDAwZCRBADAwPQQUWG0IpMR05OSI9OUBDDgIGDRIqPikjHRshPjlERRhGR0hJHCpCPyo+IT1CEjFAAgUJOUkSGxQSMUoSOUIqDktBDwlIDRYJOwwWTBAlQAwaTUEFRwYFAwUFTk9QUVIHBQAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8=
// @description Rarbg.to
// @downloadURL https://github.com/Feverqwe/tSearch/raw/master/src/trackers/filebase.js
// @connect *://*.rarbg.to/*
// @require exKit
// @version 1.0.1
// ==/UserScript==

API_exKit({
    id: 'rarbg.to',
    title: 'Rarbg.to',
    icon: 'data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAQAUAAAAAAAAAAAAAAAEAAAABAABZW1sAWllbAFtcWgBbWlwAXlxbAFtbWwBdWlwAXVtbAFpcXAD///4A3+HhAP7+/gD///8A4+DiAP3//gDi4OAA/f//AODf4QAAMP4AAy7/AAAr4ADe4d8A///8ANzg4QD//v8A3uDgAFlbXAAAMP8AAC7/AAEp4AD7//8A4uDfAFhbWQABMP4AAiveAAAy/gADL/4A//79AOHf3wD6//4A4eHhAAAx/QAAMf8A4OHfAPz+/wDe4OEA4+HhAFpaWgAAKOIAAjD/APz//QAEL/8AASrdAAIv/wDf398AXFxcAAEp3wAAL/8A3t/jAOLf4QAALN4AAjH/AAAq3wAALv4A4ODgAFlcWgAAKuEA//3/AAEx/wDd398AXVleAFhdXAD9/v8AAirgAAAp4ABdW1oA3d7iAFxbXQBYWloAXF1bAFxYXQBbXFgAV1tcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAgMEBQUFAwAGBwgABgIJCQoLDA0MDg8JCQ8MEAUHERITFBAQFQkWFxgMGQwHGhgUGxwdCRgRGB4fGAwPIAcQISIjJBEMDBUlDCYnGAgHKBIpHSoYKxAsLQwJLhgvAhgwMRIdMjM0NQw2DAstNxoJKjgcKhU5GzgSDDoMFgAFOxIqHTkMPD0bPhIMFQwDAwkUPyMdDAwZCRBADAwPQQUWG0IpMR05OSI9OUBDDgIGDRIqPikjHRshPjlERRhGR0hJHCpCPyo+IT1CEjFAAgUJOUkSGxQSMUoSOUIqDktBDwlIDRYJOwwWTBAlQAwaTUEFRwYFAwUFTk9QUVIHBQAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8=',
    desc: 'Rarbg.to',
    flags: {
        auth: 0,
        language: 'en',
        cyrillic: 0
    },
    categoryList: {
        serials: ['serials'],
        music: ['videoclips', 'eng-music', 'rus-music'],
        games: ['games'],
        films: ['dvd5', 'tv', 'action', 'comedy', 'thriller', 'classic', 'history', 'mystic', 'sci-fi', 'horror', 'drama', 'adventure', 'detective', 'concert', 'epic', 'dvd9', 'fantasy', 'hdtv', 'war', 'family', 'tales', 'catastroph'],
        cartoon: ['cartoons'],
        books: ['books'],
        soft: ['software'],
        anime: ['anime'],
        doc: ['documental'],
        sport: ['sport'],
        xxx: [],
        humor: []
    },
    search: {
        searchUrl: 'https://www.rarbg.to/torrents.php?',
        nextPageSelector: {selector: 'table.def_block p>a:eq(-1)', attr: 'href'},
        baseUrl: 'https://www.rarbg.to',
        requestType: 'GET',
        requestData: 'search=%search%&c=0&t=liveonly',
        listItemSelector: '#torrents_list>tbody>tr',
        listItemSplice: [1, 0],
        torrentSelector: {
            categoryTitle: {selector: 'td:eq(0)>a>img', attr: 'alt'},
            categoryUrl: {selector: 'td:eq(0)>a', attr: 'href'},
            categoryId: {selector: 'td:eq(0)>a', attr: 'href'},
            title: 'td:eq(1)>a',
            url: {selector: 'td:eq(1)>a', attr: 'href'},
            size: 'td:eq(4)',
            seed: 'td:eq(6)',
            peer: 'td:eq(7)',
            date: 'td:eq(3)'
        },
        onGetValue: {
            categoryId: function (details, url) {
                return exKit.funcList.idInCategoryListStr(details.tracker, url, /\/([^\/]+)\/$/);
            },
            size: function (details, value) {
                return exKit.funcList.sizeFormat(value)
            },
            date: function (details, value) {
                return exKit.funcList.dateFormat(1, value)
            }
        }
    }
});
