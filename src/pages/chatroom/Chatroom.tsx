import React, { useState,useEffect } from 'react';
import styles from './chatroom.module.scss';
import {useNavigate} from 'react-router'
const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket,setSocket] = useState(null)
  const [username,setuser] = useState(window.sessionStorage.getItem('username'))
  const nav = useNavigate()
  useEffect(() => {
    if(!window.sessionStorage.getItem('username')){
        nav('/')
    }

    const newSocket = new WebSocket('ws://localhost:3000/chatroom?user='+window.sessionStorage.getItem('username'))
    newSocket.onopen=(e)=>{
        console.log(e);
        
    } 
    newSocket.onmessage = (e)=>{
        const data = JSON.parse(e.data)
        console.log(data);
        
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
            case 'error': {
                console.log(data,'error');
                msgList(data.data)
                break;
            }
        }
         //   newMsg()
    }  
    newSocket.onerror = function(e,j){
        console.log(e,j);
        
        // nav('/')
    }
    setSocket(newSocket);
    
    return ()=>{
        newSocket.close();
    }
  }, [])
  const msgList = (newMsg) =>{
    
    setMessages((prevMessages)=> [...prevMessages, ...newMsg]);

    console.log(messages);

  }
  const newMsg = (newMsg)=>{
    setMessages((prevMessages)=> [...prevMessages,newMsg]);
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

  return (
    <div className={styles.chatroomContainer}>
      <div className={styles.userList}>
        <h3>Online Users</h3>
        {/* Display online users here */}
      </div>
      <div className={styles.chatSection}>
        <div className={styles.messages}>
          {messages.map((value, index) => (
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
          <button onClick={handleSendMessage}>Send✈</button>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
