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
                const value = res.data.result
                let data_array = []                
                value.map(item => {
                    let set = {}
                    set['_id'] = item._id
                    set['nomor_perkara'] = item.nomor_perkara
                    set['jenis_panggilan'] = item.jenis_panggilan
                    set['jenis_perkara'] = item.jenis_perkara
                    set['pihak'] = item.pihak
                    set['alamat'] = item.alamat
                    set['tgl_kirim'] = new Date(item.tgl_kirim)
                    set['tgl_dilaksanakan'] = new Date(item.tgl_dilaksanakan)
                    set['hasil_panggilan'] = item.hasil_panggilan
                    set['desc'] = item.desc
                    set['edoc'] = item.edoc
                    data_array.push(set)
                })                
                setData(data_array)
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

export default PanggilanAPI