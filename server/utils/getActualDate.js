const getActualDate = ()=>{
    const sendedAtDate = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Kiev"
    }).toString();
    const sendedAtDateArr = sendedAtDate.split(", ");
    const day = sendedAtDateArr[0].split("/");
    const resDay = day[2] + "-" + (day[0].length > 1 ? day[0] : "0" + day[0]) + "-" +( day[1].length > 1 ? day[1] : "0" + day[1]);
    const time = sendedAtDateArr[1].split(" ");
    const dopTime = time[1] === "PM" ? 12 : 0;
    const times = time[0].split(":");
    const resTime = (Number(times[0]) + dopTime).toString() + ":" + (times[1].length > 1 ? times[1] : "0" + times[1]) + ":" + (times[2].length > 1 ? times[2] : "0" + times[2]);
    const res = resDay + "T" + resTime + "+00:00";
    const resDate = new Date(res);
    return resDate
}

module.exports ={getActualDate};