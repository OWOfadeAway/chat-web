import React, { useState,useEffect } from 'react';
import styles from './Oto.module.scss';
import {useNavigate , useLocation ,useParams ,Route,Routes} from 'react-router'
import { AudioOutlined ,MessageTwoTone} from '@ant-design/icons'
import { Input ,List ,Avatar ,Button} from 'antd';
import Chatcontainer from './componts/Chatcontainer';

const { Search } = Input;
const UserSerch = ()=>{
  const [searchData , setSearchData] = useState<any>([{username:'asd'}])
  const [searchText , setsearchText] = useState<string>('')
  const nav = useNavigate()

  const tomsg = (id) =>{
    nav('/otochat/'+id)
  } 
  const search = (e)=>{
    setSearchData([{username:searchText}])
  }
  return (
    <div className={styles.chatSection}>
            <Search placeholder="搜索用户" value={searchText} onInput={(e:any)=>{setsearchText(e.target.value)}} onSearch={search} enterButton />
            <List
              dataSource={searchData}
              renderItem={(item) => (
                <List.Item key={item.username}>
                  <List.Item.Meta
                    avatar={<Avatar>{item.username}</Avatar>}
                    title={<a>{item.username}</a>}
                    description={item.email}
                  />
                  <div><Button type="primary" shape="round" onClick={()=>tomsg(item.username)} icon={<MessageTwoTone />} size={'large'} /></div>
                </List.Item>
              )}
            />
          </div>
  )
  }
const Oto = () => {
  const [messages, setMessages] = useState<any>([]);
  const [socket,setSocket] = useState<any>(null)
  const [username,setuser] = useState<any>(window.sessionStorage.getItem('username'))
  const [open, setopen] = useState(false)
  const [msgList , setMsgList] = useState<string[]>([])
  const [msgdata , setmsgdata] = useState<object>([])
  const [router,setRouter] = useState<string>('')
  const [number,setNum] = useState(0)
  const loca = useLocation()
  
  const parmas = useParams()
  const nav = useNavigate()
  useEffect(() => {
    //监听路由变化
    
    if(!window.sessionStorage.getItem('username')){
        nav('/')
    }
    //创建新的websocket连接
    const newSocket = new WebSocket('ws://45.136.14.248:3989/testWs?user='+window.sessionStorage.getItem('username'))
    newSocket.onopen=(e:any)=>{
        console.log(e);
    } 
    // 处理websocket 收到事件
    newSocket.onmessage = (e:any)=>{
        const data = JSON.parse(e.data)
        console.log(data);
        //保存获取的未接受的历史消息
        if(data.type === 'msglist'){
          setmsgdata(()=>data.data)
          }
          console.log(parmas);

        // 根据不同 的消息类型匹配
        switch(data.type){
            case 'msglist' :{
                getList(data.data)
                break;
            }

            case 'msg': {
                console.log('case');
                getmsg(data);
                
                break;
            }
            case 'userList' :{
                setUsers(data.data)
                break;
            }
            case 'error': {
                console.log(data,'error');
                msgList(data.data)
                break;
            }
        }
         //   newMsg()
    }  
    // 处理websocket 错误事件
    newSocket.onerror = function(e){
        console.log(e);
        
        // nav('/')
    }
    setSocket(newSocket);
    return ()=>{
        newSocket.close();  

    }
  }, [])
  //受到消息响应
  const getmsg = (newdata)=>{
    setmsgdata((msgdata)=>{
      msgdata = JSON.parse(JSON.stringify(msgdata))
      if(msgdata.hasOwnProperty(newdata.from)){
        msgdata[newdata.from].push(newdata)
        msgList.includes(newdata.from)?setMsgList((msglist)=>[...msglist,newdata.from]):null
        
      }else{
        msgdata[newdata.from] = [newdata]
        setMsgList((msglist)=>[...msglist,newdata.from])
      }
      return { ...msgdata }
    })
  }
  const getList = (data) =>{
    console.log(Object.keys(data));
    
    setMsgList((e)=>Object.keys(data)) 
  }

  const handleSendMessage = (msg:string,to:string) => {
    if (msg.trim() !== '') {
      const newMsg = {
        msg,
        type:'sendMsg',
        from:username,
        to
      }
      console.log(socket.readyState);
      
      socket.send(JSON.stringify(newMsg))
      setmsgdata((msgdata)=>{
        msgdata = JSON.parse(JSON.stringify(msgdata))
          msgdata.hasOwnProperty(newMsg.to) ? msgdata[newMsg.to].push(newMsg):(msgdata[newMsg.to] = [newMsg])
          msgList.includes(newMsg.to)?null:setMsgList((msglist)=>[...msglist,newMsg.to])
        return { ...msgdata }
      })
    }
  };
  const switchO = ()=>{
    setopen((e)=>!e)
  }
 

  return (
    <div className={styles.chatroomContainer}>
      <div className={styles.userList} style={{left:(open? '0':'-50')+'%'}}>
        <div className={styles.open}  onClick={switchO}>{!open? '打开':'关闭'}</div>
        <h3>聊天列表</h3>
        {msgList.map((v:string)=>{
          return (<div key={v} className={v == parmas['*'] ? [`${styles.user}`, `${styles.select}`].join(' ') : styles.user} onClick={()=>{nav('/otochat/'+v)}}>
            <img src="https://avatars.githubusercontent.com/u/30753898?v=4" alt="" />
            {v}
            </div>)
        })}
        {/* Display online users here */}
        {}
      </div>
        <Routes>
          {/* userSerch */}
          <Route path='/:id' element={<Chatcontainer key={msgdata[parmas.id]?.length || 0} sendMsg={handleSendMessage} msgData={msgdata}/>}></Route>
          <Route path='/*' element={<UserSerch/>}></Route>
        </Routes>
    </div>
  );
};



export default Oto;
