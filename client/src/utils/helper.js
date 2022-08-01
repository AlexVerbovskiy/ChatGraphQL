export const getImgData = (file, onChangeFile) => {
    if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        const type = file.type.split('/')[1];
        fileReader.addEventListener("load", ev => onChangeFile(ev.target.result, type, file.name));
    }
}

export const msToHMS = duration => {

    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds.toFixed(0);
}

export const getFileData = getImgData;

export const formatedDate = date => {
    const splitedDate = date.split("GMT")[0];
    const [dayName, month, day, year, time] = splitedDate.split(" ");
    const [hours, minutes, seconds] = time.split(":");
    const createdTime = hours + ":" + minutes;
    const nowDate = (new Date()).toString();
    const splitedNowDate = nowDate.split("GMT")[0];
    const [nowDayName, nowMonth, nowDay, nowYear] = splitedNowDate.split(" ");
    if (nowDayName === dayName && nowMonth === month && day === nowDay && nowYear === year)
        return createdTime;
    if (nowDay - day <= 7)
        return createdTime + " " + dayName;
    if (nowYear === year)
        return createdTime + " " + day + " " + month;
    return createdTime + " " + day + " " + month + " " + year;
}

export const hexToRgb = (hex = "#000000") => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}