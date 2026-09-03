import "./admin.scss";
import "./../Profile/modalStyle.scss"
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactLoading from "react-loading";
import { useDownloadExcel } from 'react-export-table-to-excel';
import { PieChart } from '@mui/x-charts/PieChart';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/Toast/ToastContext";

const EMPTY_CREATE_FORM = {
  Name: '',
  Illam: '',
  Mobile: '',
  Area: '',
  DOB: '',
  RELATIONSHIP: 'MEMBER',
  Subscription: ''
};

export default function Admin() {
  const { name } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [notPaidCount, setNotPaidCount] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [unpaidProfile, setUnpaidProfile] = useState([]);
  const [pendingAmount, setPendingAmount] = useState(0);
  const tableRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [amount, setAmount] = useState('');
  const [formData, setFormData] = useState(EMPTY_CREATE_FORM);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [sideOpen, setSideOpen] = useState(false);
  const handleSideOpen = () => setSideOpen(true);
  const handleSideClose = () => setSideOpen(false);

  const today = new Date();
  const currentDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `PendingPayment_${currentDate}`,
    sheet: 'Users'
  });

  const fetchPaidSubscription = useCallback(async () => {
    try {
      const { data } = await api.get("/paidSubscription");
      setNotPaidCount(data.paidSubscriptions.length);
      setUnpaidProfile(data.paidSubscriptions);
      setTotalMembers(data.totalMembers.length);
      setPendingAmount(data.totalPending || 0);
    } catch (err) {
      showToast("Couldn't load the dashboard. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPaidSubscription();
  }, [fetchPaidSubscription]);

  const subscriptionBuckets = useMemo(() => {
    let over2000 = 0;
    let between1000And2000 = 0;
    let under1000 = 0;

    unpaidProfile.forEach((profile) => {
      const subscription = Number(profile.Subscription) || 0;
      if (subscription >= 2000) over2000 += 1;
      else if (subscription >= 1000) between1000And2000 += 1;
      else under1000 += 1;
    });

    return [
      { id: 0, value: over2000, label: "₹2000+", color: "var(--color-error)" },
      { id: 1, value: between1000And2000, label: "₹1000-1999", color: "var(--color-warning)" },
      { id: 2, value: under1000, label: "Under ₹1000", color: "var(--color-accent)" },
    ];
  }, [unpaidProfile]);

  const handleCreateInputChange = (e) => {
    const { name: field, value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="App-loading">
        <div className="overlay"></div>
        <div className="loading-content">
          <ReactLoading type="bars" color="#9c424d" height={40} width={30} />
        </div>
      </div>
    );
  }

  const onSaveChanges = async () => {
    if (!selectedMember || !amount) return;
    try {
      await api.put("/recordPayment", null, {
        params: { amount, UNIQUEID: selectedMember.UNIQUEID },
      });
      showToast("Payment recorded successfully.", "success");
      setSideOpen(false);
      setAmount('');
      setSelectedMember(null);
      await fetchPaidSubscription();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to record payment.", "error");
    }
  };

  const exportToExcel = async (jsonData, fileName) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    if (jsonData.length > 0) {
      sheet.columns = Object.keys(jsonData[0]).map((key) => ({ header: key, key }));
      sheet.addRows(jsonData);
    }
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${fileName}.xlsx`);
  };

  const handleExportButtonClick = async () => {
    try {
      const { data } = await api.get("/allmembers");
      await exportToExcel(data, 'exported_data');
    } catch (err) {
      showToast("Failed to export member data.", "error");
    }
  };

  const handleRowClick = (member) => {
    setSelectedMember(member);
    handleSideOpen();
  };

  const onCreateNew = async () => {
    try {
      await api.post("/newmember", formData);
      showToast("Member added successfully!", "success");
      handleClose();
      setFormData(EMPTY_CREATE_FORM);
      await fetchPaidSubscription();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add member.", "error");
    }
  };

  return (
    <div className="admin">
      <div className="headerDiv">
        <div className="leftHeader">
          <span>ADMIN PANEL{name ? ` — ${name}` : ""}</span>
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
          <div className="metrics">
            <div className="card">
              <h3>Unpaid Subscription</h3>
              <p>{notPaidCount}</p>
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

        {notPaidCount > 0 && (
          <div className="chartCard">
            <h2>Pending Subscription Breakdown</h2>
            <PieChart
              series={[{ data: subscriptionBuckets, innerRadius: 40, paddingAngle: 2, cornerRadius: 4 }]}
              height={220}
            />
          </div>
        )}

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
                {unpaidProfile.map((member) => (
                  <tr key={member.UNIQUEID} onClick={() => handleRowClick(member)}>
                    <td>{member.MemberNo}</td>
                    <td>{member.Name}</td>
                    <td>{member.Mobile}</td>
                    <td>{member.Subscription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal open={open} onClose={handleClose} aria-labelledby="create-member-title">
          <Box className="modal-box">
            <h3 id="create-member-title">Create New Member</h3>
            <form onSubmit={async (e) => { e.preventDefault(); await onCreateNew(); }}>
              <table>
                <tbody>
                  <tr>
                    <td><label>Name</label></td>
                    <td><input type="text" name="Name" value={formData.Name} onChange={handleCreateInputChange} required /></td>
                  </tr>
                  <tr>
                    <td><label>Illam</label></td>
                    <td><input type="text" name="Illam" value={formData.Illam} onChange={handleCreateInputChange} /></td>
                  </tr>
                  <tr>
                    <td><label>Phone</label></td>
                    <td><input type="tel" name="Mobile" value={formData.Mobile} onChange={handleCreateInputChange} required pattern="\d{10}" title="10-digit phone number" /></td>
                  </tr>
                  <tr>
                    <td><label>Area</label></td>
                    <td><input type="text" name="Area" value={formData.Area} onChange={handleCreateInputChange} /></td>
                  </tr>
                  <tr>
                    <td><label>Date of Birth</label></td>
                    <td><input type="date" name="DOB" value={formData.DOB} onChange={handleCreateInputChange} required /></td>
                  </tr>
                  <tr>
                    <td><label>Relationship with Member</label></td>
                    <td><input type="text" name="Relationship" value="MEMBER" readOnly /></td>
                  </tr>
                  <tr>
                    <td><label>Pending Payment</label></td>
                    <td><input type="number" min="0" name="Subscription" value={formData.Subscription} onChange={handleCreateInputChange} /></td>
                  </tr>
                </tbody>
              </table>
              <div className="divButton">
                <button type="submit">ADD MEMBER</button>
              </div>
            </form>
          </Box>
        </Modal>

        <Modal open={sideOpen} onClose={handleSideClose} aria-labelledby="record-payment-title">
          <Box className="modal-box">
            <form onSubmit={async (e) => { e.preventDefault(); await onSaveChanges(); }}>
              <h2 id="record-payment-title">Record a Payment</h2>
              <label htmlFor="payMemberName">Member Name</label>
              <input id="payMemberName" type="text" value={selectedMember?.Name || ''} readOnly />
              <label htmlFor="payMemberNo">Member Number</label>
              <input id="payMemberNo" type="text" value={selectedMember?.MemberNo || ''} readOnly />
              <label htmlFor="payAmount">Amount</label>
              <input
                id="payAmount"
                type="number"
                min="1"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className="divButton">
                <button type="submit">Submit</button>
                <button type="button" className="close-btn" onClick={handleSideClose}>Close</button>
              </div>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
