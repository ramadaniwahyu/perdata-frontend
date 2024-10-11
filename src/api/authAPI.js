import {useState, useEffect} from 'react'
import axios from 'axios'

function AuthAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [profile, setProfile] = useState(false)

    useEffect(() =>{
        if(token){
            const getUser = async () =>{
                try {
                    const res = await axios.get(`/api/profile`, {
                        headers: {Authorization: token}
                    })

                    setProfile(res.data)
                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)


                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser()
        }
    },[token])

    return {
        profile: [profile, setProfile],
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin]
    }
}

export default AuthAPI
 