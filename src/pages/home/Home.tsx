import style from "./home.module.scss";
import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router'
const Home = () => {
  const [username, setuser] = useState('')
  const nav = useNavigate()
  useEffect(() => {
    setuser(window.sessionStorage.getItem('username'))
    console.log(window.sessionStorage.getItem('username'));

    window.sessionStorage.getItem('username') ? null : nav('/') 
  }, [])
  const logout = (e) =>{
    e.preventDefault()
    window.sessionStorage.removeItem('username')
    nav('/') 
  }
  
  return (<div className={style.mine}>
            <div className={style.user}>用户：{username}</div>
            <a className={style.logout} href="" onClick={(e)=>{ logout(e)}}>登出</a>
            <div className={style.chatroom} onClick={()=>nav('/chatroom')}>聊天室聊天</div>
            <div className={style.otochat}>一对一聊天</div>
        </div>)
};

export default Home;
