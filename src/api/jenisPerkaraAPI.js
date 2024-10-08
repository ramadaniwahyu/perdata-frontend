import { useState, useEffect } from 'react'
import axios from 'axios'
import { rootUrl } from '../GlobalState'

function JenisPerkaraAPI(token) {
    const [data, setData] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        if (token){
            const getData = async () => {
                const res = await axios.get(`${rootUrl}/api/jenis-perkara`, {
                    headers: { Authorization: token }
                })
                setData(res.data)
            }
            getData()
        }
    }, [token, callback])

    return {
        data: [data, setData],
        callback: [callback, setCallback]
    }
}

export default JenisPerkaraAPI