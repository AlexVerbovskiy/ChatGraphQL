import { useState, useEffect,useContext, useLayoutEffect, useRef } from 'react';
import Form from "./Form/index";
import Header from "./Header";
import styles from "../../style/SignPage.module.scss"
import {MainContext} from "../../App";

const SignForm = ({ typeForm }) => {

    const {theme: actualTheme} = useContext(MainContext)

    const [actualFile, setActualFile] = useState({
        data: '',
        type: '',
        name: ''
    })
    const [actualParentImg, setActualParentImg] = useState({
        width: 0,
        height: 0
    })

    const [isFirstRender, setIsFirstRender] = useState(true);

    const refImg = useRef();
    const refParentImg = useRef();

    const changeActualFile = (data = '', type = '', name = '') => setActualFile({ data, type, name });

    const onChangeAvatar = (data = '', type = '', name = '') => changeActualFile(data, type, name);

    const onClickRemove = () => changeActualFile();

    useEffect(() => {
        if (isFirstRender) {
            setActualParentImg((prev) => {
                const actualWidth = refParentImg.current.clientWidth;
                const actualHeight = refParentImg.current.clientWidth;

                return {
                    width: actualWidth,
                    height: actualHeight
                }
            });
            setIsFirstRender(false);
        } else {
            const correlationWidth = 1.0 * actualParentImg.width / refImg.current.width;
            const correlationHeight = 1.0 * actualParentImg.height / refImg.current.height;
            if (correlationWidth < correlationHeight) {
                refImg.current.style.width = actualParentImg.width;
                refImg.current.style.height = refImg.current.height * correlationWidth;
            } else {
                refImg.current.style.height = actualParentImg.height;
                refImg.current.style.width = refImg.current.width * correlationHeight;
            }
        }
    }, [actualFile])

    return (
        <section className="vh-100">
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className={`text-black ${styles.borRad} ${styles.card} ${actualTheme === "dark" ? styles.cardDark : ""}`}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">

                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <Header typeForm={typeForm} />
                                        <Form typeForm={typeForm} onChangeAvatar={onChangeAvatar}
                                            actualFile={actualFile} />
                                    </div>

                                    <div ref={refParentImg} className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2 login-image justify-content-center">
                                        <div id="previewImage" className={styles.previewImage}>
                                            {(typeForm === 1 && actualFile.type) && <div
                                                onClick={onClickRemove}
                                                className={styles.previewRemove}>&times;</div>}
                                            <img ref={refImg} src={(typeForm === 1 && actualFile.data) ||
                                                (actualTheme === "dark" ? "/defaultLoginDark.jpg" : "/defaultLogin.png")}
                                                className="img-fluid" id="avatar" alt="Sample" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    )
}

export default SignForm