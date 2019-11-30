var DateFormater = {}

DateFormater.getDateForDateFormatFromList = function (dateString) {
    if (dateString.match(dd_mm_yyyy_regex_slash)) {
        return dateString.split("/").reverse().join("-") + " 00:00:00";
    } else if (dateString.match(dd_mm_yyyy_regex_dash)) {
        return dateString.split("-").reverse().join("-") + " 00:00:00";
    } else if (dateString.match(yyyymmdd_regex)) {
        return dateString.substring(0, 4) + "-" + dateString.substring(4, 6) + '-' + dateString.substring(6, 8) + " 00:00:00";
    } else if (dateString.match(yyyyddmm_regex)) {
        return dateString.substring(0, 4) + "-" + dateString.substring(6, 8) + '-' + dateString.substring(4, 6) + " 00:00:00";
    } else if (dateString.match(ddmmyyyy_regex)) {
        return dateString.substring(4, 8) + "-" + dateString.substring(2, 4) + '-' + dateString.substring(0, 2) + " 00:00:00";
    } else if (dateString.match(mmddyyyy_regex)) {
        return dateString.substring(4, 8) + "-" + dateString.substring(0, 2) + '-' + dateString.substring(2, 4) + " 00:00:00";
    } else if (dateString.match(yyyy_mm_dd_regex_dash)) {
        return dateString.split("-").join("-") + " 00:00:00";
    } else if (dateString.match(yyyy_mm_dd_regex_dash_with_timestamp)) {
        return dateString;
    } else if (dateString.match(yyyy_mm_dd_regex_dash_with_timestamp_hh_mm)) {
        return dateString + ":00"
    } else if (dateString.match(dd_mm_yyyy_regex_dash_with_timestamp_hh_mm)) {
        var str = dateString.match(dd_mm_yyyy_regex_dash_with_timestamp_hh_mm);
        return str[3] + "-" + str[2] + "-" + str[1] + " " + str[4] + ":" + str[5] + ":00";
    } else if (dateString.match(dd_mm_yyyy_regex_dash_with_timestamp)) {
        var str = dateString.match(dd_mm_yyyy_regex_dash_with_timestamp);
        return str[3] + "-" + str[2] + "-" + str[1] + " " + str[4] + ":" + str[5] + ":" + str[6];
    }
}

DateFormater.getDateWithoutTimestamp = function (date) {
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    if (day < 10)
        day = "0" + day;
    if (month < 10)
        month = "0" + month;
    var cur_day = year + "-" + month + "-" + day;
    return cur_day;
}

DateFormater.getDateWithTimestamp = function (date) {
    //var date = new Date();
    var cur_day = DateFormater.getDateWithoutTimestamp(date);
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds();

    if (hours < 10)
        hours = "0" + hours;

    if (minutes < 10)
        minutes = "0" + minutes;

    if (seconds < 10)
        seconds = "0" + seconds;

    return cur_day + " " + hours + ":" + minutes + ":" + seconds;
}

module.exports = DateFormater;