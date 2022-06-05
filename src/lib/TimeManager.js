import moment from 'moment';

class TimeManager {
    /**
     * Get the data diff in seconds.
     * @param {string} date
     * @return {int}
     */
    toSeconds (date) {
        return moment().diff(moment(date), 'seconds');
    }

    /**
     * Get the time in seconds and convert to H:i:s
     * @param {int} totalSeconds
     */
    toFormattedTime (totalSeconds) {
        return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
    }

    /**
     * Get the time in seconds and convert to H:i:s
     * @param {int} totalSeconds
     */
    toFormattedTimeWithoutSeconds (totalSeconds) {
        console.log('toFormattedTimeWithoutSeconds', totalSeconds)
        return new Date(totalSeconds * 1000).toISOString().substr(11, 5);
    }

    /**
     * Get the number of hours for a given number of seconds in a hour:minute:seconds perspective.
     * @param {int} totalSeconds
     */
    hoursFromSeconds (totalSeconds) {
        return new Date(totalSeconds * 1000).toISOString().substr(11, 2);
    }

    /**
     * Get the number of minutes for a given number of seconds in a hour:minute:seconds perspective.
     * @param {int} totalSeconds
     */
    minutesFromSeconds (totalSeconds) {
        return new Date(totalSeconds * 1000).toISOString().substr(14, 2);
    }

    /**
     * Get the number of seconds for a given number of seconds in a hour:minute:seconds perspective.
     * @param {int} totalSeconds
     */
    secondsFromSeconds (totalSeconds) {
        return new Date(totalSeconds * 1000).toISOString().substr(17, 2);
    }

    /**
     * Convert hours, minutes and seconds to a full sum of seconds.
     * @param {int} hours
     * @param {int} minutes
     * @param {int} seconds
     */
    convertToSeconds (hours, minutes, seconds) {
        return (parseInt(hours) * 60 * 60) + (parseInt(minutes) * 60) + (parseInt(seconds));
    }

    /**
     * Round the time to the nearest 5 minutes.
     * @param {int} seconds
     * @return {int}
     */
    round (seconds) {
        const min = 300;

        if (seconds < min) {
            seconds = min;
        }
        return Math.round(seconds / min) * min;
    }
}

export default new TimeManager
