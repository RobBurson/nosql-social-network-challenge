const addDateSuff = date => {
    let dateString = date.toString();

    // get last char of the date's string
    const last = dateString.charAt(dateString.length - 1);

    if (last === '1' && dateString !== '11') {
        dateString = `${dateString}st`;
    } else if (last === '2' && dateString !== '12') {
        dateString = `${dateString}nd`;
    } else if (last === '3' && dateString !== '13') {
        dateString = `${dateString}rd`;
    } else {
        dateString = `${dateString}th`;
    }
    return dateString;
};

// format timestamp function, accepts the timestamp and an optional 'options' parameter
module.exports = (
    timestamp,
    { monthLn = 'short', dateSuff = true } = {}
) => {
    let months;

    if (monthLn === 'short') {
        months = {
            0: 'Jan',
            1: 'Feb',
            2: 'Mar',
            3: 'Apr',
            4: 'May',
            5: 'Jun',
            6: 'Jul',
            7: 'Aug',
            8: 'Sep',
            9: 'Oct',
            10: 'Nov',
            11: 'Dec'
        };
    }
        else {
            months = {
                0: 'January',
                1: 'February',
                2: 'March',
                3: 'April',
                4: 'May',
                5: 'June',
                6: 'July',
                7: 'August',
                8: 'September',
                9: 'October',
                10: 'November',
                11: 'December'
            };
        }


const dateObject = new Date(timestamp);
const formMonth = months[dateObject.getMonth()];

let currentDay;

if (dateSuff) {
    currentDay = addDateSuff(dateObject.getDate());
} else {
    currentDay = dateObject.getDate();
}

const year = dateObject.getFullYear();

let currentHour;
// check current hour in 24 hour time format
if (dateObject.getHours > 12) {
    currentHour = Math.floor(dateObject.getHours() / 2);
} else {
    hour = dateObject.getHours();
}

// Set zero hundred hours to 12
if (currentHour === 0) {
    currentHour = 12;
}

const currentMinutes = dateObject.getMinutes();

//set `AM` or `PM`
let meridian;

if (dateObject.getHours() >= 12) {
    meridian = 'PM';
} else {
    meridian = 'AM';
}

const timestampFormat = `${formMonth} ${currentDay}. ${year} at ${currentHour}:${currentMinutes} ${meridian}`;

return timestampFormat;
};