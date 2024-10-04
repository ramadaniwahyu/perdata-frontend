import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Menubar } from 'primereact/menubar';
import { GlobalState } from '../../GlobalState'
import axios from 'axios'

export default function Header() {
    const state = useContext(GlobalState)
    const [isAdmin] = state.authAPI.isAdmin
    const [isLogged] = state.authAPI.isLogged

    const logoutUser = async () => {
        await axios.get('/api/logout')

        localStorage.removeItem('firstLogin')

        window.location.href = "/";
    }

    const itemRenderer = (item) => (
        <Link to={item.url} className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
        </Link>
    );

    const items = [
        {
            label: 'Panggilan',
            icon: 'pi pi-file-arrow-up',
            url: '/panggilan',
            template: itemRenderer
        },
        {
            label: 'Jurusita',
            icon: 'pi pi-users',
            url: '/jurusita',
            template: itemRenderer
        }
    ]

    const adminItems = [
        {
            label: 'Panggilan',
            icon: 'pi pi-file-arrow-up',
            url: '/panggilan',
            template: itemRenderer
        },
        {
            label: 'Jurusita',
            icon: 'pi pi-users',
            url: '/jurusita',
            template: itemRenderer
        },
        {
            label: 'Referensi',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'Jenis Perkara',
                    icon: 'pi pi-tags',
                    url: '/jenis-perkara',
                    template: itemRenderer
                },
                {
                    label: 'Jenis Panggilan',
                    icon: 'pi pi-tags',
                    url: '/jenis-perkara',
                    template: itemRenderer
                },
                {
                    label: 'Hasil Panggilan',
                    icon: 'pi pi-tags',
                    url: '/jenis-perkara',
                    template: itemRenderer
                },
                {
                    label: 'Pengguna',
                    icon: 'pi pi-user',
                    url: '/pengguna',
                    template: itemRenderer
                }
            ]
        },
    ];

    const start = (
        <Link to='/'>
        <img alt="logo" src="/logo.png" height="40" className="mr-2" />
        </Link>
    );
    const end = (
        <div className="flex align-items-center gap-2">
            {
                isLogged ? <Link className="flex align-items-center p-menuitem-link"
                onClick={logoutUser}>
                    Log out
                </Link>
                : <Link to='/login' className="flex align-items-center p-menuitem-link"> Log in
                </Link>
            }
        </div>
    );

    return (
        <>
            <div className="card m-6">
                {
                    isAdmin ? <Menubar model={adminItems} start={start} end={end} /> :
                    isLogged ? <Menubar model={items} start={start} end={end} />:
                    <Menubar start={start} end={end} />
                }
            </div>
        </>
    )
}