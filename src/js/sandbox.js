/**
 * Created by Anton on 02.01.2017.
 */
"use strict";
require.config({
    baseUrl: './js',
    paths: {
        jquery: './lib/jquery-3.1.1.min',
        moment: './lib/moment-with-locales.min',
        exKit: './module/exKit'
    }
});
require([
    './lib/promise.min',
    './module/transport'
], function (Promise, Transport) {
    (function (runCode) {
        var transport = new Transport({
            sendMessage: function (msg) {
                parent.postMessage(msg, '*');
            },
            onMessage: function (cb) {
                window.onmessage = function (e) {
                    if (e.source === parent) {
                        cb(e.data);
                    }
                };
            }
        });
        var onMessage = transport.onMessage;
        var sendMessage = transport.sendMessage;

        onMessage(function (msg, response) {
            if (msg.event) {
                var fn = events[msg.event];
                if (fn) {
                    fn(msg).then(response).catch(function (err) {
                        response({success: false, error: 'exception', name: err.name, message: err.message});
                        if (err.message !== 'ABORT') {
                            throw err;
                        }
                    });
                    return true;
                }
            }
            console.error('worker', msg);
        });

        sendMessage({action: 'init'}, function (response) {
            if (!response) {
                throw  new Error("API response is empty")
            }

            var code = response.code;
            var requireList = response.require;

            require(requireList, function () {
                new Promise(function (resolve) {
                    resolve(runCode(code));
                }).then(function () {
                    sendMessage({action: 'ready'});
                }).catch(function (e) {
                    sendMessage({
                        action: 'error',
                        message: e.message,
                        name: e.name,
                        stack: e.stack
                    });
                    throw e;
                });
            });
        });

        var events = {};
        window.API_event = function (name, callback) {
            events[name] = function (query) {
                return new Promise(function (resolve) {
                    resolve(callback(query));
                });
            };
        };
        window.API_request = function (details) {
            return new Promise(function (resolve, reject) {
                sendMessage({action: 'request', details: details}, function (result) {
                    if (!result) {
                        throw new Error("API response is empty")
                    }

                    var err = result.error;
                    var response = result.response;
                    if (err) {
                        var error = new Error(err.message);
                        error.name = err.name;
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
            });
        };
        window.API_getDom = function (html) {
            var fragment = document.createDocumentFragment();
            var div = document.createElement('html');
            div.innerHTML = html;
            var el;
            while (el = div.firstChild) {
                fragment.appendChild(el);
            }
            return fragment;
        };

        (function () {
            var searchJs = /javascript/ig;
            var blockHref = /\/\//;
            var blockSrc = /src=(['"]?)/ig;
            var blockSrcSet = /srcset=(['"]?)/ig;
            var blockOnEvent = /on(\w+)=/ig;

            var deImg = /data:image\/gif,base64#blockurl#/g;
            var deUrl = /about:blank#blockurl#/g;
            var deJs = /tms-block-javascript/g;

            window.API_sanitizeHtml = function (str) {
                return str.replace(searchJs, 'tms-block-javascript')
                    .replace(blockHref, '//about:blank#blockurl#')
                    .replace(blockSrc, 'src=$1data:image/gif,base64#blockurl#')
                    .replace(blockSrcSet, 'data-block-attr-srcset=$1')
                    .replace(blockOnEvent, 'data-block-event-$1=');
            };

            window.API_deSanitizeHtml = function (str) {
                return str.replace(deImg, '')
                    .replace(deUrl, '')
                    .replace(deJs, 'javascript');
            };
        })();

        (function () {
            var parseUrl = function (pageUrl, details) {
                details = details || {};
                var pathname = /([^#?]+)/.exec(pageUrl)[1];
                var path = /(.+:\/\/.*)\//.exec(pathname);
                if (path) {
                    path = path[1];
                } else {
                    path = pageUrl;
                }
                path += '/';
                var result = {
                    protocol: /(.+:)\/\//.exec(pathname)[1],
                    origin: /(.+:\/\/[^\/]+)/.exec(pathname)[1],
                    path: path,
                    pathname: pathname
                };
                if (details.origin) {
                    result.origin = details.origin;
                }
                if (details.path) {
                    result.path = details.path;
                }
                return result;
            };
            var urlParseCache = {};
            window.API_normalizeUrl = function (pageUrl, value, details) {
                if (/^magnet:/.test(value)) {
                    return value;
                }
                if (/^http/.test(value)) {
                    return value;
                }

                var parsedUrl = urlParseCache[pageUrl];
                if (!parsedUrl) {
                    parsedUrl = urlParseCache[pageUrl] = parseUrl(pageUrl, details)
                }

                if (/^\/\//.test(value)) {
                    return parsedUrl.protocol + value;
                }
                if (/^\//.test(value)) {
                    return parsedUrl.origin + value;
                }
                if (/^\.\//.test(value)) {
                    return parsedUrl.path + value.substr(2);
                }
                if (/^\?/.test(value)) {
                    return parsedUrl.pathname + value;
                }
                return parsedUrl.path + value;
            };
        })();
    })(function (code) {
        return eval(code);
    });
});