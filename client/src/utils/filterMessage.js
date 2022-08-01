const trimEnter = string => {
    string = string.trim();
    const splittingText = Array.from(string.split("<div><br></div>"));
    let countFirstToDelete = 0;
    for (let i = 0; i < splittingText.length; i++)
        if (splittingText[i] === "")
            countFirstToDelete++;
        else
            break;
    for (let i = 0; i < countFirstToDelete; i++)
        splittingText.shift()

    let countLastToDelete = 0;
    for (let i = splittingText.length - 1; i >= 0; i--)
        if (splittingText[i] === "")
            countLastToDelete++;
        else
            break;

    for (let i = 0; i < countLastToDelete; i++)
        splittingText.pop()

    let resStr = "";
    for (let i = 0; i < splittingText.length; i++)
        resStr += (i!==0?"<div><br></div>":"")+ splittingText[i];
    return resStr.trim()
}

export default trimEnter;