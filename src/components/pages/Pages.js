import Dashboard from './dashboard/Dashboard'
import Login from './auth/Login'
import NotFound from './utils/errors/NotFound'
import Home from './home/Home'
import Users from './users/Users'
import { useContext } from 'react'
import { GlobalState } from '../../GlobalState'
import { Routes, Route } from "react-router-dom";
import Jurusita from './jurusita/Jurusita'
import Panggilan from './panggilan/Panggilan'
import Pegawai from './pegawai/Pegawai'
import NotAuthorize from './utils/errors/NotAuthorized'

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.authAPI.isLogged
    const [isAdmin] = state.authAPI.isAdmin

    return (
        <Routes>
            <Route path="/" exact element={isLogged ? <Dashboard /> : <Home />} />

            <Route path="/login" exact element={isLogged ? <Dashboard /> : <Login />} />

            <Route path="/panggilan" exact element={<Panggilan />} />
            <Route path="/jurusita" exact element={isAdmin ? <Jurusita /> : <NotFound />} />
            <Route path="/pegawai" exact element={isAdmin ? <Pegawai /> : <NotFound />} />
            <Route path="/pengguna" exact element={isAdmin ? <Users /> : <NotFound />} />

            <Route path="*" exact element={<NotFound />} />
        </Routes>
    )
}

export default Pages