// Date to 8-length string
var to8String = function (divisor = "") {
    return (
        this.getFullYear() + divisor +
        String(Number(this.getMonth()) + 1).toString().padStart(2, "0") + divisor +
        this.getDate().toString().padStart(2, "0")
    );
};

// 8-length string to Date
var toDate = function () {
    return new Date(this.slice(0, 4), Number(this.slice(4, 6))-1, this.slice(6, 8));
};

module.exports = {
    to8String,
    toDate,
};
