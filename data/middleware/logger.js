module.exports = (format) => {
    return (req, res, next) => {
        switch (format) {
            case "short":
                console.log(`${req.method} ${req.url}`);
                break;
            case "long":
            default:
                console.log(
                    `${new Date().toISOString()} ${req.ip} ${req.method} ${
                        req.url
                    }`
                );
                next();
        }
    };
};
