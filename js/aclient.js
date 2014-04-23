var SERVER_ENDPOINT = "http://tpas.cleverapps.io/";
var CURRENT_VERSION = 20140419.001;
var KEY_USER_ID = "userId";
var KEY_SECRET_KEY = "secretKey";

var REPORT_GROUP_BY_DAY = "day";
var REPORT_GROUP_BY_WEEK_DAY = "weekDay";
var REPORT_GROUP_BY_MONTH = "month";
var REPORT_GROUP_BY_WEEK = "week";

/**
 * 
 * @returns {TopicAnalysisService.service}
 */
var TopicAnalysisService = function(initCallback) {
    var secretKey, userId;
    var isset = function(str) {
        return str && (str.length);
    };


    var init = function() {
        _initRegistration();
    };

    var _initRegistration = function() {
        secretKey = service.get(KEY_SECRET_KEY);
        userId = service.get(KEY_USER_ID);
        if (!secretKey || !userId) {
            register();
        } else {
            registerDone();
        }
    };

    var register = function() {
        service.call('register', {}, function(resp) {
            service.store(KEY_SECRET_KEY, secretKey = resp.secretKey);
            service.store(KEY_USER_ID, userId = resp.id);
            registerDone();
        }, function(xhr) {
            console.error("Could not register: " + xhr.responseText);
        });
    };

    var registerDone = function() {
        console.log("Registered: " + userId);
        if (initCallback) {
            console.log("calling initialization callback.");
            initCallback(service);
        }
    };

    var findIdsInList = function(list, ids) {
        var result = [];
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                if (ids.indexOf(list[i].id) > -1) {
                    result.push(list[i]);
                }
            }
        }
        return result;
    };

    var findIdInList = function(list, id) {
        //var result = null;
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    return list[i];
                }
            }
        }
        return null;
    };

    var service = {
        unStore: function(key) {
            if (window.localStorage) {
                delete window.localStorage[key];
            }
        },
        isStored: function(key) {
            return window.localStorage && window.localStorage[key] !== undefined;
        },
        store: function(key, val, asObject) {
            try {
                window.localStorage.setItem(key, asObject ? JSON.stringify(val) : val);
            } catch (e) {
                console.log("Error occured while saving item");
            }
        },
        get: function(key, asObject, defaultValue) {
            try {
                if (window.localStorage && window.localStorage[key]) {
                    return asObject ? JSON.parse(window.localStorage.getItem(key)) : window.localStorage.getItem(key);
                }
            } catch (e) {
                console.log("Storage Object error");
            }
            return defaultValue ? defaultValue : null;
        },
        call: function(command, data, successCallback, errorCallback, urlOnly) {
            var method = "POST";
            var urlData = {token: service.signRequest(), 'version': CURRENT_VERSION};
            var url = SERVER_ENDPOINT + command + "?" + serializeData(urlData);
            var reqData = method === 'POST' ? data : null;
            if (method === 'GET' && data) {
                url += "&" + serializeData(data);
            }
            if (urlOnly) {
                return url;
            }
            console.log("Making proxy command for- " + command.toUpperCase() + " Method");

            return makeRequest(url, method, reqData, successCallback, errorCallback);
        },
        signRequest: function() {
            //token deviceId-timestamp-sign=sha1(requestId.deviceId.secretKey)
            var requestId = currentTimeInMs();
            return [userId, requestId, sha1(userId + ""+ requestId +""+ secretKey)].join("-");
        },
        postRequest: function(url, data, successHandler, errorHandler) {
            return makeRequest(url, data, 'POST', successHandler, errorHandler);
        },
        getRequest: function(url, successHandler, errorHandler) {
            return makeRequest(url, 'GET', successHandler, errorHandler);
        },
        isCached: function(dataKey, ignoreExpiry) {
            var k = 'cache_' + dataKey;
            if (service.isStored(k)) {
                var cached = service.get(k, true);
                try {
                    if (ignoreExpiry || (cached && cached.expiry > currentTimeInMs())) {
                        console.log("Cache HIT");
                        return cached.data;
                    }
                } catch (e) {
                    console.log("Error occured in cache checking...");
                }

            }
            return null;
        },
        cache: function(dataKey, data, validity) {
            var k = 'cache_' + dataKey;
            validity = validity ? validity : CACHE_EXPIRY;
            return service.store(k, {expiry: currentTimeInMs() + validity, 'data': data}, true);
        },
        serviceError: function(cacheKey, xhr, onSuccess, onError) {
            var cached = service.isCached(cacheKey, true);
            if (cached) {
                return onSuccess(cached);
            }
            if (onError) {
                try {
                    onError(JSON.parse(xhr.responseText).errors);
                } catch (e) {
                }
            }
        },
        /**
         * Submits an array of history objects, each object is expected to be in the form: 
         * {date: timestamp (Number), url: theUrl (String)}
         * @param {Object[]} historys
         * @param {function} successCb
         * @param {function} failureCb
         * @returns {void}
         */
        submitHistory: function(historys, successCb, failureCb) {
            return service.call('submitHistory', {'historys': historys}, successCb, failureCb);
        },
        /**
         * Get report for this user.
         * @param {string} startDate in the format yyyy-MM-dd defaults to 7 days ago
         * @param {string} endDate in the format yyyy-MM-dd defaults to today
         * @param {string} groupBy the grouping to use for the report defaults to day.
         * @param {function} successCb function to call when successful defaulst to null
         * @param {function} failureCb function to call when the call fails defaulst to null. 
         * @returns {void}
         * 
         */
        getReport: function(startDate, endDate, groupBy, successCb, failureCb) {
            if (!startDate) {
                var startDateTs = new Date(currentTimeInMs() - 6 * 86400000);
                startDate = dateYmd(startDateTs);
            }

            if (!endDate) {
                endDate = dateYmd();
            }

            if (!groupBy) {
                groupBy = REPORT_GROUP_BY_DAY;
            }

            service.call('report', {'endDate': endDate, 'startDate': startDate, 'groupBy': groupBy}, successCb, failureCb);
        }
    };

    init();

    return service;
};

