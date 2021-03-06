/**
 * Created by Tobias on 2014-12-01.
 */

/**
 *
 * @param dateTime
 * @param category
 * @param title
 * @param location
 * @param description
 * @param categoryText
 * @param latitude
 * @param longitude
 * @param marker
 * @constructor
 */
function TrafficMessage(dateTime, category, title, location, description, categoryText, latitude, longitude, marker){
    this.date = new Date(parseInt(dateTime.replace("/Date(", "").replace(")/",""), 10));
    this.title = title;
    this.location = location;
    this.description = description;
    this.category = category;
    this.categoryText = categoryText;
    this.latitude = latitude;
    this.longitude = longitude;
    this.marker = marker;

}

/**
 *
 * @returns {string} a nice looking string containing the createdDate
 */
TrafficMessage.prototype.getDate = function(){
    var year = this.date.getFullYear();
    var month = (this.date.getMonth() + 1);
    var date = this.date.getDate();
    var hour = this.date.getHours();
    var minute = this.date.getMinutes();

    return year + "-" + month + "-" + date + "  " + hour + ":" + minute;
};
