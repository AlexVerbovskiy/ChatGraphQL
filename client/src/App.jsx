import { useState, createContext, useEffect } from "react";
import SignForm from "./components/SignPage";
import styles from "./style/App.module.scss";
import { useLazyQuery, useSubscription,useApolloClient  } from "@apollo/client";
import {CHECK_AUTH} from "./queries/user";
import ChatPage from "./components/ChatPage";
import Loader from "./components/Loader";
import ErrorShower from "./components/ErrorShower";

export const MainContext = createContext();

const App = () => {
  const [actualPage, setActualPage] = useState(0);
  const [actualUserId, setActualUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actualTheme, setActualTheme] = useState(
    localStorage.getItem("actualTheme") || "light"
  );
  const [checkAuth, {data: userData, error: userError, loading: userLoading, refetch }] = useLazyQuery(CHECK_AUTH, {variables: {userInfo:
    {id: localStorage.getItem("userId"),
   hashedPassword:localStorage.getItem("hashedPassword")
  }}})

  const isAuth = ()=>{
    if(localStorage.getItem("userId"))
      checkAuth({variables:{userInfo:{
        id: localStorage.getItem("userId"),
        hashedPassword:localStorage.getItem("hashedPassword")
      }}})
  }

  useEffect(()=>isAuth(), [])

    useEffect(()=>{
      if(userData && userData.checkAuth?.id) {
        setActualUserId(userData.checkAuth.id)
        setActualPage(2);
      }else
        setActualPage(0);
    }, [userData])

    if(userError) console.log(userError);
    if(userLoading) console.log(userLoading);


  const changeTheme = () => {
    if (actualTheme === "dark") setActualTheme("light");
    else setActualTheme("dark");
  };

  useEffect(
    () => {
      localStorage.setItem("actualTheme", actualTheme);
      if (actualTheme === "dark") document.body.classList.add("dark-theme");
      else document.body.classList.remove("dark-theme");
    },
    [actualTheme]
  );

    useEffect(()=>console.log(isLoading), [isLoading])

    const client = useApolloClient();
    if(!client)
      return <Loader />

  return (
<MainContext.Provider
        value={{ theme: actualTheme, setActualPage, changeTheme, login:isAuth, setIsLoading, setError }}
      >
        {isLoading && <Loader />}
        {actualPage===2?
        <ChatPage actualUserId={actualUserId}/>:
    <div className={styles.App}>
      {error && <ErrorShower error={error} setError={setError}/>}
        <SignForm typeForm={actualPage} />
    </div>}
    </MainContext.Provider>
  );
};

export default App;
