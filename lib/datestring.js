// Date to 8-length string
var to8String = function () {
    return (
        this.getFullYear() +
        this.getMonth().toString().padStart(2, "0") +
        this.getDate().toString().padStart(2, "0")
    );
};

// 8-length string to Date
var toDate = function () {
    return new Date(this.slice(0, 4), this.slice(4, 6), this.slice(6, 8));
};

module.exports = {
    to8String,
    toDate,
};
