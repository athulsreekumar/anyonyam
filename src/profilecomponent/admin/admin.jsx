import "./admin.scss";
import "./../Profile/modalStyle.scss"
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import ReactLoading from "react-loading";
import { useDownloadExcel } from 'react-export-table-to-excel';
import { PieChart } from '@mui/x-charts/PieChart';
import { utils as XLSXUtils, write as writeXLSX } from 'xlsx';
import { saveAs } from 'file-saver';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

export default function Admin(loggedInUser) {



    const [name, setName] = useState(loggedInUser?.name || '');
    const [loading, setLoading] = useState(true)
    const [notpaid, setNotPaid] = useState()
    const [totalMembers, setTotalMembers] = useState()
    const [unpaidProfile, setUnpaidProfile] = useState([]);
    const [pendingAmount, setPendingAmount] = useState('');
    const tableRef = useRef(null);
    const [isFormVisible, setFormVisibility] = useState(false);
    const [selectedMember, setSelectedMember] = useState([]);
    const [isCreateFormVisible, setCreateFormVisible] = useState(false);
    const [amount, setAmount] = useState('');

    // const [isAdmin, setIsAdmin] = useState(false);

    const [subscriptionData, setSubscriptionData] = useState({
        greaterThan2000: 0,
        between1000And2000: 0,
        lessThan1000: 0
    });

    const [formData, setFormData] = useState({
        Name: '',
        Illam: '',
        Mobile: '',
        Area: '',
        DOB: '',
        Relationship: 'MEMBER',
        Subscription: ''
    });

    const toggleCreateFormVisibility = () => {
        setCreateFormVisible(!isCreateFormVisible);
        // setTempState(selectedProfiles);
    };

    //CreateMember Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    //recordPayment
    const [sideOpen, setSideOpen] = React.useState(false);
    const handleSideOpen = () => setSideOpen(true);
    const handleSideClose = () => setSideOpen(false);

    useEffect(() => {
        if (loggedInUser) {
            setName(loggedInUser.name)
        }
    }, [loggedInUser]);

    // console.log(name)

    const today = new Date();
    const month = today.getMonth() + 1;
    // const month1 = today.getUTCMonth()

    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = date + "-" + month + "-" + year;

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: `PendingPayment_${currentDate}`,
        sheet: 'Users'
    })


    const baseURL = process.env.REACT_APP_BASE_URL


    useEffect(() => {
        const fetchPaidSubscription = async () => {
            try {
                const res = await axios.get(`${baseURL}/paidSubscription`, {
                    withCredentials: true
                });

                console.log('Data length of UNPAID MEMBERS:', res.data.paidSubscriptions);
                setNotPaid(res.data.paidSubscriptions.length)
                setUnpaidProfile(res.data.paidSubscriptions)
                console.log('Data length TOTAL MEMBERS:', res.data.totalMembers.length);
                setTotalMembers(res.data.totalMembers.length)
                setPendingAmount(res.data.totalPending)


            } catch (err) {
                window.alert("Server is facing some issues, Please Wait");
                console.log(err);
            }
        };

        fetchPaidSubscription();
    }, []);

    useEffect(() => {

        let greaterThan2000Count = 0;
        let between1000And2000Count = 0;
        let lessThan1000Count = 0;

        if (Array.isArray(unpaidProfile)) {
            unpaidProfile.forEach(profile => {
                const subscription = profile.Subscription;

                if (subscription >= 2000) {
                    greaterThan2000Count++;
                } else if (subscription >= 1000) {
                    between1000And2000Count++;
                } else {
                    lessThan1000Count++;
                }

            });
        } else {
            console.error("Data is not an array:", unpaidProfile);
        }

        // Set the subscription data state
        setSubscriptionData({
            greaterThan2000: greaterThan2000Count,
            between1000And2000: between1000And2000Count,
            lessThan1000: lessThan1000Count
        });
    }, [unpaidProfile])


    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        console.log({ name, value })
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 2000)
    }, [])

    // console.log(PieData.datasets[0].data);

    if (loading) {
        return (
            <div className="App-loading">
                <div className="overlay"></div>
                <div className="loading-content">
                    <ReactLoading type="bars" color="black" height={40} width={30} />
                </div>
            </div>
        );
    }

    const onSaveChanges = async () => {

        const url = `${baseURL}/recordPayment?amount=${amount}&UNIQUEID=` + `${selectedMember.UNIQUEID}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = response.json();

            console.log('API response:', data);

            setFormVisibility(false);
            window.location.reload();
            setAmount('')

            if (response.status === 200) {
                window.alert('Payment Recorded Successfully!');
            } else {
                window.alert('Failed to Recorded Payment.');
            }

            if (response.status >= 500) {
                window.alert("The Server is facing some issues. Please try again later")
            }
        } catch (error) {
            setAmount('');
            console.error('API error:', error);
        }

    };

    const exportToExcel = (jsonData, fileName) => {
        // Convert JSON to worksheet
        const ws = XLSXUtils.json_to_sheet(jsonData);

        // Create workbook
        const wb = XLSXUtils.book_new();
        XLSXUtils.book_append_sheet(wb, ws, 'Sheet1');

        // Generate Excel file
        const excelBuffer = writeXLSX(wb, { bookType: 'xlsx', type: 'array' });

        // Convert buffer to blob
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Trigger download
        saveAs(blob, fileName + '.xlsx');
    };

    const handleExportButtonClick = async () => {

        try {
            const response = await axios.get(`${baseURL}/allmembers`, {
                headers: {
                    'Content-Type': 'application/json',

                },
                withCredentials: true,
            });

            console.log('API response:', response.data);
            // toggleCreateFormVisibility();
            const jsonData = response.data;
            exportToExcel(jsonData, 'exported_data');
            if (response.status === 200) {
                window.alert('Profile ');
                window.location.reload();
            } else {
                window.alert('Failed to Create profile.');
            }
        } catch (error) {
            console.error('API error:', error);
        }


    };

    const handleRowClick = (member, UNIQUEID, Name) => {
        // Set selected member and toggle form visibility
        setSelectedMember({
            member: `${member}`,
            UNIQUEID: UNIQUEID,
            Name: `${Name}`
        });
        // setFormVisibility(true);
        handleSideOpen();
    };

    const onCreateNew = async () => {
        try {
            const response = await axios.post(`${baseURL}/newmember`, formData, {
                headers: {
                    'Content-Type': 'application/json',

                },
                withCredentials: true,
            });

            // console.log('API response:', response.data);
            toggleCreateFormVisibility();

            if (response.status === 200) {
                window.alert('Profile Created!');
                window.location.reload();
            } else {
                window.alert('Failed to Create profile.');
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };


    return (
        <div className="admin">
            <div className="headerDiv">
                <div className="leftHeader">
                    <span>ADMIN PANEL</span>
                </div>
                <div className="rightHeader">
                    <div className="divButton">
                        <button onClick={handleOpen}>CREATE USER</button>
                        <button onClick={handleExportButtonClick}>Export data</button>
                    </div>
                </div>
            </div>
            <div className="bodyDiv">
                <div className="welcome">
                    {/* <h1>Welcome back, {name}</h1> */}
                    <div className="metrics">
                        <div className="card">
                            <h3>Unpaid Subscription</h3>
                            <p>{notpaid}</p>
                            <span>NOT PAID</span>
                        </div>
                        <div className="card">
                            <h3>Total Number of Members</h3>
                            <p>{totalMembers}</p>
                            <span>MEMBERS</span>
                        </div>
                        <div className="card">
                            <h3>Total Pending Amount</h3>
                            <p>&#x20B9; {pendingAmount.toLocaleString('en-IN')}</p>
                            <span>DUE</span>
                        </div>
                    </div>
                </div>
                <div className="revenue">
                    <div className="headingRevenue">
                        <div className="titleRevenue">
                            <h2>PENDING SUBSCRIPTION</h2>
                        </div>
                        <div className="divButton">
                            <button onClick={onDownload}>EXPORT EXCEL</button>
                        </div>
                    </div>
                    <div className="graph">
                        <table className="unpaidTable" ref={tableRef}>
                            <thead>
                                <tr>
                                    <th>Member Number</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Pending Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unpaidProfile.map(index => (
                                    <tr key={index.MemberNo} onClick={() => handleRowClick(index.MemberNo, index.UNIQUEID, index.Name)}>
                                        <td>{index.MemberNo}</td>
                                        <td>{index.Name}</td>
                                        <td>{index.Mobile}</td>
                                        <td>{index.Subscription}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="modal-box">
                        <h3>Create New Member</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await onCreateNew();
                        }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><label>Name</label></td>
                                        <td><input type="text" name="Name" value={formData.Name} onChange={handleCreateInputChange} /></td>
                                    </tr>
                                    <tr>
                                        <td><label>Illam</label></td>
                                        <td><input type="text" name="Illam" value={formData.Illam} onChange={handleCreateInputChange} /></td>
                                    </tr>
                                    <tr>
                                        <td><label>Phone</label></td>
                                        <td><input type="text" name="Mobile" value={formData.Mobile} onChange={handleCreateInputChange} /></td>
                                    </tr>
                                    <tr>
                                        <td><label>Area</label></td>
                                        <td><input type="text" name="Area" value={formData.Area} onChange={handleCreateInputChange} /></td>
                                    </tr>
                                    <tr>
                                        <td><label>Date of Birth</label></td>
                                        <td><input type="date" name="DOB" value={formData.DOB} onChange={handleCreateInputChange} /></td>
                                    </tr>
                                    <tr>
                                        <td><label>Relationship with Member</label></td>
                                        <td><input type="text" name="Relationship" value="MEMBER" readOnly /></td>
                                    </tr>
                                    <tr>
                                        <td><label>Pending Payment</label></td>
                                        <td><input type="text" name="Subscription" value={formData.Subscription} onChange={handleCreateInputChange} /></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="divButton">
                                <button type="submit">ADD MEMBER</button>
                            </div>
                        </form>
                    </Box>
                </Modal>

                <Modal
                    open={sideOpen}
                    onClose={handleSideClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="modal-box">
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await onSaveChanges();
                        }}>
                            <h2>Record a Payment</h2>

                            <label htmlFor="">Member Name</label>
                            <input type="text" value={selectedMember.Name} readOnly />
                            <label htmlFor="">Member Number</label>
                            <input type="text" value={selectedMember.member} readOnly />
                            <label>Amount:</label>
                            <input type="text" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

                        </form>
                        <div className="divButton">
                            <button onClick={onSaveChanges} >Submit</button>
                            <button className="close-btn" onClick={handleSideClose}>Close</button>
                        </div>

                    </Box>
                </Modal>
            </div>
        </div>
    );
}
