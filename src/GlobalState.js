import React, {createContext, useState, useEffect} from 'react'

import AuthAPI from './api/authAPI'
import UserAPI from './api/userAPI'
import JurusitaAPI from './api/jurusitaAPI'
import JenisPerkaraAPI from './api/jenisPerkaraAPI'
import JenisPanggilanAPI from './api/jenisPanggilanAPI'
import HasilPanggilanAPI from './api/hasilPanggilanAPI'
import PanggilanAPI from './api/panggilanAPI'

import axios from 'axios'

export const GlobalState = createContext()

export const rootUrl = process.env.NODE_ENV === "production" ? "http://localhost:8000" : ""

export const DataProvider = ({children}) =>{
    const [token, setToken] = useState(false)

    useEffect(() =>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            const refreshToken = async () =>{
                const res = await axios.get(`${rootUrl}/api/refresh_token`)
                console.log(res);
                
        
                setToken(res.data.accesstoken)                
    
                setTimeout(() => {
                    refreshToken()
                }, 10 * 60 * 1000)
            }

            refreshToken()
        }
    },[])

    const state = {
        token: [token, setToken],
        authAPI: AuthAPI(token),
        jurusitaAPI: JurusitaAPI(token),
        jenisPanggilanAPI: JenisPanggilanAPI(token),
        jenisPerkaraAPI: JenisPerkaraAPI(token),
        hasilPanggilanAPI: HasilPanggilanAPI(token),
        panggilanAPI: PanggilanAPI(token),
        userAPI: UserAPI(token)
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}