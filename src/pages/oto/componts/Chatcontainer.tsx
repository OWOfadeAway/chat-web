import styles from './Chatcontainer.module.scss'
import { useEffect, useState } from 'react'
import { useOutletContext ,useParams ,useNavigate} from 'react-router'
import { Button } from 'antd'
import { LeftCircleTwoTone } from '@ant-design/icons'
const chatContainer = (props) => {
    // const [context,number] = useOutletContext()
    const [newMessage, setNewMessage] = useState<any>('');
    const params = useParams();
    const nav = useNavigate()
    const [username,setuser] = useState<any>(window.sessionStorage.getItem('username'))
    console.log(props.msgData);
    useEffect(() => {
        console.log(props.msgData);
    },[props])
    return (
        <div className={styles.chatSection}>
            <div className={styles.top}> 
                <div>
                    <Button type="text" onClick={()=>{nav('/otochat')}} icon={<LeftCircleTwoTone />} size={'middle'} />
                </div>
                <div>{params.id}</div>
                <div></div>
            </div>
            <div className={styles.messages}>
                {props.msgData[params.id]?.map((value: any, index: number) => (
                    <div key={index} className={value.from != username ? [`${styles.messageBox}`, `${styles.rever}`].join(' ') : styles.messageBox}>
                        <div style={{ width: '5%' }}></div>
                        <div className={value.from == username ? [`${styles.message}`, `${styles.thismessage}`].join(' ') : styles.message}>
                            {value.msg}
                        </div>
                        <div className={styles.user}>
                            <img className={styles.avatar} src="https://img2.baidu.com/it/u=319844890,3540750762&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=813" alt="" />
                            {value.from}
                        </div> 
                    </div>
                )) || ''}
            </div>
            <div className={styles.inputArea}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={()=>{}}>发送✈</button>
            </div>
        </div>
    )
}
export default chatContainer
