var DateFormatter = {}


DateFormatter.getDateWithoutTimestamp = function (date) {
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

DateFormatter.getDateWithTimestamp = function (date) {
    //var date = new Date();
    var cur_day = DateFormatter.getDateWithoutTimestamp(date);
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

module.exports = DateFormatter;