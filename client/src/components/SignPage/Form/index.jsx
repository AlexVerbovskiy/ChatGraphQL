import Signin from './Signin';
import Signup from './Signup';

const Form = props => {

    const { typeForm, actualFile, onChangeAvatar } = props;

    if (typeForm === 0)
        return  <Signin/>
    return <Signup actualFile={actualFile} onChangeAvatar={onChangeAvatar}/>

}

export default Form;