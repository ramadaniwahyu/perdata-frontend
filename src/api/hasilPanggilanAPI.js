import { useState, useEffect } from 'react'
import axios from 'axios'

function HasilPanggilanAPI(token) {
    const [data, setData] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        if (token){
            const getData = async () => {
                const res = await axios.get(`/api/hasil-panggilan`, {
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

export default HasilPanggilanAPI