function serializeData(data, prefix) {
    if (data) {
        if (typeof data !== "object") {
            return data;
        }

        var parts = [];
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                if (typeof data[i] === "object" && data[i] instanceof Array) {
                    //is array
                    var setPrefix = (prefix !== undefined ? prefix + i : i);
                    for (var j = 0; j < data[i].length; j++) {
                        parts.push(serializeData(data[i][j], setPrefix + "[" + j + "]."));
                    }
                } else {
                    parts.push((prefix !== undefined ? prefix + i : i) + "=" + encodeURIComponent(data[i]));
                }
            }
        }
        return parts.join("&");
    }
    return '';
}


function currentTimeInMs() {
    return new Date().getTime();
}

/**
 * 
 * @param {string} url
 * @param {type} method
 * @param {type} data
 * @param {type} successHandler
 * @param {type} errorHandler
 * @returns {undefined}
 */
var makeRequest = function(url, method, data, successHandler, errorHandler) {
    var response, startTime = currentTimeInMs();
    var xhr = new XMLHttpRequest();
    xhr.open(method || 'GET', url, true);
    data = data ? serializeData(data) : null;
    if (method === "POST") {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//        if (data) {
//            xhr.setRequestHeader("content-length", data.length);
//        }
//        xhr.setRequestHeader("connection", "close");
    }

    xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
            console.log("Request completed in " + (currentTimeInMs() - startTime) + "ms");
            console.log("HTTP Status: " + xhr.status);
            if (xhr.status === 200) {
                //console.log(xhr.responseText);
                if (successHandler) {
                    //console.log("Received Mime: "+xhr.getResponseHeader('content-type'));
                    if (xhr.getResponseHeader('content-type').match(/image|octet|stream/)) {
                        response = xhr.responseText;
                    } else {
                        response = JSON.parse(xhr.responseText);
                    }
                    successHandler(response, xhr);
                }
            } else {
                console.log("Error");
                if (errorHandler) {
                    errorHandler(xhr);
                }
            }
        }
    };
    xhr.send(data);
};

function objectValues(obj, exclude) {
    var op = [];
    var toExclude = exclude || [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && toExclude.indexOf(key) < 0) {
            op.push(obj[key]);
        }
    }
    return op;
}
/**
 * 
 * @param {Array} objects
 * @param {string} key
 * @param {function} compCb
 * @returns {undefined}
 */
function sort_in_place(objects, key, compCb) {
    var tmp, isGreater;
    for (var i = 0; i < objects.length; i++) {
        for (var j = i + 1; j < objects.length; j++) {
            isGreater = compCb ? (compCb(objects[i], objects[j]) > 0) :
                    (objects[i][key] > objects[j][key]);
            if (isGreater) {
                tmp = objects[i];
                objects[i] = objects[j];
                objects[j] = tmp;
            }
        }
    }
}

