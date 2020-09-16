class TimeManager {
    toFormattedTime (totalSeconds) {
        return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
    }
}

export default new TimeManager
