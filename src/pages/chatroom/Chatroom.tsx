import React, { useState,useEffect } from 'react';
import styles from './chatroom.module.scss';
import {useNavigate} from 'react-router'
const Chatroom = () => {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState<any>('');
  const [socket,setSocket] = useState<any>(null)
  const [username,setuser] = useState<any>(window.sessionStorage.getItem('username'))
  const [userList ,setUserList] = useState<any>([])
  const [open, setopen] = useState(false)
  const nav = useNavigate()
  useEffect(() => {
    if(!window.sessionStorage.getItem('username')){
        nav('/')
    }
    //创建新的websocket连接
    const newSocket = new WebSocket('ws://45.136.14.248:3989/chatroom?user='+window.sessionStorage.getItem('username'))
    newSocket.onopen=(e:any)=>{
        console.log(e);
        
    } 
    // 处理websocket 收到事件
    newSocket.onmessage = (e:any)=>{
        const data = JSON.parse(e.data)
        console.log(data);
        // 根据不同 的消息类型匹配
        switch(data.type){
            case 'chatroom' :{
                console.log(data,'我是chatroom');
                newMsg(data)
                break;
            }

            case 'chatroomListmsg': {
                console.log(data,'我是chatroomListmsg');
                msgList(data.data)
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
    newSocket.onerror = function(){
        
        // nav('/')
    }
    setSocket(newSocket);
    
    return ()=>{
        newSocket.close();
    }
  }, [])
  const setUsers = (list:any) =>{
    setUserList(()=>list)
  }
  const msgList = (newMsg:any) =>{
    
    setMessages((prevMessages:any)=> [...prevMessages, ...newMsg]);

    console.log(messages);

  }
  const newMsg = (newMsg:any)=>{
    setMessages((prevMessages:any)=> [...prevMessages,newMsg]);
  }
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg = {
        msg:newMessage,
        type:'sendMsg',
        from:username
      }
      socket.send(JSON.stringify(newMsg))
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setNewMessage('');
    }
  };
  const switchO = ()=>{
    setopen((e)=>!e)
  }
  return (
    <div className={styles.chatroomContainer}>
      <div className={styles.userList} style={{left:(open? '0':'-50')+'%'}}>
        <div className={styles.open}  onClick={switchO}>{!open? '打开':'关闭'}</div>
        <h3>在线用户</h3>
        {userList.map((v:any)=><div>{v}</div>)}
        {/* Display online users here */}
      </div>
      <div className={styles.chatSection}>
        <div className={styles.messages}>
          {messages.map((value:any, index:number) => (
            <div key={index} className={ value.from !=username ? [`${styles.messageBox}`,`${styles.rever}`].join(' '):styles.messageBox }>
                <div style={{width:'5%'}}></div>
                <div className={ value.from ==username ? [`${styles.message}`,`${styles.thismessage}`].join(' '):styles.message }>
                    {value.msg}
                </div>
                <div className={styles.user}>
                    <img className={styles.avatar} src="https://img2.baidu.com/it/u=319844890,3540750762&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=813" alt="" />
                    {value.from}
                </div>
            </div>
          ))}
        </div>
        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>发送✈</button>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
