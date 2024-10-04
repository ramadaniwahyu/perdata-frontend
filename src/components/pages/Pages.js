import Dashboard from './dashboard/Dashboard'
import Login from './auth/Login'
import NotFound from './utils/not_found/NotFound'
import Home from './home/Home'
import Users from './users/Users'
import { useContext } from 'react'
import { GlobalState } from '../../GlobalState'
import { Routes, Route } from "react-router-dom";
import Jurusita from './jurusita/Jurusita'
import Panggilan from './panggilan/Panggilan'

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.authAPI.isLogged
    const [isAdmin] = state.authAPI.isAdmin

    return (
        <Routes>
            <Route path="/" exact element={isLogged ? <Dashboard /> : <Home />} />

            <Route path="/login" exact element={isLogged ? <Dashboard /> : <Login />} />

            <Route path="/panggilan" exact element={<Panggilan />} />
            <Route path="/jurusita" exact element={<Jurusita />} />
            <Route path="/pengguna" exact element={isAdmin ? <Users /> : <Login />} />

            <Route path="*" exact element={<NotFound />} />
        </Routes>
    )
}

export default Pages