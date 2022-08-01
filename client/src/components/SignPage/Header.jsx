import styles from '../../style/Header.module.scss'
import { useContext } from 'react';
import {MainContext} from '../../App';


const Header = props => {
    const {theme} = useContext(MainContext)
    const { typeForm } = props;

    return (
        <p className={`text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 ${theme==="dark"?styles.headerNameDark:""}`}>
            {typeForm===0?"Sign in":"Sign up"}
        </p>
    )

}

export default Header;
