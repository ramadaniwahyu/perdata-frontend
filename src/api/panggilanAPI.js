import { useState, useEffect } from 'react'
import axios from 'axios'

function PanggilanAPI(token) {
    const [data, setData] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        if (token){
            const getData = async () => {
                const res = await axios.get('/api/panggilan', {
                    headers: { Authorization: token }
                })
                setData(res.data.result)
            }
            getData()
        }
    }, [token, callback, data])

    return {
        data: [data, setData],
        callback: [callback, setCallback]
    }
}

export default PanggilanAPI