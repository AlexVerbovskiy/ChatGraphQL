import React, {useRef, useState, useEffect} from 'react';
import styles from './Header.module.scss'
import {API_URL_AVATAR} from '../../../http/index';

const Header = props => {
    const user=props.userToSend;
    let src = user;
    src = src? src.photoUrl:null;
    src = src? API_URL_AVATAR+"/"+src: "/defaultUser.png";
    const isTyping = user.isTyping

    const statusRef = useRef(null);
    const [intervalId, setIntervalId] = useState(null)
    useEffect(()=>{
    if(user.isTyping){
        const changerTyping = setInterval(() =>{
            const str = statusRef.current.innerHTML;
            if(str[str.length-3]==='.')
                statusRef.current.innerHTML=str.substring(0, str.length - 3);
            else
                statusRef.current.innerHTML+='.'
        }, 300);

        setIntervalId(changerTyping);
    }else{
        clearInterval(intervalId);
    }
},[user.isTyping]);

    const classesNames = {
        btnToBack: props.theme==="dark"?styles.btnToBackDark:styles.btnToBack,
        header:"px-4 d-lg-block " + styles.header,
        profileUser:"d-flex align-items-center py-1 "+(props.theme==="dark"?styles.profileUserDark:styles.profileUser),
        status:user?.online?styles.online:styles.offline
    }

    return (<div className={classesNames.header}>
        <div><input type="button" value="&larr;" className={classesNames.btnToBack} onClick={props.changeActive}/></div>
        <div className={classesNames.profileUser}>
            <div className="position-relative">
                <img src={src} className="rounded-circle mr-1" alt={user?.fullName
                     || "default unworking chat"} width="40" height="40" />
            </div>
            <div className="flex-grow-1 pl-3 ">
                <strong>{user?.fullName || "default unworking chat"}</strong>
                <div className="text-muted small">
                    <em className={classesNames.status} ref={statusRef}>
                        {isTyping?"typing":user?.online?"online":"offline"}
                    </em>
                    </div>
            </div>
        </div>
    </div>);
}

export default Header;