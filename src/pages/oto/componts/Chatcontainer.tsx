import styles from './Chatcontainer.module.scss'
import { useEffect, useState } from 'react'
import { useOutletContext, useParams, useNavigate } from 'react-router'
import { Button, Avatar, Input } from 'antd'
import { LeftCircleOutlined ,SendOutlined} from '@ant-design/icons'
const { Search } = Input
const chatContainer = (props) => {
    // const [context,number] = useOutletContext()
    const [newMessage, setNewMessage] = useState<string>('');
    const params = useParams();
    const nav = useNavigate()
    const [username, setuser] = useState<any>(window.sessionStorage.getItem('username'))
    const { sendMsg } = props
    console.log(props.msgData);

    useEffect(() => {
        console.log(props);
        const window = document.getElementById('window')
        window.scrollTo(0, window.scrollHeight)
    }, [props])
    const send = () => {
        console.log(newMessage);
        sendMsg(newMessage, params.id)
        setNewMessage('')
    }
    return (
        <div className={styles.chatSection}>
            <div className={styles.top}>
                <div>
                    <Button type="text" onClick={() => { nav('/otochat') }} icon={<LeftCircleOutlined />} size={'middle'} />
                </div>
                <div>{params.id}</div>
                <div></div>
            </div>
            <div className={styles.messages} id='window'>
                {props.msgData[params.id]?.map((value: any, index: number) => (
                    <div key={index} className={value.from != username ? [`${styles.messageBox}`, `${styles.rever}`].join(' ') : styles.messageBox}>
                        <div style={{ width: '5%' }}></div>
                        <div className={value.from == username ? [`${styles.message}`, `${styles.thismessage}`].join(' ') : styles.message}>
                            {value.msg}
                        </div>
                        <div className={styles.user}>
                            <Avatar>{value.from}</Avatar>
                            {/* <img className={styles.avatar} src="https://img2.baidu.com/it/u=319844890,3540750762&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=813" alt="" />
                            {value.from} */}
                        </div>
                    </div>
                )) || ''}
            </div>
            <div className={styles.inputArea}>
                {/* 使用search代替了输入框 */}
                <Search
                    placeholder="输入内容"
                    allowClear
                    enterButton={<SendOutlined />}
                    size="middle"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onSearch={()=>{
                        send()
                    }}
                />

            </div>
        </div>
    )
}
export default chatContainer
