var explore = function() {
    var _google_proxy = parseInt(GetSettings('google_proxy') || 0);
    var _use_english_postername = parseInt(GetSettings('use_english_postername') || 0);
    var xhr = {};
    var _explorerCache = JSON.parse(GetSettings('explorerCache') || "{}");
    var upTimer = null;
    var upTimer2 = null;
    var _top_cache = JSON.parse(GetSettings('topCache') || "{}");
    var favoritesList = JSON.parse(GetSettings('favoritesList') || "[]");
    var favoritesDeskList = JSON.parse(GetSettings('favoritesDeskList') || "{}");
    var kinopoiskList = JSON.parse(GetSettings('kinopoiskList') || "[]");
    var kinopoiskDeskList = JSON.parse(GetSettings('kinopoiskDeskList') || "{}");
    var kinopoisk_category = parseInt(GetSettings('kinopoisk_category') || 1);
    var kinopoisk_folder_id = parseInt(GetSettings('kinopoisk_f_id') || 1);
    var _hideTopSearch = parseInt(GetSettings('hideTopSearch') || 0);
    var _hide_exp_section = {films: parseInt(GetSettings('s_films') || 1), top_films: parseInt(GetSettings('s_top_films') || 1), serials: parseInt(GetSettings('s_serials') || 1),
        games_n: parseInt(GetSettings('s_games_n') || 1), games: parseInt(GetSettings('s_games') || 1), games_a: parseInt(GetSettings('s_games_a') || 1),
        imdb_films: parseInt(GetSettings('s_imdb_films') || 0), imdb_top_films: parseInt(GetSettings('s_imdb_top_films') || 0), imdb_serials: parseInt(GetSettings('s_imdb_serials') || 0)};
    var _hide_all_exp = (_hide_exp_section.films === 0 && _hide_exp_section.top_films === 0 && _hide_exp_section.serials === 0 &&
            _hide_exp_section.games_n === 0 && _hide_exp_section.games === 0 && _hide_exp_section.games_a === 0 && kinopoisk_category === 0
            && _hide_exp_section.imdb_films === 0 && _hide_exp_section.imdb_top_films === 0 && _hide_exp_section.imdb_serials === 0);
    var tmpDeskList = {};
    var tmp_vars = {};
    var last_qbox = {top: 0, obj: null, id: null};
    var _pages_cache = {};
    var listOptions_def = {
        favorites: {
            s: 1,
            size: 0,
            count: 6,
            line: 1
        },
        films: {
            s: 1,
            size: 0,
            count: 6,
            line: 1
        },
        top_films: {
            s: 1,
            size: 0,
            count: 12,
            line: 2
        },
        serials: {
            s: 1,
            size: 0,
            count: 6,
            line: 1
        },
        games: {
            s: 1,
            size: 128,
            count: 7,
            line: 1
        },
        games_n: {
            s: 1,
            size: 128,
            count: 7,
            line: 1
        },
        games_a: {
            s: 1,
            size: 128,
            count: 7,
            line: 1
        },
        kinopoisk: {
            s: 1,
            size: 0,
            count: 7,
            line: 1
        },
        imdb_films: {
            s: 1,
            size: 0,
            count: 6,
            line: 1
        },
        imdb_top_films: {
            s: 1,
            size: 0,
            count: 12,
            line: 2
        },
        imdb_serials: {
            s: 1,
            size: 0,
            count: 6,
            line: 1
        }
    };
    var listOptions = JSON.parse(GetSettings('listOptions') || JSON.stringify(listOptions_def));
    var content_sourse = {
        favorites: {
            t: _lang.exp_favorites,
            c: null,
            root_url: '',
            fav: null,
            did: 1,
            size: 130,
            margin: 14,
            url: '',
            timeout: 0
        },
        games: {//best
            t: _lang.exp_games_best,
            c: 2,
            root_url: 'http://gameguru.ru',
            fav: 0,
            did: null,
            size: 190,
            margin: 12,
            url: 'http://gameguru.ru/pc/games/rate_week/page%page%/list.html',
            timeout: Math.round(24 * 60 * 60 * 7), //week
            page_max: 5,
            page_zero: 1,
            page_e: true,
            base_url: "http://gameguru.ru/pc/games/",
            base_img_url: "http://gameguru.ru/f/games/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=220&rewriteMime=image/jpeg&url='
        },
        games_n: {//new
            t: _lang.exp_games_new,
            c: 1,
            root_url: 'http://gameguru.ru',
            fav: 0,
            did: null,
            size: 190,
            margin: 12,
            url: 'http://gameguru.ru/pc/games/new/page%page%/list.html',
            timeout: Math.round(24 * 60 * 60 * (7 / 2)), //half week
            page_max: 5,
            page_zero: 1,
            page_e: true,
            base_url: "http://gameguru.ru/pc/games/",
            base_img_url: "http://gameguru.ru/f/games/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=220&rewriteMime=image/jpeg&url='
        },
        games_a: {//all
            t: _lang.exp_games_all,
            c: 1,
            root_url: 'http://gameguru.ru',
            fav: 0,
            did: null,
            size: 190,
            margin: 12,
            url: 'http://gameguru.ru/pc/games/best_all/page%page%/list.html',
            timeout: Math.round(24 * 60 * 60 * 7), //week
            page_max: 10,
            page_zero: 1,
            page_e: true,
            base_url: "http://gameguru.ru/pc/games/",
            base_img_url: "http://gameguru.ru/f/games/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=220&rewriteMime=image/jpeg&url='
        },
        films: {//new in cinima
            t: _lang.exp_in_cinima,
            c: 3,
            root_url: 'http://www.kinopoisk.ru',
            fav: 1,
            did: null,
            size: 130,
            margin: 14,
            url: 'http://www.kinopoisk.ru/afisha/new/page/%page%/',
            timeout: Math.round(24 * 60 * 60 * (7 / 3)),
            page_max: 2,
            page_zero: 0,
            page_e: true,
            base_url: "http://www.kinopoisk.ru/film/",
            base_img_url: "http://st.kinopoisk.ru/images/film/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=130&rewriteMime=image/jpeg&url='
        },
        top_films: {
            t: _lang.exp_films,
            c: 3,
            root_url: 'http://www.kinopoisk.ru',
            fav: 1,
            did: null,
            size: 130,
            margin: 14,
            url: 'http://www.kinopoisk.ru/popular/day/now/perpage/200/',
            timeout: Math.round(24 * 60 * 60 * (7 / 2)),
            page_e: false,
            base_url: "http://www.kinopoisk.ru/film/",
            base_img_url: "http://st.kinopoisk.ru/images/film/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=130&rewriteMime=image/jpeg&url='
        },
        serials: {
            t: _lang.exp_serials,
            c: 0,
            root_url: 'http://www.kinopoisk.ru',
            fav: 1,
            did: null,
            size: 130,
            margin: 14,
            url: 'http://www.kinopoisk.ru/top/lists/45/',
            timeout: Math.round(24 * 60 * 60 * 7),
            page_e: false,
            base_url: "http://www.kinopoisk.ru/film/",
            base_img_url: "http://st.kinopoisk.ru/images/film/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=130&rewriteMime=image/jpeg&url='
        },
        kinopoisk: {
            t: _lang.exp_kinopoisk,
            c: null,
            root_url: 'http://www.kinopoisk.ru',
            fav: 1,
            did: 2,
            size: 130,
            margin: 14,
            url: 'http://www.kinopoisk.ru/mykp/movies/list/type/%category%/page/%page%/sort/default/vector/desc/vt/all/format/full/perpage/25/',
            timeout: 0,
            page_e: false,
            base_url: "http://www.kinopoisk.ru/film/",
            base_img_url: "http://st.kinopoisk.ru/images/film/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=130&rewriteMime=image/jpeg&url='
        },
        imdb_films: {
            t: _lang.exp_imdb_in_cinima,
            c: 3,
            root_url: 'http://www.imdb.com',
            fav: 1,
            did: null,
            size: 130,
            margin: 14,
            url: 'http://www.imdb.com/movies-in-theaters/',
            timeout: Math.round(24 * 60 * 60 * (7 / 3)),
            page_e: false,
            base_url: "http://www.imdb.com/title/",
            base_img_url: "http://ia.media-imdb.com/images/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=130&rewriteMime=image/jpeg&url='
        },
        imdb_top_films: {
            t: _lang.exp_imdb_films,
            c: 3,
            root_url: 'http://www.imdb.com',
            fav: 1,
            did: null,
            size: 130,
            margin: 14,
            url: 'http://www.imdb.com/search/title?count=100&title_type=feature',
            timeout: Math.round(24 * 60 * 60 * (7 / 2)),
            page_e: false,
            base_url: "http://www.imdb.com/title/",
            base_img_url: "http://ia.media-imdb.com/images/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=130&rewriteMime=image/jpeg&url='
        },
        imdb_serials: {
            t: _lang.exp_imdb_serials,
            c: 0,
            root_url: 'http://www.imdb.com',
            fav: 1,
            did: null,
            size: 130,
            margin: 14,
            url: 'http://www.imdb.com/search/title?count=100&title_type=tv_series',
            timeout: Math.round(24 * 60 * 60 * 7),
            page_e: false,
            base_url: "http://www.imdb.com/title/",
            base_img_url: "http://ia.media-imdb.com/images/",
            google_proxy: 'https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=130&rewriteMime=image/jpeg&url='
        }
    };
    var read_content = function(type, content) {
        var sesizeimg = function(i) {
            i = i.replace('/sm_film/', '/film/');
            return i;
        };
        var makeimg = function(i) {
            if (i === undefined) {
                return "";
            }
            i = i.replace(/(.*)\/film\/([0-9]*)\//, 'http://st.kinopoisk.ru/images/film/$2.jpg');
            return i;
        };
        var imdb_makeimg = function(i) {
            if (i === undefined) {
                return "";
            }
            i = i.replace(/(.*)_V1.*/, '$1_V1_SX120_.jpg');
            return i;
        };
        var Films = function(c) {
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            t = t.find('div.filmsListNew').children('div.item');
            t.find('div.threeD').remove();
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0; i < l; i++) {
                var item = t.eq(i).children('div');
                var obj = null;
                try {
                    obj = {
                        'img': view.contentUnFilter(sesizeimg(item.eq(0).children('a').children('img').attr('src'))).replace(content_sourse[type].base_img_url, ''),
                        'name': item.eq(1).children('div.name').children('a').text().replace(/ \(.*, ([0-9]{4}).*\)$/, ' ($1)'),
                        'name_en': item.eq(1).children('div.name').children('span').text().replace(/ \([0-9]*\) [0-9]* мин./, ''),
                        'url': (content_sourse[type].root_url + view.contentUnFilter(item.eq(1).children('div.name').children('a').attr('href'))).replace(content_sourse[type].base_url, '')
                    };
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        var Serials = function(c) {
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            t = t.find('#itemList').children('tbody').children('tr');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 1; i < l; i++) {
                var item = t.eq(i).children('td');
                var obj = null;
                try {
                    obj = {
                        'img': makeimg(item.eq(1).children('div').children('a').attr('href')).replace(content_sourse[type].base_img_url, ''),
                        'name': item.eq(1).children('div').children('a').text().replace(/ \([0-9]* – .*\)$/, '').replace(/ \(сериал\)$/, ''),
                        'name_en': item.eq(1).children('div').children('span').text().replace(/ [0-9]* мин.$/, '').replace(/ \([0-9]* – .*\)$/, ''),
                        'url': (content_sourse[type].root_url + view.contentUnFilter(item.eq(1).children('div').children('a').attr('href'))).replace(content_sourse[type].base_url, '')
                    };
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        var Games = function(c) {
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            t = t.find('div.play-list-02').children('div.one.p-rel');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0; i < l; i++) {
                var item = t.eq(i);
                var obj = null;
                try {
                    obj = {
                        'img': view.contentUnFilter(item.children('a').eq(0).find('img').attr('src')).replace(content_sourse[type].base_img_url, ''),
                        'name': item.children('div.name-i').children('a').text(),
                        'url': (content_sourse[type].root_url + view.contentUnFilter(item.children('div.name-i').children('a').attr('href'))).replace(content_sourse[type].base_url, '')
                    };
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        var Games_gg = function(c) {
            var makeimg = function(url) {
                if (url === undefined) {
                    return "";
                }
                return url = content_sourse[type].root_url + url.replace('/small_img', '/medium_img');
            };
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            t = t.find('td.enc-box-list').children('div.enc-item');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0; i < l; i++) {
                var item = t.eq(i);
                var obj = null;
                try {
                    obj = {
                        'img': view.contentUnFilter(makeimg(item.children('div.e-title').children('div.im').find('img').attr('src'))).replace(content_sourse[type].base_img_url, ''),
                        'name': item.children('div.e-title').find('a').eq(0).text().trim(),
                        'url': (content_sourse[type].root_url + view.contentUnFilter(item.children('div.e-title').find('a').eq(0).attr('href'))).replace(content_sourse[type].base_url, '')
                    };
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        var TopFilms = function(c) {
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            t = t.find('div.stat').children('div.el');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0; i < l; i++) {
                var item = t.eq(i);
                var obj = null;
                try {
                    obj = {
                        'img': makeimg(item.children('a').attr('href')).replace(content_sourse[type].base_img_url, ''),
                        'name': item.children('a').text().replace(/ \(.*, ([0-9]{4}).*\)$/, ' ($1)'),
                        'name_en': item.children('i').text(),
                        'url': (content_sourse[type].root_url + view.contentUnFilter(item.children('a').attr('href'))).replace(content_sourse[type].base_url, '')
                    };
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        var About = function(c) {
            c = engine.contentFilter(c);
            var mt = engine.load_in_sandbox(c);

            var t = mt.find('#rhs_block').find('.rhsvw.kno-inline').eq(0).children('div');

            if (t.length === 0) {
                return;
            }

            t.find('span.kno-fm.fl.q').remove();

            var obj = t.find('a');
            if (obj.length === 0) {
                return;
            }
            for (var i = 0; i < obj.length; i++) {
                if (obj.eq(i).attr('href') === undefined)
                    continue;
                if (obj.eq(i).attr('href')[0] === '/')
                    obj.eq(i).attr('href', 'http://google.com' + obj.eq(i).attr('href'));
                obj.eq(i).attr('target', '_blank');
            }
            var imgs = t.find('img');
            var imgs_len = imgs.length;
            for (var i = 0; i < imgs_len; i++) {
                var par_href = decodeURIComponent(imgs.eq(i).parent('a').attr('href'));
                if (par_href === "undefined")
                    continue;
                if (par_href.indexOf("imgres") < 0) {
                    imgs.eq(i).parent('a').remove();
                    continue;
                }
                imgs.eq(i).attr('src', par_href.replace(/.*=http(.*)&imgref.*/, 'http$1'));
                if (imgs.eq(i).attr('src')[0] === '/') {
                    imgs.eq(i).attr('src', '#' + imgs.eq(i).attr('src'));
                }
            }
            var info = {};
            //(!_google_proxy) ? "" :
            var google_proxy = "https://images-pos-opensocial.googleusercontent.com/gadgets/proxy?container=pos&resize_w=400&rewriteMime=image/jpeg&url=";
            info.img = t.find('a.bia.uh_rl').eq(0).children('img').attr('src');
            info.title = t.find('div.kno-ecr-pt').text();
            info.type = t.find('div.kno-ecr-st').text();
            var dom_desc = t.find('div.kno-rdesc');
            info.desc_link_a = dom_desc.find('a').eq(-1);
            info.desc_link_title = info.desc_link_a.text();
            info.desc_link = info.desc_link_a.attr('href');
            if (info.desc_link !== undefined) {
                info.desc_link = $('<a>', {href: view.contentUnFilter(info.desc_link), text: info.desc_link_title});
                info.desc_link_a.remove();
            } else {
                info.desc_link = '';
            }
            info.desc = dom_desc.text();
            info.other = t.find('div.kno-fb-ctx');
            var content_info = $('<div>');
            if (info.title.length === 0 || info.desc.length === 0) {
                return '';
            }
            if (info.img !== undefined) {
                content_info.append($('<div>', {'class': 'a-poster'}).append($('<img>', {src: google_proxy + view.contentUnFilter(info.img)}).on('error', function(){
                    $(this).css('display', 'none');
                })));
            }
            if (info.title !== undefined) {
                content_info.append($('<div>', {'class': 'a-title', text: info.title}));
            }
            if (info.type !== undefined) {
                content_info.append($('<div>', {'class': 'a-type', text: info.type}));
            }
            if (info.desc !== undefined) {
                content_info.append($('<div>', {'class': 'a-desc', text: info.desc}).append(info.desc_link));
            }
            for (var i = 0, item; item = info.other[i]; i++) {
                var val = $(item).children('.kno-fv');
                var k = val.prev().text();
                var v = val.text();
                content_info.append($('<div>', {'class': 'a-table'}).append($('<span>', {'class': 'key', text: k}), $('<span>', {'class': 'value', text: v})));
            }
            return content_info;
        };
        var KinopoiskFav = function(c) {
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            if (t.find('#login').length > 0) {
                return '';
            }
            t = t.find('#itemList').children('li.item');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0; i < l; i++) {
                var item = t.eq(i);
                var obj = null;
                try {
                    var year = item.find('.viewDate').eq(0).text().trim().split("\n")[0].replace(/.*([0-9]{4})$/, '$1');
                    obj = {
                        'img': view.contentUnFilter(sesizeimg('http://st.kinopoisk.ru' + item.find('img.poster').attr('title'))).replace(content_sourse[type].base_img_url, ''),
                        'name': item.find('div.info').eq(0).children('a.name').text().replace(/ \(.*, ([0-9]{4}).*\)$/, ' ($1)'),
                        'name_en': item.find('div.info').children('span').eq(0).text().replace(/ [0-9]* мин.$/, '').replace(/ \([0-9]*\)$/, '').replace(/ \([0-9]* – .*\)$/, ''),
                        'url': (content_sourse[type].root_url + view.contentUnFilter(item.find('div.info').eq(0).children('a.name').attr('href'))).replace(content_sourse[type].base_url, '')
                    };
                    var tmp = obj.name.length;
                    obj.name = obj.name.replace(/ \(сериал\)/, '');
                    if (obj.name.length === tmp) {
                        obj.name += ' ' + year;
                    }
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        var imdb_Films = function(c) {
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            t = t.find('table.nm-title-overview-widget-layout');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0; i < l; i++) {
                var item = t.eq(i);
                var obj = null;
                try {
                    var img_url = item.find('div.image img').attr('src');
                    var url = item.find('[itemprop="name"] a').eq(0).attr('href');
                    var name = item.find('[itemprop="name"] a').eq(0).text().trim();
                    obj = {
                        img: imdb_makeimg(view.contentUnFilter(img_url)).replace(content_sourse[type].base_img_url, ''),
                        name: name,
                        name_en: '',
                        url: (content_sourse[type].root_url + view.contentUnFilter(url)).replace(content_sourse[type].base_url, '')
                    };
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        var imdb_TopFilms = function(c) {
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            t = t.find('table.results').children('tbody').children('tr.detailed');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0; i < l; i++) {
                var item = t.eq(i);
                var obj = null;
                try {
                    var img_url = item.children('td.image').find('img').attr('src');
                    var url = item.children('td.title').children('a').eq(0).attr('href');
                    var name = item.children('td.title').children('a').eq(0).text().trim();
                    var year = item.children('td.title').children('span.year_type').eq(0);
                    if (year.length > 0) {
                        year = year.text();
                        name += " " + year;
                    }
                    obj = {
                        img: imdb_makeimg(view.contentUnFilter(img_url)).replace(content_sourse[type].base_img_url, ''),
                        name: name,
                        name_en: '',
                        url: (content_sourse[type].root_url + view.contentUnFilter(url)).replace(content_sourse[type].base_url, '')
                    };
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        var imdb_Serials = function(c) {
            c = engine.contentFilter(c);
            var t = engine.load_in_sandbox(c);
            t = t.find('table.results').children('tbody').children('tr.detailed');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0; i < l; i++) {
                var item = t.eq(i);
                var obj = null;
                try {
                    var img_url = item.children('td.image').find('img').attr('src');
                    var url = item.children('td.title').children('a').eq(0).attr('href');
                    var name = item.children('td.title').children('a').eq(0).text().trim();
                    /*
                     var year = item.children('td.title').children('span.year_type').eq(0)
                     if (year.length > 0) {
                     year = year.text().replace(/\(([0-9]{4}).*\)$/, '($1)');
                     name += " " + year;
                     }
                     */
                    obj = {
                        img: imdb_makeimg(view.contentUnFilter(img_url)).replace(content_sourse[type].base_img_url, ''),
                        name: name.replace(/ \(([0-9]{4}).*\)$/, ' ($1)'),
                        name_en: '',
                        url: (content_sourse[type].root_url + view.contentUnFilter(url)).replace(content_sourse[type].base_url, '')
                    };
                } catch (error) {
                    obj = null;
                }
                if (obj === null || obj.img.length === 0 || obj.name.length === 0 || obj.url.indexOf('undefined') !== -1) {
                    console.log("Explorer " + type + " have problem!");
                    continue;
                }
                arr.push(obj);
            }
            return arr;
        };
        if (type === 'imdb_films') {
            return imdb_Films(content);
        } else
        if (type === 'imdb_top_films') {
            return imdb_TopFilms(content);
        } else
        if (type === 'imdb_serials') {
            return imdb_Serials(content);
        } else
        if (type === 'films') {
            return Films(content);
        } else
        if (type === 'top_films') {
            return TopFilms(content);
        } else
        if (type === 'serials') {
            return Serials(content);
        } else
        if (type === "about") {
            return About(content);
        } else
        if (type === 'games') {
            return Games_gg(content);
        } else
        if (type === 'games_n') {
            return Games_gg(content);
        } else
        if (type === 'games_a') {
            return Games_gg(content);
        } else
        if (type === 'kinopoisk') {
            return KinopoiskFav(content);
        }
    };
    var load_exp_content = function(type, url, page) {
        if (page !== undefined) {
            url = url.replace('%page%', page[1]);
        }
        var time = Math.round(new Date().getTime() / 1000);
        var timeout = content_sourse[type].timeout;
        if (tmp_vars.li_cache[type].children('div').length > 0)
            return;
        if (_explorerCache[type] !== undefined && _explorerCache[type].cache_arr !== undefined && _explorerCache[type].date > time) {
            write_content(_explorerCache[type].cache_arr, type);
            return;
        }
        if (page !== undefined) {
            if (xhr[type + page[1]] !== undefined)
                xhr[type + page[1]].abort();
        } else {
            if (xhr[type] !== undefined)
                xhr[type].abort();
        }
        xhr[type] = $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                var content = read_content(type, data);
                if (_pages_cache[type] === undefined) {
                    _pages_cache[type] = {
                        pages: {},
                        upTimer: null
                    };
                }
                if (page !== undefined) {
                    _pages_cache[type]["pages"][page[1]] = content;
                    if (_pages_cache[type]["pages"].length > 1) {
                        _pages_cache[type]["pages"].sort();
                    }
                    content = [];
                    $.each(_pages_cache[type]["pages"], function(a, b) {
                        content = content.concat(b);
                    });
                    if (_pages_cache[type]["pages"].length === page[3]) {
                        _pages_cache[type]["pages"] = null;
                    }
                }
                clearTimeout(_pages_cache[type].upTimer);
                _pages_cache[type].upTimer = setTimeout(function() {
                    tmp_vars.li_cache[type].empty();
                    write_content(content, type);
                    _explorerCache[type] = {
                        date: time + timeout,
                        cache_arr: content
                    };
                    SetSettings('explorerCache', JSON.stringify(_explorerCache));
                }, (_pages_cache[type].upTimer === undefined) ? 100 : 500);
            },
            error: function() {
                if (_explorerCache[type] !== undefined && _explorerCache[type].cache_arr !== undefined)
                    write_content(_explorerCache[type].cache_arr, type);
            }
        });
    };
    var set_view_status = function(n, s) {
        listOptions[n]['s'] = s;
        SetSettings('listOptions', JSON.stringify(listOptions));
    };
    var set_view_size = function(n, s) {
        listOptions[n]['size'] = s;
        SetSettings('listOptions', JSON.stringify(listOptions));
    };
    var set_view_i_line = function(n, s) {
        listOptions[n]['line'] = parseInt(s);
        SetSettings('listOptions', JSON.stringify(listOptions));
    };
    var get_view_status = function(n) {
        if (listOptions[n] !== undefined)
            return listOptions[n]['s'];
        return 1;
    };
    var get_view_size = function(n) {
        if (listOptions[n] !== undefined & listOptions[n].size > 0)
            return listOptions[n].size;
        if (listOptions_def[n] !== undefined && listOptions_def[n].size > 0)
            return listOptions_def[n].size;
        else
            return content_sourse[n].size;
    };
    var update_current_item = function(key) {
        var item_page = tmp_vars.li_cache[key].children('div').children('div');
        if (item_page.length === 0)
            return;
        item_page.empty().append(write_page(key, item_page.attr('data-page')));
        var size = get_view_size(key);
        calculate_moveble(key, size);
    };
    var update_poster_count = function() {
        if (tmp_vars.explore.css('display') !== 'block' || _hide_all_exp)
            return;
        $.each(listOptions, function(key) {
            var obj = tmp_vars.li_cache[key];
            if (obj === undefined) {
                return 1;
            }
            var now_count = obj.attr('data-item-count');
            var new_count = get_view_i_count(key, obj);
            if (now_count !== undefined && new_count > 0 && parseInt(now_count) !== new_count) {
                update_current_item(key);
            }
        });
    };
    var get_view_i_count = function(n, obj) {
        var poster_size = get_view_size(n);
        if (obj === undefined) {
            obj = tmp_vars.li_cache[n];
        }
        var line_count = listOptions_def[n].line;
        if (listOptions[n].line > 0)
            line_count = listOptions[n].line;
        var page_width = obj.width();
        if (page_width === undefined)
            return undefined;
        var poster_margin = get_poster_margin_size(n, poster_size) * 2;
        return Math.floor(page_width / (poster_size + poster_margin)) * line_count;
    };
    var get_view_i_line = function(n) {
        var line_count = listOptions_def[n].line;
        if (listOptions[n].line !== undefined && listOptions[n].line > 0)
            line_count = listOptions[n].line;
        return line_count;
    };
    var save_order = function() {
        var ul = tmp_vars.explore_ul.children('li');
        var ul_c = ul.length;
        var old_listOpts = JSON.parse(JSON.stringify(listOptions));
        listOptions = {};
        for (var i2 = 0; i2 < ul_c; i2++) {
            var section = ul.eq(i2).attr('class');
            if (old_listOpts[section] !== undefined) {
                listOptions[section] = old_listOpts[section];
            }
        }
        SetSettings('listOptions', JSON.stringify(listOptions));
    };

    var triggerClick = function(s, c) {
        view.triggerSearch(s);
    };
    var show_favorites = function() {
        var type = 'favorites';
        if (favoritesList.length < 1) {
            tmp_vars.li_cache[type].css('display', 'none');
            return;
        } else
            tmp_vars.li_cache[type].css('display', 'list-item');
        var page = tmp_vars.li_cache[type].children('div').children('div').attr('data-page');
        if (page === undefined)
            page = 1;
        tmp_vars.li_cache[type].empty();
        write_content(favoritesList, type, page);
    };
    var show_kinopoisk = function() {
        var type = 'kinopoisk';
        if (kinopoisk_category) {
            tmp_vars.li_cache[type].css('display', 'list-item');
        } else {
            tmp_vars.li_cache[type].css('display', 'none');
            return;
        }
        var page = tmp_vars.li_cache[type].children('div').children('div').attr('data-page');
        if (page === undefined)
            page = 1;
        tmp_vars.li_cache[type].empty();
        write_content(kinopoiskList, type, page);
    };
    var set_poster_size = function(section, size) {
        var font_size = get_font_size(size);
        var margine_size = get_poster_margin_size(section, size);
        tmp_vars.li_cache[section].find('div.setup').attr('data-size', size);
        $('style.poster_size_' + section).remove();
        $('body').append('<style class="poster_size_' + section + '">' +
                'div.explore li.' + section + ' > div > div > div.poster ' +
                '{ width: ' + size + 'px; margin: ' + margine_size + 'px; } ' +
                'div.explore li.' + section + ' > div > div > div.poster > div > div.info ' +
                '{ width: ' + size + 'px; } ' +
                'div.explore li.' + section + ' div.poster > div.image > a > img ' +
                '{width: ' + (size - 10) + 'px;} ' +
                ((font_size === 0) ?
                        'div.explore li.' + section + ' div.poster > div.label ' +
                        '{display: none;}'
                        :
                        'div.explore li.' + section + ' div.poster > div.label > div.title, ' +
                        'div.explore li.' + section + ' div.poster > div.label > div.info > a ' +
                        '{font-size: ' + font_size + 'em;}'
                        ) + '</style>');
        //<<<<
    };
    var write_content = function(content, section, page_num) {
        var i_line = get_view_i_line(section);
        //определяем размер постера и их кол-во
        var size = parseFloat(get_view_size(section));
        var def_size = content_sourse[section].size;
        var name = content_sourse[section].t;
        size = (size < 1) ? def_size : size;
        if (size > 0 && size !== def_size)
            set_poster_size(section, size);
        //<<
        //впиливание кастмного стиля для отобрадения нужного размера постеров и шрифта
        if (page_num === undefined)
            page_num = 1;
        var st = get_view_status(section);//st - статус отображения (открыт или нет спойлер)
        var sub_function = '';
        if (section === 'kinopoisk') {
            sub_function = [$('<a>', {'class': 'kinopoisk_open_btn', href: content_sourse[section].url.replace('%page%', 1).replace('%category%', kinopoisk_folder_id), target: '_blank', title: _lang.exp_btn_open}), $('<span>', {'class': 'kinopoisk_update_btn', title: _lang.exp_btn_sync})];
        }
        var c = $('<div>', {'class': 'conteiner'}).append(
                $('<h2>').append(
                $('<div>', {'class': 'move_it'}),
        name,
                sub_function,
                $('<div>', {'class': 'setup', 'data-i_line': i_line, 'data-size': size, title: _lang.exp_setup_view}).css('display', (!st) ? 'none' : ''),
                $('<div>', {'class': 'spoiler' + ((!st) ? ' up' : '')})
                ),
                $('<div>', {'data-page': page_num}).css('display', (!st) ? 'none' : '').append(write_page(section, page_num, content))
                );
        //вывод страницы
        var exp_li = tmp_vars.li_cache[section];
        exp_li.append(c);

        //триггеры пошли
        calculate_moveble(section, size);
        //<<<<<<<<<<<<<<

        if (exp_li.find('div.poster').length === 0 && page_num > 1) {
            exp_li.empty();
            write_content(content, section, page_num - 1);
        }
    };
    var search_kw_filter = function(kw) {
        return kw.replace(/(.*) \(([0-9]{4})\)/, '$1 $2');
    };
    var write_page = function(section, page, content) {
        if (content === undefined) {
            if (section === 'kinopoisk') {
                content = kinopoiskList;
            } else
            if (section === 'favorites') {
                content = favoritesList;
            } else {
                content = _explorerCache[section].cache_arr;
            }
        }
        var root_url = content_sourse[section].root_url;
        var fav = content_sourse[section].fav;
        var did = content_sourse[section].did;
        page = parseInt(page);
        if (isNaN(page))
            page = 1;
        var poster_count = get_view_i_count(section);
        if (poster_count <= 0)
            return '';
        tmp_vars.li_cache[section].attr('data-item-count', poster_count);
        var c = [];
        c.push($('<div>', {'class': 'pager'}).append(make_page_body(poster_count, content.length, page)));
        // var c = '<div class="pager">' + make_page_body(poster_count, content.length, page) + '</div>';
        var max_item = page * poster_count;
        var min_item = max_item - poster_count;
        var name_v = '';
        var cc = 0;
        var werite_item = 0;
        $.each(content, function(k, v) {
            cc++;
            if (cc <= min_item)
                return true;
            if (cc > max_item)
                return false;
            werite_item++;
            var id = ' data-id="' + k + '"';
            var qual = '?';
            if (did === 1) {
                qual = get_q_favorites(k);
            } else
            if (did === 2) {
                qual = get_q_kinopoisk(k);
            }
            name_v = v.name;
            if (_lang.t !== 'ru' || _use_english_postername !== 0) {
                if (v.name_en !== undefined && v.name_en.length > 0)
                    name_v = v.name_en;
            }
            var image_url = content_sourse[section].base_img_url + v.img;
            var page_url = content_sourse[section].base_url + v.url;
            var v_img = view.contentUnFilter(v.img);
            if (v_img.substr(0, 4) === 'http') {
                image_url = v_img;
            } else {
                if (_google_proxy) {
                    image_url = content_sourse[section].google_proxy + image_url;
                }
            }
            if (v.url.length === 0) {
                page_url = '';
            } else
            if (v.url[0] === "/") {
                page_url = content_sourse[section].root_url + v.url;
            } else
            if (v.url.substr(0, 4) === 'http') {
                page_url = v.url;
            }
            c.push($('<div>', {'class': 'poster', 'data-id': k}).append(
                    $('<div>', {'class': 'image'}).append(
                    (fav !== null) ? $('<div>', {'class': 'add_favorite', title: _lang.exp_in_fav}) : [
                $('<div>', {'class': 'del_favorite', title: _lang.exp_rm_fav}),
                $('<div>', {'class': 'edit_favorite', title: _lang.exp_edit_fav}),
                $('<div>', {'class': 'move_favorite', title: _lang.exp_move_fav})
            ],
                    $('<div>', {'class': 'quality_box', title: _lang.exp_q_fav, text: qual}),
            $('<a>', {href: '#s=' + search_kw_filter(name_v)}).append(
                    $('<img>', {src: view.contentUnFilter(image_url), title: name_v})
                    )
                    ),
                    $('<div>', {'class': 'label'}).append(
                    $('<div>', {'class': 'title', title: name_v}).append($('<span>').append($('<a>', {href: '#s=' + search_kw_filter(name_v), text: name_v}))),
                    (page_url.length > 0) ? $('<div>', {'class': 'info'}).append($('<a>', {href: view.contentUnFilter(page_url), target: 'blank', text: _lang.exp_more})) : ''
                    )
                    )
                    );
        });
        if (werite_item === 0 && page > 1) {
            var new_page = page - 1;
            tmp_vars.li_cache[section].children('div').children('div').attr('data-page', new_page);
            return write_page(section, new_page, content);
        } else
            return c;
    };
    var make_page_body = function(i_count, length, page) {
        var btns = [];
        if (length <= i_count)
            return '';
        var page_count = Math.floor((length - 1) / i_count);
        for (var i = 1; i < page_count + 2; i++) {
            btns.push($('<div>', {'class': 'item' + ((i === page) ? ' active' : ''), text: i}));
            // btns += '<div class="item' + ((i === page) ? ' active' : '') + '">' + i + '</div>';
        }
        return btns;
    };
    var sync_favorites = function(data) {
        favoritesList = JSON.parse(data);
        show_favorites();
    };
    var add_in_favorites = function(obj) {
        favoritesList.push({
            'img': $(obj).find('img').attr('src'),
            'name': $(obj).find('div.title').attr('title'),
            'url': $(obj).find('div.info').children('a').attr('href')
        });
        SetSettings('favoritesList', JSON.stringify(favoritesList));
        show_favorites();
    };
    var edit_from_favorites = function(id) {
        var new_name = apprise(_lang.exp_edit_fav_label, {
            'input': [favoritesList[id].name, favoritesList[id].img, favoritesList[id].url],
            'id': id,
            'textOk': _lang.apprise_btns[0],
            'textCancel': _lang.apprise_btns[1]
        }, function(id, name) {
            if (id === false)
                return;
            favoritesList[id].name = name[0];
            if (name[1].length === 0) {
                name[1] = "http://st.kinopoisk.ru/images/no-poster.gif";
            }
            favoritesList[id].img = name[1];
            favoritesList[id].url = name[2];
            SetSettings('favoritesList', JSON.stringify(favoritesList));
            show_favorites();
        });
    };
    var FavoritesOrder = function(left, id, right) {
        left = parseInt(left);
        id = parseInt(id);
        right = parseInt(right);
        var c = favoritesList.length;
        var new_arr = [];
        var new_desc_arr = {};
        if (!isNaN(left)) {
            if (id - 1 === left) {
                return;
            }
            for (var i = 0; i < c; i++) {
                if (i === id) {
                    continue;
                }
                new_desc_arr[new_arr.length] = favoritesDeskList[i] || [];
                new_arr.push(favoritesList[i]);
                if (i === left) {
                    new_desc_arr[new_arr.length] = favoritesDeskList[id] || [];
                    new_arr.push(favoritesList[id]);
                }
            }
            favoritesList = new_arr;
            favoritesDeskList = new_desc_arr;
        } else
        if (!isNaN(right))
        {
            if (id + 1 === right) {
                return;
            }
            for (var i = 0; i < c; i++) {
                if (i === id) {
                    continue;
                }
                if (i === right) {
                    new_desc_arr[new_arr.length] = favoritesDeskList[id] || [];
                    new_arr.push(favoritesList[id]);
                }
                new_desc_arr[new_arr.length] = favoritesDeskList[i] || [];
                new_arr.push(favoritesList[i]);
            }
            favoritesList = new_arr;
            favoritesDeskList = new_desc_arr;
        }
        SetSettings('favoritesList', JSON.stringify(favoritesList));
        SetSettings('favoritesDeskList', JSON.stringify(favoritesDeskList));
        show_favorites();
    };
    var del_from_favorites = function(id) {
        favoritesList.splice(id, 1);
        SetSettings('favoritesList', JSON.stringify(favoritesList));
        if (favoritesDeskList[id] !== undefined) {
            var new_obj = {};
            var num = 0;
            $.each(favoritesDeskList, function(k, v) {
                if (String(k) === String(id)) {
                    return 1;
                }
                new_obj[num] = v;
                num++;
            });
            favoritesDeskList = new_obj;
            SetSettings('favoritesDeskList', JSON.stringify(favoritesDeskList));
        }
        show_favorites();
    };
    var update_q_favorites = function(id, q, arr) {
        if (q === null) {
            if (favoritesList[id] !== undefined && favoritesList[id].quality !== undefined) {
                q = favoritesList[id].quality;
            } else {
                q = '';
            }
        }
        if (q.length === 0)
            q = '?';
        favoritesList[id].quality = q;
        favoritesDeskList[id] = [];
        $.each(arr, function(k, v) {
            if (v.link !== undefined && v.link !== null && v.name !== undefined && v.name !== null) { //type?
                favoritesDeskList[id].push({
                    "link": v.link,
                    "name": v.name
                });
            }
        });
        SetSettings('favoritesDeskList', JSON.stringify(favoritesDeskList));
        SetSettings('favoritesList', JSON.stringify(favoritesList));
    };
    var update_q_kinopoisk = function(id, q, arr) {
        if (q === null) {
            if (kinopoiskList[id] !== undefined && kinopoiskList[id].quality !== undefined) {
                q = kinopoiskList[id].quality;
            } else {
                q = '';
            }
        }
        if (q.length === 0)
            q = '?';
        kinopoiskList[id]['quality'] = q;
        kinopoiskDeskList[id] = [];
        $.each(arr, function(k, v) {
            if (v.link !== undefined && v.link !== null && v.name !== undefined && v.name !== null) { //type?
                kinopoiskDeskList[id].push({
                    "link": v.link,
                    "name": v.name
                });
            }
        });
        SetSettings('kinopoiskDeskList', JSON.stringify(kinopoiskDeskList));
        SetSettings('kinopoiskList', JSON.stringify(kinopoiskList));
    };
    var get_tr_favorites = function(id, section) {
        if (section === "favorites") {
            if (favoritesDeskList[id] !== undefined) {
                if (favoritesDeskList[id].constructor !== Array) {
                    return {"link": favoritesDeskList[id].tr_link, "name": favoritesDeskList[id].tr_name};
                } else {
                    return favoritesDeskList[id];
                }
            }
        } else
        if (section === "kinopoisk") {
            if (kinopoiskDeskList[id] !== undefined) {
                if (kinopoiskDeskList[id].constructor !== Array) {
                    return {"link": kinopoiskDeskList[id].tr_link, "name": kinopoiskDeskList[id].tr_name};
                } else {
                    return kinopoiskDeskList[id];
                }
            }
        }
        else {
            if (tmpDeskList[section] !== undefined && tmpDeskList[section][id] !== undefined) {
                return tmpDeskList[section][id];
            }
        }
        return null;
    };
    var get_q_favorites = function(id) {
        if (favoritesList[id].quality === undefined) {
            return '?';
        }
        return favoritesList[id]['quality'];
    };
    var get_q_kinopoisk = function(id) {
        if (kinopoiskList[id].quality === undefined) {
            return '?';
        }
        return kinopoiskList[id]['quality'];
    };
    var get_kinopoisk_films = function() {
        tmp_vars.li_cache["kinopoisk"].find('.kinopoisk_update_btn').addClass('update').removeClass('error').removeClass('success');
        var type = 'kinopoisk';
        var full_content = [];
        var limit = 8;
        var page_load = function(page, cb) {
            if (xhr[type] !== undefined)
                xhr[type].abort();
            xhr[type] = $.ajax({
                type: 'GET',
                url: content_sourse[type].url.replace('%page%', page).replace('%category%', kinopoisk_folder_id),
                success: function(data) {
                    var content = read_content(type, data);
                    if (typeof (content) === 'string') {
                        tmp_vars.li_cache["kinopoisk"].find('.kinopoisk_update_btn').removeClass('update').addClass('error').removeClass('success');
                        if (page !== 1) {
                            cb(full_content);
                        }
                        return;
                    }
                    var no_dbl = true;
                    if (full_content.length > 0) {
                        var check_content_1 = JSON.stringify(full_content[full_content.length - 1]);
                        var check_content_2 = JSON.stringify(full_content[0]);
                        for (var i = 0; i < content.length; i++) {
                            var cont = JSON.stringify(content[i]);
                            if (cont === check_content_1 || cont === check_content_2) {
                                no_dbl = false;
                                break;
                            }
                        }
                    }
                    if (no_dbl) {
                        full_content = full_content.concat(content);
                        if (content.length === 25 && page <= limit) {
                            page_load(page + 1, cb);
                            return;
                        }
                    }
                    cb(full_content);
                },
                error: function() {
                    tmp_vars.li_cache["kinopoisk"].find('.kinopoisk_update_btn').removeClass('update').addClass('error').removeClass('success');
                }
            });
        };
        page_load(1, function(content) {
            var tmp_desk_arr = {};
            for (var i = 0; i < kinopoiskList.length; i++) {
                for (var f = 0; f < content.length; f++) {
                    if (kinopoiskList[i].url === content[f].url && kinopoiskList[i].quality !== undefined) {
                        content[f].quality = kinopoiskList[i].quality;
                        if (kinopoiskDeskList[i] !== undefined) {
                            tmp_desk_arr[f] = kinopoiskDeskList[i];
                        }
                    }
                }
            }
            kinopoiskDeskList = tmp_desk_arr;
            SetSettings('kinopoiskList', JSON.stringify(content));
            SetSettings('kinopoiskDeskList', JSON.stringify(kinopoiskDeskList));
            kinopoiskList = content;
            show_kinopoisk();
            tmp_vars.li_cache["kinopoisk"].find('.kinopoisk_update_btn').removeClass('update').removeClass('error').addClass('success');
        });
    };
    var make_form = function() {
        if (tmp_vars.explore === undefined) {
            tmp_vars.explore = $('div.explore');
            tmp_vars.explore_ul = $('div.explore ul.sortable');
            tmp_vars.top = tmp_vars.explore.children('.top_search');
        }

        if (_hide_all_exp === true) {
            if ($('div.explore > div.source').css('display') === "none") {
                return;
            }
            $('div.explore > div.source').hide();
            get_search_top();
            return;
        }

        if (tmp_vars.explore_ul.children('li').length > 0) {
            update_poster_count();
            return;
        }
        tmp_vars.explore_ul.sortable({
            axis: 'y',
            handle: 'div.move_it',
            start: function(event, ui) {
                $(window).scrollTop(0);
                var de = tmp_vars.explore;
                de.find('div.spoiler').css('opacity', '0');
                de.find('div.setup_div').hide('fast', function(a, b) {
                    $(this).remove();
                });
                de.find('div.setup:visible').addClass('triggered').hide('fast');
                var a = tmp_vars.explore_ul.children("li");
                var b = a.children("div");
                var c = b.children('div');
                c.children('div.poster').hide();
                c.children('div.pager').hide();
                c.css('min-height', '');
                b.children('h2').css('border-width', '0');
                tmp_vars.explore_ul.sortable("refreshPositions");
            },
            stop: function(event, ui) {
                tmp_vars.explore.find('div.spoiler').css('opacity', '1');
                tmp_vars.explore.find('div.setup.triggered').removeClass('triggered').show('fast');
                var b = tmp_vars.explore_ul.children("li").children("div");
                var c = b.children("div");
                c.children('div.poster').show();
                c.children('div.pager').show();
                b.children('h2').css('border-width', '1px');
                save_order();
            }
        });
        tmp_vars.explore.on('change', 'div.count > select', function() {
            var li = $(this).closest('li');
            var sect = li.attr('class');
            $(this).closest('h2').children('div.setup').attr('data-i_line', $(this).val());
            set_view_i_line(sect, $(this).val());
            var main_div = li.children('div').children('div');
            main_div.css('min-height', '0px');
            main_div.empty().append(write_page(sect));
            var size = get_view_size(sect);
            calculate_moveble(sect, size);
        });
        tmp_vars.explore.on('click', 'div.setup_div > div.clear', function() {
            var li = $(this).closest('li');
            var t = li.children('div').children('div.poster');
            var sect = li.attr('class');
            var defoult_size = content_sourse[sect].size;
            if (listOptions_def[sect] !== undefined && listOptions_def[sect].size !== undefined && listOptions_def[sect].size > 0)
                defoult_size = listOptions_def[sect].size;
            var margin_size = get_poster_margin_size(sect, defoult_size);
            t.css({
                'width': defoult_size + 'px',
                'margin': margin_size + 'px'
            });
            t.find('img').width(defoult_size - 10);
            t.find('div.title span').css('font-size', '0.857em');
            t.find('div.info a').css('font-size', '0.857em');
            t.find('div.info').parent().css('display', 'block');
            $(this).parent().children('div.slider').slider('value', defoult_size);
            set_view_size(sect, defoult_size);
            calculate_moveble(sect, defoult_size);
            set_poster_size(sect, defoult_size);
            li.children('div').css('min-height', '0px');
        });
        tmp_vars.explore.on('click', '.kinopoisk_update_btn', function() {
            get_kinopoisk_films();
        });
        //temp code!
        if (listOptions.kinopoisk === undefined) {
            listOptions.kinopoisk = listOptions_def.kinopoisk;
        }
        if (listOptions.imdb_films === undefined) {
            listOptions.imdb_films = listOptions_def.imdb_films;
        }
        if (listOptions.imdb_top_films === undefined) {
            listOptions.imdb_top_films = listOptions_def.imdb_top_films;
        }
        if (listOptions.imdb_serials === undefined) {
            listOptions.imdb_serials = listOptions_def.imdb_serials;
        }
        //<<<temp code
        $.each(listOptions, function(key, value) {
            tmp_vars.explore_ul.append($('<li>', {'class': key}));
            if (_hide_exp_section[key] === 0) {
                return 1;
            }
            if (tmp_vars.li_cache === undefined) {
                tmp_vars.li_cache = {};
            }
            tmp_vars.li_cache[key] = $('li.' + key);
            if (key === 'favorites') {
                show_favorites();
            } else
            if (key === 'kinopoisk') {
                show_kinopoisk();
            } else
            if (content_sourse[key].page_e === true && content_sourse[key].page_zero !== undefined && content_sourse[key].page_max !== undefined) {
                var zero = content_sourse[key].page_zero;
                var max = content_sourse[key].page_max;
                var count = 1;
                for (var n = zero; n <= max; n++)
                    count++;
                for (var n = zero; n <= max; n++)
                    load_exp_content(key, content_sourse[key].url, [zero, n, max, count]);
            } else {
                load_exp_content(key, content_sourse[key].url);
            }
        });
        //спойлер
        tmp_vars.explore.on('click', 'h2 > div.spoiler', function() {
            var t = $(this);
            var h2 = t.parent();
            h2.parent().children('div').css('min-height', '0px');
            if (t.is('.up')) {
                t.removeClass('up').addClass('down');
                h2.children('div.setup').show('fast');
                h2.parent().children('div').slideDown('fast', function() {
                    var sect = $(this).closest('li').attr('class');
                    set_view_status(sect, 1);
                });
            } else {
                t.removeClass('down').addClass('up');
                h2.children('div.setup').hide('fast');
                tmp_vars.explore.find('div.setup_div').hide('fast', function(a, b) {
                    $(this).remove();
                });
                h2.parent().children('div').slideUp('fast', function() {
                    var sect = $(this).closest('li').attr('class');
                    set_view_status(sect, 0);
                });
            }
        });
        //переключение страниц
        tmp_vars.explore.on('mouseenter', 'div.pager > div.item', function() {
            var li = $(this).closest('li');
            var page = $(this).text();
            var sect = li.attr('class');
            var data_page = li.children('div').children('div');
            if (data_page.attr('data-page') === page)
                return;
            if (data_page.css('min-height') !== undefined) {
                if (data_page.height() > data_page.css('min-height').replace('px', ''))
                    data_page.css('min-height', data_page.height() + 'px');
            } else {
                data_page.css('min-height', $(this).parents().eq(1).height() + 'px');
            }
            data_page.attr('data-page', page);
            data_page.empty().append(write_page(sect, page));
            var size = get_view_size(sect);
            calculate_moveble(sect, size);
        });
        //настройки
        tmp_vars.explore.on('click', 'h2 > div.setup', function() {
            var setup_div = $(this).parent().children('div.setup_div');
            if (setup_div.length !== 0) {
                setup_div.hide('fast', function() {
                    setup_div.remove();
                });
                return;
            }
            setup_div.hide('fast', function(a, b) {
                $(this).remove();
            });
            var setup = make_setup_view(this);
            $(this).after(setup).next('div.setup_div').show('fast');
        });
        // кнопка избранное - добавить
        tmp_vars.explore.on('click', 'div.poster > div.image > div.add_favorite', function() {
            var poster = $(this).closest('div.poster');
            add_in_favorites(poster);
        });
        // кнопка избранное - удалить
        tmp_vars.explore.on('click', 'div.poster > div.image > div.del_favorite', function() {
            var poster = $(this).closest('div.poster');
            poster.hide('fast', function() {
                del_from_favorites($(this).attr('data-id'));
            });
        });
        // кнопка избранное - редактировать постер
        tmp_vars.explore.on('click', 'div.poster > div.image > div.edit_favorite', function() {
            var poster = $(this).closest('div.poster');
            edit_from_favorites(poster.attr('data-id'));
        });
        // кнопка качества
        tmp_vars.explore.on('click', 'div.poster > div.image > div.quality_box', function() {
            var section = $(this).closest('li').attr('class');
            var poster = $(this).closest('div.poster');
            var name = poster.children('div.label').children('div.title').text();
            $(this).addClass('loading');
            var tmp_id = parseInt(poster.attr('data-id'));
            view.getQuality(name.replace(/ \(([0-9]*)\)$/, ' $1'), tmp_id, section);
        });
        //клик по постеру
        tmp_vars.explore.on('click', 'div.poster > div.image > a', function(event) {
            event.preventDefault();
            var section = $(this).closest('li').attr('class');
            var poster = $(this).closest('div.poster');
            var s = poster.find('div.title > span').text();
            triggerClick(search_kw_filter(s), section);
        });
        //клик по имени
        tmp_vars.explore.on('click', 'div.poster div.title a', function(event) {
            event.preventDefault();
            var section = $(this).closest('li').attr('class');
            var s = $(this).text();
            triggerClick(search_kw_filter(s), section);
        });
        //клик по подробнее
        tmp_vars.explore.on('click', 'div.poster div.info a', function(event) {
            try {
                var s = $(this).closest('div.poster').find('div.title > span').text();
                _gaq.push(['_trackEvent', 'About', 'keyword', s]);
            } catch (e) {
            }
            if (window.chrome !== undefined && chrome.tabs) {
                event.preventDefault();
                chrome.tabs.create({'url': $(this).attr('href'), 'active': true});
            }
        });
        get_search_top();
        tmp_vars.top.on('click', 'a', function(e) {
            e.preventDefault();
            var s = $(this).parent().attr('title');
            triggerClick(s);
        });
        tmp_vars.explore.sortable({handle: 'div.move_favorite', cancel: "div.pager", items: "li.favorites div.poster", opacity: 0.8,
            beforeStop: function(event, ui) {
                FavoritesOrder(ui.item.prev().attr("data-id"), ui.item.attr("data-id"), ui.item.next().next().attr("data-id"));
            }
        });
        var info_popup = $("div.info_popup");
        tmp_vars.explore.on("mouseenter", "div.quality_box", function(e, myparam) {
            var ct = null;
            var section = null;
            var id = null;
            var db = null;
            var pos = null;
            if (myparam) {
                if (myparam.length !== 0) {
                    ct = myparam.ct;
                    section = myparam.section;
                    id = myparam.id;
                    db = myparam.arr;
                }
            } else {
                ct = $(this);
                section = $(this).closest('li').attr("class");
                id = $(this).parent().parent().attr("data-id");
                db = get_tr_favorites(id, section);
            }
            if (ct !== null) {
                pos = ct.offset();
            }
            if (pos === null || pos.left === 0 || db === null || (db.constructor === Array && db.length === 0)) {
                info_popup.css("display", "none");
                if (last_qbox.obj !== null) {
                    last_qbox.obj.css("display", "");
                    last_qbox.obj = null;
                }
                return;
            }
            if (last_qbox.obj !== null && id !== last_qbox.id && info_popup.is(":visible")) {
                last_qbox.obj.css("display", "");
            }
            if (db.constructor !== Array) {
                info_popup.children("div.content").empty().append($('<a>', {href: db.link, target: '_blank', text: db.name}));
            } else {
                var info_content = $('<ul>');
                $.each(db, function(k, v) {
                    info_content.append($('<li>').append($('<a>', {href: v.link, target: '_blank'}).html(v.name)));
                });
                info_popup.children("div.content").empty().append(info_content);
            }
            var w = info_popup.width() / 2;
            var h = info_popup.height() + 10;
            last_qbox.top = pos.top;
            last_qbox.obj = ct;
            last_qbox.id = id;
            var ct_w = ct.width() + 8;
            var lp = pos.left - w + ct_w / 2;
            var rp = lp + info_popup.width();
            var win_w = $(window).width();
            if (lp < 0) {
                info_popup.children("div.corner").css("margin-left", (lp - 8) + "px");
                lp = 0;
            } else
            if (rp > win_w) {
                var raz = rp - win_w;
                info_popup.children("div.corner").css("margin-left", (raz - 8) + "px");
                lp = lp - raz;
            } else {
                info_popup.children("div.corner").css("margin-left", -8);
            }
            info_popup.css({"left": lp, "top": pos.top - 40});
            info_popup.show();
        });
        tmp_vars.explore.on("mouseleave", "div.quality_box", function(e) {
            if (e.pageY < last_qbox.top + $(this).height()) {
                info_popup.hide();
            } else {
                if (last_qbox.obj !== null) {
                    last_qbox.obj.css("display", "block");
                }
            }
        });
        info_popup.on('mouseleave', function(event) {
            info_popup.css('display', 'none');
            if (last_qbox.obj !== null) {
                last_qbox.obj.css("display", "");
                last_qbox.obj = null;
            }
        });
    };
    var render_top = function(arr, colums) {
        if (_hideTopSearch === 1) {
            return;
        }
        if (colums === undefined) {
            colums = (window.innerWidth > 1275) ? 4 : 3;
        }
        if (tmp_vars.top === undefined) {
            tmp_vars.top = $('div.top_search');
        }
        tmp_vars.top_state = colums;
        if (arr === undefined) {
            if (_top_cache.keywords !== undefined) {
                arr = _top_cache.keywords;
            } else {
                tmp_vars.top.css('display', 'none');
                _hideTopSearch = 1;
                return;
            }
        }
        if (arr.length === 0) {
            tmp_vars.top.css('display', 'none');
            _hideTopSearch = 1;
        }
        arr.sort(function(a, b) {
            if (a.weight > b.weight) {
                return -1;
            }
            if (a.weight === b.weight) {
                return 0;
            }
            return 1;
        });
        var top_search = tmp_vars.top;
        var info = '';
        var sub_style = '';
        var num = 1;
        var line = 1;
        var search = '';
        var content = $('<ul>', {'class': 'c' + colums});
        //'  <ul class="c' + colums + '">';
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (line > 10) {
                break;
            }
            if (num % colums === 0) {
                if (line < 6) {
                    sub_style = ' t' + line;
                } else {
                    sub_style = '';
                }
                info = $('<div>', {'class': 'info' + sub_style});
            } else {
                info = '';
            }
            search = item.text;
            if (item.year > 0) {
                search += ' ' + item.year;
            }
            content.append($('<li>', {'class': 'l' + line}).append(info, $('<span>', {title: search}).append($('<a>', {href: '#s=' + search, text: item.text}))));
            if (num % colums === 0) {
                line++;
            }
            num++;
        }
        top_search.empty().append(content);
    };
    var get_search_top = function() {
        if (_hideTopSearch) {
            $('div.top_search').css('display', 'none');
            return;
        }
        var timeout = 86400;
        var time = Math.round(new Date().getTime() / 1000);
        if (_top_cache.keywords !== undefined && _top_cache.timeout > time) {
            render_top(_top_cache.keywords);
            return;
        }
        var type = "search_top";
        var url = "http://antoshka.on.ufanet.ru/top.json";
        if (xhr[type] !== undefined) {
            xhr[type].abort();
        }
        xhr[type] = $.ajax({
            url: url,
            cache: false,
            success: function(data) {
                if (typeof (data) !== "object") {
                    data = jQuery.parseJSON(data);
                }
                data['timeout'] = time + timeout;
                SetSettings('topCache', JSON.stringify(data));
                _top_cache = data;
                var kw_arr = data['keywords'];
                render_top(kw_arr);
            },
            error: function() {
                if (_top_cache.keywords !== undefined) {
                    render_top(_top_cache.keywords);
                } else {
                    _hideTopSearch = 1;
                    $('div.top_search').css('display', 'none');
                }
            }
        });
    };
    var calculate_moveble = function(section, size) {
        if (size <= 70)
            return;
        var titles = tmp_vars.li_cache[section].find('span');
        var titles_l = titles.length;

        for (var i = 0; i < titles_l; i++) {
            var str_w = titles.eq(i).width();
            if (str_w === 0) {
                str_w = titles.eq(i).text().length * 7;
            }
            if (str_w < size)
                continue;
            str_w = Math.ceil(str_w / 10);
            if (str_w > 10) {
                if (str_w < 100) {
                    var t1 = Math.round(str_w / 10);
                    if (t1 > str_w / 10)
                        str_w = t1 * 10 * 10;
                    else
                        str_w = (t1 * 10 + 5) * 10;
                } else
                    str_w = str_w * 10;
            } else
                str_w = str_w * 10;
            var str_s = size;
            var time_calc = Math.round(str_w / parseInt(str_s) * 3.5);
            var move_name = 'moveble' + '_' + str_s + '_' + str_w;
            if ($('body').find('.' + move_name).length === 0) {
                $('body').append('<style class="' + move_name + '">'
                        + '@-webkit-keyframes a_' + move_name
                        + '{'
                        + '0%{margin-left:2px;}'
                        + '50%{margin-left:-' + (str_w - str_s) + 'px;}'
                        + '90%{margin-left:6px;}'
                        + '100%{margin-left:2px;}'
                        + '}'
                        + '@keyframes a_' + move_name
                        + '{'
                        + '0%{margin-left:2px;}'
                        + '50%{margin-left:-' + (str_w - str_s) + 'px;}'
                        + '90%{margin-left:6px;}'
                        + '100%{margin-left:2px;}'
                        + '}'
                        + '@-moz-keyframes a_' + move_name
                        + '{'
                        + '0%{margin-left:2px;}'
                        + '50%{margin-left:-' + (str_w - str_s) + 'px;}'
                        + '90%{margin-left:6px;}'
                        + '100%{margin-left:2px;}'
                        + '}'
                        + '@-o-keyframes a_' + move_name
                        + '{'
                        + '0%{margin-left:2px;}'
                        + '50%{margin-left:-' + (str_w - str_s) + 'px;}'
                        + '90%{margin-left:6px;}'
                        + '100%{margin-left:2px;}'
                        + '}'
                        + 'div.explore div.poster div.title.' + move_name + ':hover > span {'
                        + 'overflow: visible;'
                        + '-webkit-animation:a_' + move_name + ' ' + time_calc + 's;'
                        + '-moz-animation:a_' + move_name + ' ' + time_calc + 's;'
                        + '-o-animation:a_' + move_name + ' ' + time_calc + 's;'
                        + '}'
                        + '</style>');
            }
            titles.eq(i).parent().attr('class', 'title ' + move_name);
        }
    };
    var make_setup_view = function(obj) {
        var i_line = parseInt($(obj).attr('data-i_line'));
        var size = $(obj).attr('data-size');
        var section = $(obj).closest('li').attr('class');
        var def_size = content_sourse[section].size;
        var t = $($('<div>', {'class': 'setup_div', 'data-i_line': i_line, 'data-size': def_size})).hide();
        //var t = $('<div class="setup_div" data-i_line="' + i_line + '" data-size="' + def_size + '"></div>').hide();
        $('<div>', {'class': 'slider'}).slider({
            value: size,
            max: def_size,
            min: 30,
            animate: true,
            change: function(event, ui) {
                var sect = $(this).parents().eq(3).attr('class');
                set_view_size(sect, ui.value);
                //calculate_moveble(sect,ui.value);
                set_poster_size(sect, ui.value);
                $(this).parents().eq(2).children('div').css('min-height', '0px');
                update_current_item(sect);
            },
            slide: function(event, ui) {
                var t = $(this).parents().eq(2).children('div').children('div.poster');
                var sect = $(this).parents().eq(3).attr('class');
                var margin_size = get_poster_margin_size(sect, ui.value);
                t.css({
                    'width': ui.value + 'px',
                    'margin': margin_size + 'px'
                });
                t.find('img').width(ui.value - 10);
                var ttl = t.find('div.title span');
                var inf = t.find('div.info a');
                var txt = t.find('div.info').parent();
                t.find('div.info').width(ui.value);
                var f = get_font_size(ui.value);
                if (f > 0) {
                    inf.css('font-size', f + 'em');
                    ttl.css('font-size', f + 'em');
                    txt.css('display', 'block');
                } else {
                    txt.css('display', 'none');
                }
            }
        }).appendTo(t);
        var optns = [];
        for (var i = 1; i < 7; i++) {
            var t_opt = $('<option>', {value: i, text: i});
            if (i === i_line) {
                t_opt.prop('selected', true);
            }
            optns.push(t_opt);
        }
        t.append($('<div>', {'class': 'clear', title: _lang.exp_default}), $('<div>', {'class': 'count'}).append($('<select>').append(optns)));
        return t;
    };
    var get_font_size = function(w) {
        if (w > 105) {
            return 0.857;
        }
        else if (w > 80) {
            return 0.786;
        }
        else if (w > 70) {
            return 0.643;
        }
        else {
            return 0;
        }
    };
    var get_poster_margin_size = function(section, w) {
        var max_w = content_sourse[section].size;
        var max_m = content_sourse[section].margin;
        if (w < 70)
            return 0;
        else
        if (w < max_w - 25)
            max_m -= 8;
        else
        if (w < max_w - 15)
            max_m -= 6;
        else
        if (w < max_w - 5)
            max_m -= 4;
        var size = Math.round((max_m * w) / max_w);
        return size;
    };
    var setQuality = function(obj, year) {
        var s_year = year;
        var max_c = 0;
        var cat = -1;
        var qbox = tmp_vars.li_cache[obj.section].find('div[data-id=' + obj.id + ']').find('div.quality_box');
        if (obj === undefined || obj.year === undefined) {
            clearTimeout(upTimer2);
            upTimer2 = setTimeout(function() {
                qbox.removeClass('loading');
                qbox.text('-');
                if (obj.id !== undefined) {
                    if (obj.section === 'favorites') {
                        update_q_favorites(obj.id, '-', []);
                    }
                    if (obj.section === 'kinopoisk') {
                        update_q_kinopoisk(obj.id, '-', []);
                    }
                }
                qbox.trigger("mouseenter", []);
            }, 500);
            return;
        }
        function get_last_year(c) {
            var year = 0;
            $.each(obj.year, function(a) {
                if (year < a && (obj.year[a][c] !== undefined)) {
                    year = a;
                }
            });
            return year;
        }
        function get_last_2year() {
            var year = 0;
            var prew = 0;
            $.each(obj.year, function(a) {
                if (year < a) {
                    prew = year;
                    year = a;
                }
            });
            if (prew > 0) {
                return [prew, year];
            } else {
                return [year];
            }
        }
        if (s_year) {
            if (obj.year[s_year] === undefined) {
                s_year = null;
            } else {
                $.each(obj.year[s_year], function(a) {
                    if (obj.cat_c[a] > max_c) {
                        max_c = obj.cat_c[a];
                        cat = a;
                    }
                });
            }
        }
        if (s_year === null) {
            max_c = 0;
            $.each(obj.cat_c, function(a, b) {
                if (max_c < b) {
                    max_c = b;
                    cat = a;
                }
            });
            s_year = get_last_year(cat);
        }
        qbox.removeClass('loading');
        var label = obj.year[s_year][cat].m;
        qbox.text(label);
        var link_array = [{
                "link": obj.year[s_year][cat].link,
                "name": obj.year[s_year][cat].name + ', ' + obj.year[s_year][cat].size
            }];
        var l2y = get_last_2year();
        var lim = 5;
        for (var i = l2y.length - 1; i >= 0; i--) {
            var v_y = l2y[i];
            $.each(obj.year[v_y], function(k, v) {
                if (v.link === obj.year[s_year][cat].link) {
                    return true;
                }
                if (lim === 1) {
                    return false;
                }
                lim--;
                link_array.push({
                    "link": v.link,
                    "name": v.name + ', ' + v.size
                });
            });
        }
        if (tmpDeskList[obj.section] === undefined) {
            tmpDeskList[obj.section] = {};
        }
        tmpDeskList[obj.section][obj.id] = link_array;
        if (obj.section === 'favorites') {
            clearTimeout(upTimer);
            upTimer = setTimeout(function() {
                update_q_favorites(obj.id, label, link_array);
            }, 500);
        }
        if (obj.section === 'kinopoisk') {
            clearTimeout(upTimer);
            upTimer = setTimeout(function() {
                update_q_kinopoisk(obj.id, label, link_array);
            }, 500);
        }
        clearTimeout(upTimer2);
        upTimer2 = setTimeout(function() {
            qbox.trigger("mouseenter", [{"ct": qbox, "section": obj.section, "id": obj.id, "arr": link_array}]);
        }, 100);
    };
    var about_keyword = function(keyword) {
        if (keyword.length === 0)
            return;
        var ab_panel = $('div.about_panel');
        ab_panel.empty();
        var url = 'https://www.google.com/search?q=' + keyword;
        var type = "about";
        if (xhr[type] !== undefined)
            xhr[type].abort();
        xhr[type] = $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                var content = read_content(type, data);
                ab_panel.empty().append(content);
            }
        });
    };
    return {
        updFav: function(d) {
            if (tmp_vars.explore !== undefined) {
                sync_favorites(d);
            }
        },
        getAbout: function(k) {
            return about_keyword(k);
        },
        getLoad: function() {
            return make_form();
        },
        setQuality: function(a, b) {
            setQuality(a, b);
        },
        update_poster_count: function(a) {
            if (tmp_vars.explore !== undefined) {
                clearTimeout(tmp_vars.resizetimer);
                tmp_vars.resizetimer = setTimeout(update_poster_count, 200);
            }
        },
        render_top: function(a, b) {
            if (tmp_vars.explore !== undefined && tmp_vars.top_state !== b) {
                render_top(a, b);
            }
        }
    };
}();
$(window).on('resize', function(e) {
    explore.update_poster_count();
    if (this.innerWidth > 1275) {
        explore.render_top(undefined, 4);
    } else {
        explore.render_top(undefined, 3);
    }
});

if (GetSettings('allow_favorites_sync') === "1" && window.chrome !== undefined && chrome.storage) {
    chrome.storage.onChanged.addListener(function(changes) {
        for (var key in changes) {
            if (key === "favoritesList") {
                explore.updFav(changes[key].newValue);
            }
        }
    });
}