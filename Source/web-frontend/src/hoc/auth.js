import React, {useEffect} from 'react'
import { auth } from '../_actions/userAction'
import { useSelector, useDispatch } from 'react-redux'


export default function (ComposedClass, reload, adminRoute = null){
    function AuthenticationUser(props){
        let user = useSelector(state => state.user);
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(auth())
                .then(response =>{
                    //로그인 안 하는상태
                    if(!response.payload.isAuth){
                        if(reload){
                            props.history.push('/signup')
                        }
                    }else{
                        if(adminRoute && response.payload.isAdmin){
                            props.history.push('/')
                        }else{
                            if(reload === false){
                                props.history.push('/')
                            }
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
        },[dispatch, props.history, user.googleAuth])

        return (
            <ComposedClass {...props} user={user} />
        )
    }
    return AuthenticationUser;
}