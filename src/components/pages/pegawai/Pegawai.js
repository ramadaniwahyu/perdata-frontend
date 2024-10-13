import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Image } from 'primereact/image'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'

function Pegawai() {
    let emptyPegawai = {
        name: '',
        nip: '',
        jabatan: '',
        phone: '',
        email: '',
        desc: ''
    }

    const state = useContext(GlobalState)
    const [pegawais] = state.pegawaiAPI.data
    const [jabatans] = state.jabatanAPI.data
    const [token] = state.token
    const [callback, setCallback] = state.pegawaiAPI.callback
    const [pegawai, setPegawai] = useState(emptyPegawai)
    const [onEdit, setOnEdit] = useState(false)
    const [selectedData, setSelectedData] = useState(null);
    const [metaKey] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const toast = useRef(null);

    const openNew = () => {
        setPegawai(emptyPegawai);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const savePegawai = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        if (onEdit) {
            const res = await axios.put(`/api/pegawai/${pegawai._id}`, pegawai, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: res.data.msg, life: 3000 });
            setCallback(!callback)
            setOnEdit(false)
        } else {
            const res = await axios.post(`/api/pegawai`, pegawai, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'primary', summary: 'Successful', detail: res.data.msg, life: 3000 });
        }
        setCallback(!callback)
        setDialog(false)
        setPegawai(emptyPegawai)
    };

    const deletePegawai = async (event) => {
        event.preventDefault()
        const res = await axios.delete(`/api/pegawai/${pegawai._id}`, {
            headers: { Authorization: token }
        })
        toast.current.show({ severity: 'error', summary: 'Successful', detail: res.data.msg, life: 3000 });
        setCallback(!callback)
        setDeleteDialog(false)
    }

    const editPegawai = (pegawai) => {
        setPegawai({ ...pegawai });
        console.log(pegawai);
        
        setOnEdit(true)
        setDialog(true);
    };

    const confirmDeletePegawai = (pegawai) => {
        setPegawai(pegawai);
        setDeleteDialog(true);
    };

    const onInputChange = e => {
        const { name, value } = e.target
        setPegawai({ ...pegawai, [name]: value })
    }

    const nameTemplate = (rowData) => {
        return (
            <div className="flex flex-row align-items-center gap-4">
                <Image alt={rowData.name} src={`https://robohash.org/${rowData._id}`} width={64} />
                <div className="flex flex-column justify-content-between align-items-center flex-1">
                    <span>{rowData.name}<br />{rowData.nip}</span>
                </div>
            </div>
        );
    };

    const phoneTemplate = (rowData) => {
        return (
            <div className="flex flex-column align-items-center sm:align-items-start">
                <span>{rowData.phone}<br />{rowData.email}</span>
            </div>
        );
    };

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={savePegawai} />
        </>
    );
    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePegawai} />
        </>
    );

    const topButton = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
            </React.Fragment>
        )
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap justify-content-center gap-3 mb-4">
                <Button icon="pi pi-pencil" severity="info" aria-label="Edit" onClick={() => editPegawai(rowData)} />
                <Button icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => confirmDeletePegawai(rowData)} />
            </div>
        );
    };

    return (
        <>
            <header className="bg-white shadow gap-3">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pegawai</h1>
                </div>
            </header>
            <main className='card m-6'>
                <Toast ref={toast} />
                <Toolbar className="mb-4" end={topButton}></Toolbar>
                <DataTable value={pegawais} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="_id" metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Nama" body={nameTemplate} style={{ width: '20%' }}></Column>
                    <Column field="jabatan.name" header="Jabatan" style={{ width: '20%' }}></Column>
                    <Column field="phone" header="Telp/Email" body={phoneTemplate} style={{ width: '20%' }}></Column>
                    <Column field="action" header="Action" body={actionTemplate} style={{ width: '20%' }}></Column>
                </DataTable>

                <Dialog visible={dialog} style={{ width: '600px' }} header="Detil pegawai" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                    {pegawai._id && <img src={`https://robohash.org/${pegawai._id}`} alt={pegawai.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText id="name" name="name" value={pegawai.name} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !pegawai.name })} />
                        </div>
                        {submitted && !pegawai.name && <small className="p-invalid">Name is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="nip">NIP</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-barcode"></i>
                            </span>
                            <InputText id="nip" name="nip" value={pegawai.nip} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !pegawai.nip })} />
                        </div>
                        {submitted && !pegawai.nip && <small className="p-invalid">NIP is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="jabatan">Jabatan</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-tag"></i>
                            </span>
                            <Dropdown id="jabatan" name="jabatan" value={pegawai.jabatan} required onChange={onInputChange} options={jabatans} optionLabel='name'
                                filter placeholder="Select a Jabatan" className={classNames({ 'p-invalid': submitted && !pegawai.jabatan })} />
                        </div>
                        {submitted && !pegawai.jabatan && <small className="p-invalid">Jabatan is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="phone">Telepon</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-phone"></i>
                            </span>
                            <InputText id="phone" name="phone" value={pegawai.phone} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !pegawai.phone })} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-envelope"></i>
                            </span>
                            <InputText id="email" name="email" value={pegawai.email} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !pegawai.email })} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="desc">Deskripsi</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-file-word"></i>
                            </span>
                            <InputTextarea id="desc" name="desc" value={pegawai.desc} onChange={onInputChange} required autoFocus rows={10} className={classNames({ 'p-invalid': submitted && !pegawai.desc })} />
                        </div>
                    </div>
                </Dialog>
                <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {pegawai && (
                            <span>
                                Yakin menghapus <b>{pegawai.name} ({pegawai.email})</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </main >
        </>
    )
}

export default Pegawai
