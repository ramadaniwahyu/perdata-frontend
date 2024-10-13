import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { FileUpload } from 'primereact/fileupload'

function Panggilan() {
    const state = useContext(GlobalState)
    const [panggilans] = state.panggilanAPI.data
    const [callback, setCallback] = state.panggilanAPI.callback
    const [token] = state.token
    const [profile] = state.authAPI.profile
    const [jenis_perkaras] = state.jenisPerkaraAPI.data
    const [jenis_panggilans] = state.jenisPanggilanAPI.data
    const [hasil_panggilans] = state.hasilPanggilanAPI.data

    let emptyData = {
        jenis_perkara: '',
        nomor_perkara: '',
        pihak: '',
        alamat: '',
        jenis_panggilan: '',
        tgl_kirim: '',
        tgl_dilaksanakan: '',
        hasil_panggilan: '',
        desc: '',
        edoc: '',
        jurusita: profile.pegawai
    }

    const [panggilan, setPanggilan] = useState(emptyData)
    const [onEdit, setOnEdit] = useState(false)
    const [selectedData, setSelectedData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [metaKey] = useState(true);
    const [submitted, setSubmitted] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [docDialog, setDocDialog] = useState(false)
    const [fileURL, setFileURL] = useState(null)
    const toast = useRef(null);

    useEffect(()=> {
        //pass
    })

    const openNew = () => {
        setPanggilan(emptyData);
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

    const hideDocDialog = () => {
        setDocDialog(false);
    };

    const saveData = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        if (onEdit) {
            try {
                const res = await axios.put(`/api/panggilan/${panggilan._id}`, panggilan, {
                    headers: { Authorization: token }
                })
                toast.current.show({ severity: 'success', summary: 'Successful', detail: res.data.msg, life: 3000 });
                setCallback(!callback)
                setOnEdit(false)
                setDialog(false)
                setPanggilan(emptyData)
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'There is error', detail: error.message, life: 3000 });
            }
        } else {
            const res = await axios.post(`/api/panggilan`, panggilan, {
                headers: { Authorization: token }
            })
            console.log(panggilan);
            
            toast.current.show({ severity: 'primary', summary: 'Successful', detail: res.data.msg, life: 3000 });
            setCallback(!callback)
            setDialog(false)
            setPanggilan(emptyData)
        }

    };

    const deleteData = async (event) => {
        event.preventDefault()
        const res = await axios.delete(`/api/panggilan/${panggilan._id}`, {
            headers: { Authorization: token }
        })
        toast.current.show({ severity: 'error', summary: 'Successful', detail: res.data.msg, life: 3000 });
        setCallback(!callback)
        setDeleteDialog(false)
    }

    const uploadDoc = async (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const res = await axios.post(`/api/panggilan/${panggilan._id}/document`, formData,
            {
                headers: { Authorization: token }
            })
        toast.current.show({ severity: 'error', summary: 'Successful', detail: res.data.msg, life: 3000 });
        setCallback(!callback)
        setDocDialog(false)
    }

    const showData = (panggilan) => {
        setPanggilan({ ...panggilan });
        // console.log(panggilan);

        axios(`/file/${panggilan.edoc}`, {
            method: "GET",
            responseType: "blob",
            headers: { Authorization: token }
            //Force to receive data in a Blob Format
        })
            .then(response => {
                //Create a Blob from the PDF Stream
                const file = new Blob([response.data], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileLink = URL.createObjectURL(file);
                //Open the URL on new Window
                // window.open(fileLink);
                setFileURL(fileLink)
            })
            .catch(error => {
                console.log(error);
            });
        setDocDialog(true)
    };

    const editData = (panggilan) => {
        setPanggilan({ ...panggilan });
        setOnEdit(true)
        setDialog(true);
    };

    const confirmDelete = (panggilan) => {
        setPanggilan(panggilan);
        setDeleteDialog(true);
    };

    const onInputChange = e => {
        const { name, value } = e.target
        setPanggilan({ ...panggilan, [name]: value })
    }

    const handleFileSelect = e => {
        setSelectedFile(e.target.files)
    }

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveData} />
        </>
    );
    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteData} />
        </>
    );
    const docDialogFooter = (
        <>
            <Button label="Close" icon="pi pi-times" text onClick={hideDocDialog} />
            <Button label="Upload" icon="pi pi-arrow-up" text onClick={uploadDoc} />
        </>
    );

    const topButton = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2 " onClick={openNew} />
            </React.Fragment>
        )
    }

    const nomorTemplate = (rowData) => {
        return (
            <div className="flex flex-column align-items-center sm:align-items-start">
                <span><strong>Nomor Perkara: </strong><br />{rowData.nomor_perkara}</span><br />
                <span><strong>Jenis Panggilan: </strong><br />{rowData.jenis_panggilan.name}</span><br />
            </div>
        );
    };

    const pihakTemplate = (rowData) => {
        return (
            <div className="flex flex-column align-items-center sm:align-items-start">
                <span><strong>{rowData.pihak}</strong></span>
                <span>{rowData.alamat}</span>
            </div>
        );
    };

    const tglTemplate = (rowData) => {
        return (
            <div className="flex flex-column align-items-center sm:align-items-start">
                <span><strong>Tanggal Kirim: </strong><br />{rowData.tgl_kirim.toLocaleString("en-GB").slice(0, 10).split("-").reverse().join("/")}</span><br />
                <span><strong>Tanggal Pelaksanaan: </strong><br />{rowData.tgl_dilaksanakan.toLocaleString("en-GB").slice(0, 10).split("-").reverse().join("/")}</span>
            </div>
        );
    };

    const descTemplate = (rowData) => {
        return (
            <div className="flex flex-column align-items-center sm:align-items-start">
                <span><strong>Status: </strong><br />{rowData.hasil_panggilan.name}</span><br />
                <span><strong>Keterangan: </strong><br />{rowData.desc ? rowData.desc: 'Tidak ada keterangan.'}</span>
            </div>
        );
    };
    const docTemplate = (rowData) => {
        return (
            <div className="flex flex-column gap-3 mb-4">
                <Button icon="pi pi-file" severity="help" aria-label="Edit" onClick={() => showData(rowData)} />
            </div>
        );
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-3 mb-4">
                <Button icon="pi pi-pencil" severity="info" aria-label="Edit" onClick={() => editData(rowData)} />
                <Button icon="pi pi-trash" severity="danger" aria-label="Delete" onClick={() => confirmDelete(rowData)} />
            </div>
        );
    };

    return (
        <>
            <header className="bg-white shadow gap-3">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Panggilan</h1>
                </div>
            </header>
            <main className='card m-6'>
                <Toast ref={toast} />
                <Toolbar className="mb-4" end={profile.pegawai ? topButton : ''}></Toolbar>
                <DataTable value={panggilans} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} selectionMode="single" selection={selectedData} onSelectionChange={(e) => setSelectedData(e.value)} dataKey="_id" metaKeySelection={metaKey} tableStyle={{ minWidth: '10rem' }}>
                    {/* <Column field="_id" header="No" style={{ width: '5%' }}></Column> */}
                    <Column field="nomor_perkara" header="Nomor Perkara" body={nomorTemplate} style={{ width: '20%' }}></Column>
                    <Column field="pihak" header="Pihak" body={pihakTemplate} style={{ width: '20%' }}></Column>
                    <Column field="tgl_kirim" header="Tanggal Relaas" body={tglTemplate} style={{ width: '20%' }}></Column>
                    <Column field="desc" header="Keterangan" body={descTemplate} style={{ width: '25%' }}></Column>
                    {/* <Column field="document" header="Dokumen Elektronik" body={docTemplate} style={{ width: '5%' }}></Column> */}
                    <Column field="action" header="Action" body={profile.pegawai ? actionTemplate : ''} style={{ width: '10%' }}></Column>
                </DataTable>

                <Dialog visible={dialog} style={{ width: '800px' }} header="Detil Panggilan" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="nomor_perkara">Nomor Perkara</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-caret-right"></i>
                            </span>
                            <InputText id="nomor_perkara" name="nomor_perkara" value={panggilan.nomor_perkara} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !panggilan.nomor_perkara })} />
                        </div>
                        {submitted && !panggilan.nomor_perkara && <small className="p-invalid">Nomor Perkara is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="jenis_perkara">Jenis Perkara</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-tag"></i>
                            </span>
                            <Dropdown id="jenis_perkara" name="jenis_perkara" value={panggilan.jenis_perkara} onChange={onInputChange} options={jenis_perkaras} optionLabel='name'
                                filter className="md:w-20rem w-full" placeholder="Select a Jenis Perkara" />
                        </div>
                        {submitted && !panggilan.jenis_perkara && <small className="p-invalid">Jenis Perkara is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="jenis_panggilan">Jenis Relaas</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-tag"></i>
                            </span>
                            <Dropdown id="jenis_panggilan" name="jenis_panggilan" value={panggilan.jenis_panggilan} onChange={onInputChange} options={jenis_panggilans} optionLabel='name'
                                filter className="md:w-20rem w-full" placeholder="Select a Jenis Perkara" />
                        </div>
                        {submitted && !panggilan.jenis_panggilan && <small className="p-invalid">Jenis Panggilan is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="pihak">Nama Pihak</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText id="pihak" name="pihak" value={panggilan.pihak} onChange={onInputChange} required className={classNames({ 'p-invalid': submitted && !panggilan.pihak })} />
                        </div>
                        {submitted && !panggilan.pihak && <small className="p-invalid">Nama Pihak is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="alamat">Alamat Pihak</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-address-book"></i>
                            </span>
                            <InputText id="alamat" name="alamat" value={panggilan.alamat} onChange={onInputChange} required className={classNames({ 'p-invalid': submitted && !panggilan.alamat })} />
                        </div>
                        {submitted && !panggilan.alamat && <small className="p-invalid">Alamat Pihak is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="tgl_kirim">Tanggal Kirim</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-envelope"></i>
                            </span>
                            <Calendar id="tgl_kirim" dateFormat="dd/mm/yy" name="tgl_kirim" value={panggilan.tgl_kirim} onChange={onInputChange} required showIcon
                                className={classNames({ 'p-invalid': submitted && !panggilan.tgl_kirim })} />
                        </div>
                        {submitted && !panggilan.tgl_kirim && <small className="p-invalid">Tanggal Kirim is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="tgl_dilaksanakan">Tanggal Dilaksanakan</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-map"></i>
                            </span>
                            <Calendar id="tgl_dilaksanakan" dateFormat="dd/mm/yy" name="tgl_dilaksanakan" value={panggilan.tgl_dilaksanakan} onChange={onInputChange} showIcon
                                className={classNames({ 'p-invalid': submitted && !panggilan.tgl_dilaksanakan })} />
                        </div>
                        {submitted && !panggilan.tgl_dilaksanakan && <small className="p-invalid">Tanggal Dilaksanakan is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="hasil_panggilan">Hasil</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-tag"></i>
                            </span>
                            <Dropdown id="hasil_panggilan" name="hasil_panggilan" value={panggilan.hasil_panggilan} required onChange={onInputChange} options={hasil_panggilans} optionLabel='name'
                                filter placeholder="Select a Jenis Perkara" className={classNames({ 'p-invalid': submitted && !panggilan.hasil_panggilan })} />
                        </div>
                        {submitted && !panggilan.hasil_panggilan && <small className="p-invalid">Hasil is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="desc">Deskripsi</label>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-file-word"></i>
                            </span>
                            <InputTextarea id="desc" name="desc" value={panggilan.desc} onChange={onInputChange} rows={7} />
                        </div>
                    </div>
                </Dialog>
                <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {panggilan && (
                            <span>
                                Yakin menghapus?
                            </span>
                        )}
                    </div>
                </Dialog>
                <Dialog visible={docDialog} style={{ width: '800px' }} header="Konfirmasi" modal footer={docDialogFooter} onChange={handleFileSelect} onHide={hideDocDialog}>
                    <div className="flex flex-column justify-content-center">
                    <div className="field">
                        <label htmlFor="file">Dokumen Elektronik</label>
                        <div className="p-inputgroup">
                            <FileUpload mode="basic" name="file" onUpload={uploadDoc} accept="application/pdf"/><br />
                        </div>
                    </div>

                        <iframe src={fileURL} height='500px' />

                    </div>
                </Dialog>
            </main >
        </>
    )
}

export default Panggilan
