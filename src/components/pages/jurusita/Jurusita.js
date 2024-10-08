import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { GlobalState, rootUrl } from '../../../GlobalState'

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

function Jurusita() {
    let emptyJurusita = {
        name: '',
        nip: '',
        phone: '',
        email: '',
        desc: ''
    }

    const state = useContext(GlobalState)
    const [jurusitas] = state.jurusitaAPI.data
    const [token] = state.token
    const [callback, setCallback] = state.jurusitaAPI.callback
    const [jurusita, setJurusita] = useState(emptyJurusita)
    const [onEdit, setOnEdit] = useState(false)
    const [selectedData, setSelectedData] = useState(null);
    const [metaKey] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const toast = useRef(null);

    const openNew = () => {
        setJurusita(emptyJurusita);
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

    const saveJurusita = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        if (onEdit) {
            const res = await axios.put(`${rootUrl}/api/jurusita/${jurusita._id}`, jurusita, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: res.data.msg, life: 3000 });
            setCallback(!callback)
            setOnEdit(false)
        } else {
            const res = await axios.post(`${rootUrl}/api/jurusita`, jurusita, {
                headers: { Authorization: token }
            })
            toast.current.show({ severity: 'primary', summary: 'Successful', detail: res.data.msg, life: 3000 });
        }
        setCallback(!callback)
        setDialog(false)
        setJurusita(emptyJurusita)
    };
    
    const deleteJurusita = async (event) => {
        event.preventDefault()
        const res = await axios.delete(`${rootUrl}/api/jurusita/${jurusita._id}`, {
            headers: { Authorization: token }
        })
        toast.current.show({ severity:'error', summary:'Successful', detail: res.data.msg, life: 3000 });
        setCallback(!callback)
        setDeleteDialog(false)
    }

    const editJurusita = (jurusita) => {
        setJurusita({ ...jurusita });
        setOnEdit(true)
        setDialog(true);
    };

    const confirmDeleteJurusita = (jurusita) => {
        setJurusita(jurusita);
        setDeleteDialog(true);
      };

    const onInputChange = e => {
        const { name, value } = e.target
        setJurusita({ ...jurusita, [name]: value })
    }

    const nameTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <Image alt={rowData.name} src={`https://robohash.org/${rowData._id}`} width={32} />
                <span>{rowData.name}</span>
            </div>
        );
    };

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveJurusita} />
        </>
    );
    const deleteDialogFooter = (
        <>
          <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
          <Button label="Yes" icon="pi pi-check" text onClick={deleteJurusita} />
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
                <Button icon="pi pi-pencil" severity="info" aria-label="Edit" onClick={() => editJurusita(rowData)} />
                <Button icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => confirmDeleteJurusita(rowData)} />
            </div>
        );
    };

    return (
        <>
            <header className="bg-white shadow gap-3">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Jurusita</h1>
                </div>
            </header>
            <main className='card m-6'>
                <Toast ref={toast} />
                <Toolbar className="mb-4" end={topButton}></Toolbar>
                <DataTable value={jurusitas} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="_id" metaKeySelection={metaKey} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Nama" body={nameTemplate} style={{ width: '20%' }}></Column>
                    <Column field="nip" header="NIP" style={{ width: '20%' }}></Column>
                    <Column field="phone" header="Telp" style={{ width: '20%' }}></Column>
                    <Column field="email" header="Email" style={{ width: '20%' }}></Column>
                    <Column field="action" header="Action" body={actionTemplate} style={{ width: '20%' }}></Column>
                </DataTable>

                <Dialog visible={dialog} style={{ width: '600px' }} header="Detil Jurusita" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                    {jurusita._id && <img src={`https://robohash.org/${jurusita._id}`} alt={jurusita.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                    <div className="field">
                        <label htmlFor="name">Nama</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText id="name" name="name" value={jurusita.name} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !jurusita.name })} />
                        </div>
                        {submitted && !jurusita.name && <small className="p-invalid">Name is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="nip">NIP</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-barcode"></i>
                            </span>
                            <InputText id="nip" name="nip" value={jurusita.nip} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !jurusita.nip })} />
                        </div>
                        {submitted && !jurusita.nip && <small className="p-invalid">NIP is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="phone">Telepon</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-phone"></i>
                            </span>
                            <InputText id="phone" name="phone" value={jurusita.phone} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !jurusita.phone })} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-envelope"></i>
                            </span>
                            <InputText id="email" name="email" value={jurusita.email} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !jurusita.email })} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="desc">Deskripsi</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-file-word"></i>
                            </span>
                            <InputTextarea id="desc" name="desc" value={jurusita.desc} onChange={onInputChange} required autoFocus rows={10} className={classNames({ 'p-invalid': submitted && !jurusita.desc })} />
                        </div>
                    </div>
                </Dialog>
                <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {jurusita && (
                            <span>
                                Yakin menghapus <b>{jurusita.name} ({jurusita.email})</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </main >
        </>
    )
}

export default Jurusita
