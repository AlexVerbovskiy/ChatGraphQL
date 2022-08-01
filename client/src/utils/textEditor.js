/*Функція що замінює текст на інший(фиділений якось)*/
export const replaceSelectionWithHtml = (html, selection) => {
    let range;
    if (selection && selection().getRangeAt) {
        range = selection().getRangeAt(0);
        range.deleteContents();
        const div = document.createElement("div");
        div.innerHTML = html;
        const frag = document.createDocumentFragment();
        let child;

        while ((child = div.firstChild))
            frag.appendChild(child);

        range.insertNode(frag);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML(html);
    }
}

/*Функція, що перевіряє чи є протягом п'яти рівнів елемент, що співпадає з шуканим*/
export const getFivesLevelParent = (parentText, elem) => {
    const seconParentText = parentText ? parentText.parentElement ? parentText.parentElement : null : null;
    const thirdParentText = seconParentText ? seconParentText.parentElement ? seconParentText.parentElement : null : null;
    const fourthParentText = thirdParentText ? thirdParentText.parentElement ? thirdParentText.parentElement : null : null;
    const fivesParentText = fourthParentText ? fourthParentText.parentElement ? fourthParentText.parentElement : null : null;

    if (seconParentText && seconParentText.tagName === elem.toUpperCase())
        parentText = seconParentText;
    else if (thirdParentText && thirdParentText.tagName === elem.toUpperCase())
        parentText = thirdParentText;
    else if (fourthParentText && fourthParentText.tagName === elem.toUpperCase())
        parentText = fourthParentText;
    else if (fivesParentText && fivesParentText.tagName === elem.toUpperCase())
        parentText = fivesParentText;

    return parentText;
}

/*Функція що генерує кнопку, яка відповідає за гарне оброблення тексту*/
const generateButtonEdit = (elem, select) => {
    const button = document.createElement("button");
    button.innerHTML = `<${elem}>${elem}</${elem}>`;
    button.classList.add("edit-button");
    button.addEventListener("click", () => {
        const text = select();
        let parentText = text.anchorNode ? text.anchorNode.parentElement : null;
        parentText = getFivesLevelParent(parentText, elem);
        let newText = "";

        if (parentText.tagName === elem.toUpperCase()) {
            newText = parentText.innerHTML;
            parentText.outerHTML = newText;
        } else {
            newText = `<${elem}>${text}</${elem}>`;
            replaceSelectionWithHtml(newText, select);
        }
    });
    return button;
}

/*Функція, що генерує інпут з вибором виділення тексту*/
const generateButtonColor = select => {

    const hexToRgb = (hex = "#000000") => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.classList.add("edit-color-button")
    colorInput.addEventListener("input", e => {
        const text = select();
        let parentText = text.anchorNode ? text.anchorNode.parentElement : null;
        parentText = getFivesLevelParent(parentText, "span");
        const rgbColor = hexToRgb(e.target.value);

        if (parentText.tagName === "SPAN" && parentText.style.color === `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`) {
            let newText = "";
            newText = parentText.innerHTML;
            parentText.outerHTML = newText;
        } else if (parentText.tagName === "SPAN" && parentText.style.color !== e.target.value) {
            parentText.style.color = e.target.value;
        } else {
            replaceSelectionWithHtml(`<span style="color: ${e.target.value}">${text}</span>`, select);
        }
    });
    return colorInput;
}

/*Функція що генерує кнопку, яка генерує блок кнопочок для оздоблення тексту*/
const writeEditInputMessageButtons = (x, y, select, elemToAppend) => {
    const div = document.createElement("div");
    elemToAppend.appendChild(div);
    div.classList.add("edit-buttons");
    div.appendChild(generateButtonEdit("i", select));
    div.appendChild(generateButtonEdit("b", select));
    div.appendChild(generateButtonEdit("u", select));
    div.appendChild(generateButtonEdit("s", select));
    div.appendChild(generateButtonColor(select));

    div.style.left = (x - div.offsetWidth / 2) + "px";
    div.style.top = y - div.offsetHeight + "px";

    const hidePopap = e => {
        console.log(e.target)
        if (e.target.classList.contains("edit-buttons") || e.target.classList.contains("edit-button")
        ||e.target.parentElement.classList.contains("edit-button"))
            return;
        div.remove();
        document.body.removeEventListener("click", hidePopap);
    }

    document.body.addEventListener("click", hidePopap);
}

/*Функція, що буде спрацьовувати при натисканні на ліву кнопку миші при виділенні тексту в інтпуті */
export const rightMouseClick = (e, id, select, elemToAppendEditButtons, startX, startY) => {
    if (e.type === "contextmenu") {
        const {
            left,
            right,
            top,
            bottom
        } = getPositionCursore(select(), startX, startY);

        const {
            clientX,
            clientY
        } = e;

        if (document.querySelector(".edit-buttons"))
            document.querySelector(".edit-buttons").remove();

        const firstParentElem = e.target ? e.target.parentElement ? e.target.parentElement : null : null;
        const secondParentElem = firstParentElem ? firstParentElem.parentElement ? firstParentElem.parentElement : null : null;
        const thirdParentElem = secondParentElem ? secondParentElem.parentElement ? secondParentElem.parentElement : null : null;
        const fourthParentElem = thirdParentElem ? thirdParentElem.parentElement ? thirdParentElem.parentElement : null : null;

        const selection = select();
        const firstParentSelection = selection.anchorNode ? selection.anchorNode.parentElement : null;
        const secondParentSelection = firstParentSelection ? firstParentSelection.parentElement ? firstParentSelection.parentElement : null : null;
        const thirdParentSelection = secondParentSelection ? secondParentSelection.parentElement ? secondParentSelection.parentElement : null : null;
        const fourthParentSelection = thirdParentSelection ? thirdParentSelection.parentElement ? thirdParentSelection.parentElement : null : null;
        const fivesParentSelection = fourthParentSelection ? fourthParentSelection.parentElement ? fourthParentSelection.parentElement : null : null;


        if ((e.target.id === id || (firstParentElem && firstParentElem.id === id) ||
                (secondParentElem && secondParentElem.id === id) || (thirdParentElem && thirdParentElem.id === id) ||
                (fourthParentElem && fourthParentElem.id === id)) &&
            selection.anchorNode &&
            (firstParentSelection && firstParentSelection.id === id ||
                (secondParentSelection && secondParentSelection.id === id) || (thirdParentSelection && thirdParentSelection.id === id) ||
                (fourthParentSelection && fourthParentSelection.id === id) ||
                (fivesParentSelection && fivesParentSelection.id === id)) && selection.toString()) {

            if (left <= clientX && clientX <= right &&
                top <= clientY && clientY <= bottom)
                writeEditInputMessageButtons(((left + right) / 2 - startX), top - startY, select, elemToAppendEditButtons);
        }

    }
}

/*Функція, що буде визначає координати початку та кінця виділеного тексту*/
export const getPositionCursore = (selection, defX, defY) => {
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const dummy = document.createElement("span");
        range.insertNode(dummy);
        let box = dummy.getBoundingClientRect();
        const {
            top,
            left
        } = box;
        dummy.parentNode.removeChild(dummy);


        const myRange2 = range.cloneRange();
        myRange2.collapse(false);
        myRange2.insertNode(dummy);

        box = dummy.getBoundingClientRect();
        dummy.parentNode.removeChild(dummy);

        const {
            bottom,
            right
        } = box;
        return {
            top,
            left,
            bottom,
            right
        };
    }

    return {
        defY,
        defX,
        defY,
        defX
    };
}

export default {rightMouseClick, getPositionCursore};