function dateYmd(ts) {
    var t = ts ? new Date(ts) : new Date();
    var dd = t.getDate() > 9 ? t.getDate() : "0" + t.getDate();
    var mnt = t.getMonth() + 1;
    var mm = mnt > 9 ? mnt : "0" + mnt;
    return t.getFullYear() + "-" + mm + "-" + dd;
}

function utf8_encode(a) {
    if (a === null || typeof a === 'undefined') {
        return'';
    }
    var b = (a + '');
    var c = '', start, end, stringl = 0;
    start = end = 0;
    stringl = b.length;
    for (var n = 0; n < stringl; n++) {
        var d = b.charCodeAt(n);
        var e = null;
        if (d < 128) {
            end++;
        } else if (d > 127 && d < 2048) {
            e = String.fromCharCode((d >> 6) | 192, (d & 63) | 128);
        } else if ((d & 0xF800) != 0xD800) {
            e = String.fromCharCode((d >> 12) | 224, ((d >> 6) & 63) | 128, (d & 63) | 128);
        } else {
            if ((d & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var f = b.charCodeAt(++n);
            if ((f & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            d = ((d & 0x3FF) << 10) + (f & 0x3FF) + 0x10000;
            e = String.fromCharCode((d >> 18) | 240, ((d >> 12) & 63) | 128, ((d >> 6) & 63) | 128, (d & 63) | 128);
        }
        if (e !== null) {
            if (end > start) {
                c += b.slice(start, end);
            }
            c += e;
            start = end = n + 1;
        }
    }
    if (end > start) {
        c += b.slice(start, stringl);
    }
    return c;
}

function sha1(c) {
    var d = function(n, s) {
        var a = (n << s) | (n >>> (32 - s));
        return a;
    };
    var e = function(a) {
        var b = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (a >>> (i * 4)) & 0x0f;
            b += v.toString(16);
        }
        return b;
    };
    var f;
    var i, j;
    var W = new Array(80);
    var g = 0x67452301;
    var h = 0xEFCDAB89;
    var k = 0x98BADCFE;
    var l = 0x10325476;
    var m = 0xC3D2E1F0;
    var A, B, C, D, E;
    var o;
    c = this.utf8_encode(c);
    var p = c.length;
    var q = [];
    for (i = 0; i < p - 3; i += 4) {
        j = c.charCodeAt(i) << 24 | c.charCodeAt(i + 1) << 16 | c.charCodeAt(i + 2) << 8 | c.charCodeAt(i + 3);
        q.push(j);
    }
    switch (p % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = c.charCodeAt(p - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = c.charCodeAt(p - 2) << 24 | c.charCodeAt(p - 1) << 16 | 0x08000;
            break;
        case 3:
            i = c.charCodeAt(p - 3) << 24 | c.charCodeAt(p - 2) << 16 | c.charCodeAt(p - 1) << 8 | 0x80;
            break
    }
    q.push(i);
    while ((q.length % 16) !== 14) {
        q.push(0);
    }
    q.push(p >>> 29);
    q.push((p << 3) & 0x0ffffffff);
    for (f = 0; f < q.length; f += 16) {
        for (i = 0; i < 16; i++) {
            W[i] = q[f + i];
        }
        for (i = 16; i <= 79; i++) {
            W[i] = d(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        }
        A = g;
        B = h;
        C = k;
        D = l;
        E = m;
        for (i = 0; i <= 19; i++) {
            o = (d(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = d(B, 30);
            B = A;
            A = o;
        }
        for (i = 20; i <= 39; i++) {
            o = (d(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = d(B, 30);
            B = A;
            A = o;
        }
        for (i = 40; i <= 59; i++) {
            o = (d(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = d(B, 30);
            B = A;
            A = o;
        }
        for (i = 60; i <= 79; i++) {
            o = (d(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = d(B, 30);
            B = A;
            A = o;
        }
        g = (g + A) & 0x0ffffffff;
        h = (h + B) & 0x0ffffffff;
        k = (k + C) & 0x0ffffffff;
        l = (l + D) & 0x0ffffffff;
        m = (m + E) & 0x0ffffffff;
    }
    o = e(g) + e(h) + e(k) + e(l) + e(m);
    return o.toLowerCase();
}