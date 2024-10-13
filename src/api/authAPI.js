import {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { GlobalState } from '../GlobalState'

function AuthAPI(token) {
    // const state = useContext(GlobalState)
    // const [jurusita, setJurusita] = state.panggilanAPI.jurusita
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
                    // setJurusita(res.data.pegawai)
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
 