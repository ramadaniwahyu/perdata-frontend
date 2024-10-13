import { useState, useEffect } from 'react'
import axios from 'axios'

function JabatanAPI(token) {
    const [data, setData] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        if (token){
            const getData = async () => {
                const res = await axios.get(`/api/jabatan`, {
                    headers: { Authorization: token }
                })
                setData(res.data)
            }
            getData()
        }
        setCallback(true)
    }, [token, callback])

    return {
        data: [data, setData],
        callback: [callback, setCallback]
    }
}

export default JabatanAPI