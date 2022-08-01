const fs = require("fs");
const path = require('path');

const writeImage = (avatarImgData, avatarImgType, id) => {
    try {
        const data = avatarImgData.replace(/^data:image\/\w+;base64,/, "");
        const buf = Buffer.from(data, 'base64');
        const href = id + "." + avatarImgType;
        const absolutePath = path.join(__dirname, "../media/userAvatars", href);
        fs.writeFileSync(absolutePath, buf, 'binary', (e) => {
            if (e) throw e;
        });
        return href;
    } catch (err) {
        throw err;
    }
}


const writeMediaMessage = (data, type, id) => {
    try {
        const filtredData1 = data.replace(/^data:image\/\w+;base64,/, "");
        const typeFile = data.split("data:" + type + "/")[1].split(";base64")[0];
        const filtredData2 = filtredData1.replace(/^data:video\/\w+;base64,/, "");
        const filtredData3 = filtredData2.replace(/^data:audio\/\w+;base64,/, "");

        const buf = Buffer.from(filtredData3, 'base64');
        const href = id + "." + typeFile;
        const absolutePath = path.join(__dirname, "../media/" + type, href);
        fs.writeFileSync(absolutePath, buf, 'binary', (e) => {
            if (e) console.log(e);
        });
        return href;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    writeImage,
    writeMediaMessage
}