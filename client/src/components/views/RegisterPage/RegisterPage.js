import { withRouter } from 'react-router-dom';
import React,{useState} from 'react'
import {useDispatch} from 'react-redux'
import {registerUser} from '../../../_action/user_action'

function RegisterPage(props) {
    const dispatch = useDispatch()

    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event)=>{
        setEmail(event.currentTarget.value)
    }
    const onNamedHandler = (event)=>{
        setName(event.currentTarget.value)
    }
    const onPasswordHandler = (event)=>{
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event)=>{
        setConfirmPassword(event.currentTarget.value)
    }

    const onsubmitHandler = (event)=>{
        event.preventDefault()

        if (Password!=ConfirmPassword){
            return alert('비밀번호가 서로 일치하지 않습니다.')
        }

        let body={
            email:Email,
            name:Name,
            password:Password,
            confirmPassword:ConfirmPassword
        }

        dispatch(registerUser(body))
            .then(response=>{
                if (response.payload.success){
                    props.history.push('/')
            } else{
                alert('Error')
            }
        })        
    }

    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems:'center',
            width:'100%', height:'100vh'
        }}>
            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit={onsubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Name</label>
                <input type="text" value={Name} onChange={onNamedHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>ConfirmPassword</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <br />
                <button>
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
