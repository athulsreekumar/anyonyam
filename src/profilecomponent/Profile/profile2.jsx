import React, { useEffect, useState, useCallback } from "react";
import "./profile2.scss";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { Modal } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import './modalStyle.scss'
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/Toast/ToastContext";

const DEFAULT_IMAGE = '/assets/profileIcon.svg';

// Only these are accepted by PUT /member (backend/validators/schemas.js
// updateMemberSchema) - sending the whole fetched record back (as the
// previous implementation did) would include UNIQUEID/SNO/IMAGE and now
// gets rejected outright by the backend's allow-list.
const EDITABLE_FIELDS = [
  "Name", "Illam", "DOB", "Mobile", "RELATIONSHIP", "Area",
  "Subscription", "DATA_STATUS", "PROFESSION", "EDUCATION",
  "Address", "AMMATH", "GRAMAM", "VEDAM", "GOTHRAM", "BloodGroup",
];

function toUpdatePayload(profile) {
  const payload = { UNIQUEID: profile.UNIQUEID };
  EDITABLE_FIELDS.forEach((field) => {
    if (profile[field] !== undefined && profile[field] !== null && profile[field] !== "") {
      payload[field] = profile[field];
    }
  });
  return payload;
}

export default function Profile() {
  const { memberNo } = useParams();
  const { memberNo: authMemberNo, isAdmin } = useAuth();
  const { showToast } = useToast();
  const canManage = isAdmin || Number(memberNo) === authMemberNo;

  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileStatus, setProfileStatus] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const [createForm, setCreateForm] = useState({
    Name: '', Mobile: '', Area: '', Illam: '', DOB: '', RELATIONSHIP: '',
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/profile", { params: { MemberNo: memberNo } });
      setProfile(data.data);
    } catch (err) {
      showToast("Couldn't load this profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [memberNo, showToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE;
  };

  const openMember = (member) => {
    setSelectedProfile(member);
    setIsEditing(false);
    setProfileStatus('personal');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProfile(null);
  };

  const updateSelectedField = (field, value) => {
    setSelectedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 2 * 1024 * 1024;
    if (file && file.size > maxSize) {
      setUploadMessage("File is too large. Maximum size is 2 MB.");
      setImage(null);
    } else {
      setImage(file);
      setUploadMessage("");
    }
  };

  const onImageSubmit = async (e, uniqueId) => {
    e.preventDefault();
    if (!image) {
      showToast("Please select an image to upload.", "warning");
      return;
    }
    const form = new FormData();
    form.append('image', image);
    try {
      const { data } = await api.post("/upload", form, {
        params: { UNIQUEID: uniqueId },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMessage(data.message);
      setImage(null);
      await fetchProfile();
    } catch (err) {
      setUploadMessage(err.response?.data?.error || "Failed to upload image");
    }
  };

  const onSaveChanges = async () => {
    try {
      await api.put("/member", toUpdatePayload(selectedProfile));
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
      handleClose();
      await fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update profile.", "error");
    }
  };

  const onDelete = async (uniqueId) => {
    if (!window.confirm("Delete this member? This cannot be undone.")) return;
    try {
      await api.delete("/member", { params: { UNIQUEID: uniqueId } });
      showToast("Member deleted.", "success");
      handleClose();
      await fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to delete member.", "error");
    }
  };

  const onCreate = async () => {
    try {
      await api.post("/member", { ...createForm, MemberNo: memberNo });
      showToast("Member added!", "success");
      setCreateOpen(false);
      setCreateForm({ Name: '', Mobile: '', Area: '', Illam: '', DOB: '', RELATIONSHIP: '' });
      await fetchProfile();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add member.", "error");
    }
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

  return (
    <div className="profile">
      <div className="containerList">
        {profile.map((user) => (
          <div className="containerDeck" key={user.UNIQUEID}>
            <div className="deckImage">
              <img
                src={`${process.env.REACT_APP_BASE_URL}/image/${user.UNIQUEID}`}
                alt={user.Name}
                onError={handleImageError}
              />
            </div>
            <div className="deckUserName">
              <p>{user.Name} <br /> Member No : {user.MemberNo}</p><br />
              <p>{user.Illam}</p>
            </div>
            <div className="showMoreButton">
              <Button onClick={() => openMember(user)}>Show More</Button>
            </div>
          </div>
        ))}
      </div>

      {canManage && (
        <div className="createUserDiv">
          <button onClick={() => setCreateOpen(true)}>CREATE USER</button>
        </div>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box className="modal-box">
            {selectedProfile && (
              <>
                <div className="deckImageFull">
                  <img
                    src={`${process.env.REACT_APP_BASE_URL}/image/${selectedProfile.UNIQUEID}`}
                    alt={selectedProfile.Name}
                    onError={handleImageError}
                  />
                </div>
                {canManage && (
                  <div className="imageButtons">
                    <form onSubmit={(e) => onImageSubmit(e, selectedProfile.UNIQUEID)}>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} required />
                      <button type="submit">Upload</button>
                    </form>
                    {uploadMessage && <p className="uploadMessage">{uploadMessage}</p>}
                  </div>
                )}

                <div className="profileInformation">
                  <ProfileSection
                    className="personal"
                    title="Personal Info"
                    active={profileStatus === 'personal'}
                    onSelect={() => setProfileStatus('personal')}
                    canManage={canManage}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing((v) => !v)}
                  >
                    <div className="left-side-form">
                      <label>Name</label><br />
                      <input type="text" value={selectedProfile.Name || ''} readOnly /><br />
                      <label>MemberNo</label><br />
                      <input type="text" value={selectedProfile.MemberNo || ''} readOnly /><br />
                      <label>Profession</label><br />
                      <input type="text" value={selectedProfile.PROFESSION || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('PROFESSION', e.target.value)} /><br />
                    </div>
                    <div className="right-side-form">
                      <label>Mobile</label><br />
                      <input type="text" value={selectedProfile.Mobile || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('Mobile', e.target.value)} /><br />
                      <label>Education</label><br />
                      <input type="text" value={selectedProfile.EDUCATION || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('EDUCATION', e.target.value)} /><br />
                      <label>Date Of Birth</label><br />
                      <input type="date" value={selectedProfile.DOB ? selectedProfile.DOB.slice(0, 10) : ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('DOB', e.target.value)} /><br />
                    </div>
                  </ProfileSection>

                  <ProfileSection
                    className="address"
                    title="Address"
                    active={profileStatus === 'address'}
                    onSelect={() => setProfileStatus('address')}
                    canManage={canManage}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing((v) => !v)}
                  >
                    <div className="left-side-form">
                      <label>Illam</label><br />
                      <input type="text" value={selectedProfile.Illam || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('Illam', e.target.value)} /><br />
                      <label>Address</label><br />
                      <input type="text" value={selectedProfile.Address || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('Address', e.target.value)} /><br />
                      <label>Area</label><br />
                      <input type="text" value={selectedProfile.Area || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('Area', e.target.value)} /><br />
                    </div>
                  </ProfileSection>

                  <ProfileSection
                    className="additional"
                    title="Additional Info"
                    active={profileStatus === 'additional'}
                    onSelect={() => setProfileStatus('additional')}
                    canManage={canManage}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing((v) => !v)}
                  >
                    <div className="left-side-form">
                      <label>Relationship</label><br />
                      <input type="text" value={selectedProfile.RELATIONSHIP || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('RELATIONSHIP', e.target.value)} /><br />
                      <label>Ammath</label><br />
                      <input type="text" value={selectedProfile.AMMATH || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('AMMATH', e.target.value)} /><br />
                      <label>Gramam</label><br />
                      <input type="text" value={selectedProfile.GRAMAM || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('GRAMAM', e.target.value)} /><br />
                    </div>
                    <div className="right-side-form">
                      <label>Vedam</label><br />
                      <input type="text" value={selectedProfile.VEDAM || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('VEDAM', e.target.value)} /><br />
                      <label>Gothram</label><br />
                      <input type="text" value={selectedProfile.GOTHRAM || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('GOTHRAM', e.target.value)} /><br />
                      <label>Blood Group</label><br />
                      <input type="text" value={selectedProfile.BloodGroup || ''} readOnly={!isEditing} onChange={(e) => updateSelectedField('BloodGroup', e.target.value)} /><br />
                    </div>
                  </ProfileSection>

                  <div className="buttonDiv">
                    {isEditing && <button onClick={onSaveChanges}>Save Changes</button>}
                    {canManage && (
                      <button onClick={() => onDelete(selectedProfile.UNIQUEID)} className="deleteButton">DELETE</button>
                    )}
                  </div>
                </div>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} aria-labelledby="create-user-title">
        <Box className="modal-box">
          <h2 id="create-user-title">Create User</h2>
          <form onSubmit={async (e) => { e.preventDefault(); await onCreate(); }}>
            <table>
              <tbody>
                <tr><td><label>Name</label></td><td><input type="text" value={createForm.Name} onChange={(e) => setCreateForm((p) => ({ ...p, Name: e.target.value }))} required /></td></tr>
                <tr><td><label>Illam</label></td><td><input type="text" value={createForm.Illam} onChange={(e) => setCreateForm((p) => ({ ...p, Illam: e.target.value }))} /></td></tr>
                <tr><td><label>Phone</label></td><td><input type="tel" value={createForm.Mobile} onChange={(e) => setCreateForm((p) => ({ ...p, Mobile: e.target.value }))} required pattern="\d{10}" title="10-digit phone number" /></td></tr>
                <tr><td><label>Area</label></td><td><input type="text" value={createForm.Area} onChange={(e) => setCreateForm((p) => ({ ...p, Area: e.target.value }))} /></td></tr>
                <tr><td><label>Date of Birth</label></td><td><input type="date" value={createForm.DOB} onChange={(e) => setCreateForm((p) => ({ ...p, DOB: e.target.value }))} required /></td></tr>
                <tr><td><label>Relationship with Member</label></td><td><input type="text" value={createForm.RELATIONSHIP} onChange={(e) => setCreateForm((p) => ({ ...p, RELATIONSHIP: e.target.value }))} placeholder="e.g. Wife, Son, Daughter" required /></td></tr>
              </tbody>
            </table>
            <div className="buttonDiv">
              <button type="submit">Create User</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

function ProfileSection({ className, title, active, onSelect, canManage, isEditing, onEditToggle, children }) {
  return (
    <div className={className} onClick={onSelect}>
      <div className="InfoTitle">
        <div className="titleHeading"><h3>{title}</h3></div>
        {canManage && (
          <div className="edit">
            <Button onClick={(e) => { e.stopPropagation(); onEditToggle(); }}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        )}
      </div>
      {active && <div className="content"><form onSubmit={(e) => e.preventDefault()}>{children}</form></div>}
    </div>
  );
}
