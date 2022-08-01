import React from "react";
import generateSmilesArray from '../../../../utils/generateSmilesArray';

const EmojiBlock = props => {
    const emojiList = generateSmilesArray();

    const handlerClick = (elem)=>props.MessageInputRef.current.innerHTML+=elem;

    return (
        <>{emojiList.map((elem, id) => {

            const emoji = String.fromCodePoint(parseInt(elem, 16))
            return <div onClick={()=>handlerClick(emoji)} key={id}>{emoji}</div>
        }
        )} </>
    )
}

export default EmojiBlock;