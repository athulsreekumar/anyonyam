import React, { useEffect, useState, useRef } from "react";
import "./profile2.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import { Modal } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import EasyEdit from 'react-easy-edit';
import './modalStyle.scss'
// import ImageUpload from "../ProfilePic/ImageUpload";
// import defaultImage from '/assets/profileIcon.svg';

export default function Profile() {

    const { memberNo } = useParams();
    const [profile, setProfile] = useState([]);
    const [isAdmin, setIsAdmin] = useState(null);
    const [userMemberNo, setUserMemberNo] = useState(null);
    const [isFormVisible, setFormVisibility] = useState(false);
    const [isCreateFormVisible, setCreateFormVisible] = useState(false);
    const [isUserSelected, setUserSelected] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedProfiles, setSelectedProfiles] = useState({});
    const [tempState, setTempState] = useState({});
    const [illam, setIllam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enlargedIndex, setEnlargedIndex] = useState(null); // State for enlarged card
    const [showActiveProfile, setShowActiveProfile] = useState(false);

    const [profileStatus, setProfileStatus] = useState('personal');

    var defaultImgLoc = '/assets/profileIcon.svg'

    const baseURL = process.env.REACT_APP_BASE_URL
    // const baseURL = "http://localhost:8800"
    // const baseURL = "https://anyonyam.onrender.com"
    console.log(baseURL)
    //EDIT MODAL::
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleButtonClick = (index) => {
        handleOpen();
        handleProfileClick(index);
        handletempState();
    };

    const handletempState = () => {
        setTempState(selectedProfiles);
    };

    //CreateModal
    const [createOpen, setCreateOpen] = React.useState(false);
    const handleCreateOpen = () => setCreateOpen(true);
    const handleCreateClose = () => setCreateOpen(false);


    //EditableForm - Start

    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };
    //EditableForm - End


    //GET PFP - start
    // const [images, setImages] = useState([]);
    const handleImageError = (e) => {
        e.target.src = defaultImgLoc; // Set the default image on error
    };
    //GET PFP - end

    //POST PFP - Start
    const [image, setImage] = useState(null);
    // const [imageName, setImageName] = useState('');
    const [message, setMessage] = useState("");
    const maxSize = 1 * 1024 * 1024; // 1 MB in bytes

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > maxSize) {
            setMessage("File is too large. Maximum size is 2 MB.");
            setImage(null);
        } else {
            setImage(file);
            setMessage("");
        }
    };

    const onImageSubmit = async (e, UNIQUEID) => {
        e.preventDefault();

        if (!image) {
            window.alert("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post(`${baseURL}/upload?UNIQUEID=${UNIQUEID}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message);
            // window.reload()
            window.location.reload();
        } catch (error) {
            console.error("Error uploading the image", error);
            setMessage("Failed to upload image");
        }
    };


    //POST PFP - End

   


    const [formData, setFormData] = useState({
        Name: '',
        Mobile: '',
        Area: '',
        Illam: ``,
        DOB: '',
        RELATIONSHIP: '',
        MemberNo: `${memberNo}`
    });

    const toggleFormVisibility = (userId) => {
        setFormVisibility(!isFormVisible);
        setSelectedUserId(userId);
        setTempState(selectedProfiles);
    };

    const handleClick = () => {
        setShowActiveProfile(true);
    };

    const toggleCreateFormVisibility = (userId) => {
        setCreateFormVisible(!isCreateFormVisible);
        setSelectedUserId(userId);
        setTempState(selectedProfiles);
    };



    const onSaveChanges = async () => {
        console.log(selectedProfiles)
        try {
            const response = await axios.put(`${baseURL}/member`, selectedProfiles, {
                headers: {
                    'Content-Type': 'application/json',
                    withCredentials: true
                },
                withCredentials: true,
            });
            toggleFormVisibility();
            window.location.reload();
            if (response.status === 200) {
                window.alert('Profile updated successfully!');
            } else {
                window.alert('Failed to update profile.');
            }
            if (response.status >= 500) {
                window.alert("The Server is facing some issues. Please try again later");
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    const onDelete = async (UNIQUEID) => {
        var answer = window.confirm("Delete User?");
        if (answer) {
            try {
                const response = await axios.delete(`${baseURL}/member?UNIQUEID=${UNIQUEID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                window.location.reload();
                if (response.status === 200) {
                    window.alert('Profile Deleted!');
                } else {
                    console.error('Failed to Delete profile.');
                }
            } catch (error) {
                console.error('API error:', error);
                window.alert('Failed to Delete profile.');
            }
        }
    };

    const onCreate = async () => {
        setFormData((prevData) => ({
            ...prevData,
            Illam: illam,
        }));

        try {
            const response = await axios.post(`${baseURL}/member`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

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

    const handleProfileClick = (index) => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
        setSelectedProfiles(profile[index]);
        setUserSelected(true);
        setEnlargedIndex(index); // Set the enlarged index
    };

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            Illam: illam
        }));
    };

    useEffect(() => {
        localStorage.setItem("isAdmin", isAdmin);
    }, [isAdmin]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${baseURL}/profile?MemberNo=${memberNo}`, {
                    withCredentials: true
                });
                setUserSelected(false);
                setProfile(res.data.data);
                setIsAdmin(res.data.isAdmin);
                const { Illam } = res.data.data[0];
                setIllam(Illam);
                setUserMemberNo(localStorage.getItem("memberNo"));
            } catch (err) {
                window.alert("Server is facing some issues, Please Wait");
                console.log(err);
            }
        };
        fetchProfile();
    }, [memberNo]);

    useEffect(() => {
        // console.log(selectedProfiles);
    }, [selectedProfiles]);

    useEffect(() => {
        // console.log(tempState);
    }, [tempState]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 2000);
    }, []);

    return (
        <div className="profile">
            <div className="containerList">
                {profile.map((user, index) => (
                    <div className="containerDeck" key={user.UNIQUEID} onClick={handleClick}>
                        <div className="deckImage">
                            <img
                                src={`${baseURL}/image/${user.UNIQUEID}`}
                                alt="Uploaded"

                                onError={handleImageError} // Add onError handler here
                            />
                        </div>
                        <div className="deckUserName">
                            <p>{user.Name} <br /> Member No : {user.MemberNo}</p><br />
                            <p>{user.Illam}</p>
                        </div>
                        <div className="showMoreButton">
                            <Button onClick={() => handleButtonClick(index)} >Show More</Button>
                        </div>
                    </div>
                ))}

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box className="modal-box">
                            <div className="deckImageFull">
                                <img
                                    src={`${baseURL}/image/${selectedProfiles.UNIQUEID}`}
                                    alt="Uploaded"
                                    onError={handleImageError} // Add onError handler here
                                />
                            </div>
                            {isEditing && (<div className="imageButtons">
                                <form onSubmit={(e) => onImageSubmit(e, selectedProfiles.UNIQUEID)}>
                                    <input type="file" onChange={onFileChange} required />
                                    <button type="submit">Upload</button>
                                </form>
                            </div>
                            )}
                            <div className="profileInformation">
                                <div className="personal" onClick={() => setProfileStatus('personal')}>
                                    <div className="InfoTitle">
                                        <div className="titleHeading">
                                            <h3>Personal Information</h3>
                                        </div>
                                        <div className="edit">
                                            {isEditing ? (
                                                <Button onClick={() => setIsEditing(false)} >Cancel</Button>
                                            ) : (
                                                <Button onClick={handleEdit} >Edit</Button>
                                            )}
                                        </div>
                                    </div>
                                    {profileStatus === 'personal' && <div className="content">
                                        <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            await onSaveChanges();
                                        }}>
                                            <div className="left-side-form">
                                                <label>Name</label><br />
                                                <input type="text" name="name" value={selectedProfiles.Name} readOnly /><br />
                                                <label>MemberNo</label><br />
                                                <input type="text" name="memberNo" value={selectedProfiles.MemberNo} readOnly /><br />
                                                <label>Profession</label><br />
                                                <input type="text" name="profession" value={selectedProfiles.PROFESSION} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, PROFESSION: e.target.value })} /><br />

                                            </div>
                                            <div className="right-side-form">
                                                <label>Mobile</label><br />
                                                <input type="text" name="mobile" value={selectedProfiles.Mobile} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, Mobile: e.target.value })} /><br />
                                                <label>Education</label><br />
                                                <input type="text" name="Education" value={selectedProfiles.EDUCATION} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, EDUCATION: e.target.value })} /><br />
                                            </div>
                                        </form>
                                    </div>}
                                </div>
                                <div className="address" onClick={() => setProfileStatus('address')}>
                                    <div className="InfoTitle">
                                        <div className="titleHeading">
                                            <h3>Address</h3>
                                        </div>
                                        {(isAdmin || userMemberNo === memberNo) && (
                                            <div className="edit">
                                                {isEditing ? (
                                                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                                ) : (
                                                    <Button onClick={handleEdit}>Edit</Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {profileStatus === 'address' && <div className="content">
                                        <form onSubmit={onSaveChanges}>
                                            <div className="left-side-form">
                                                <label>Illam</label><br />
                                                <input type="text" name="Illam" value={selectedProfiles.Illam} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, Illam: e.target.value })} /><br />
                                                <label>Address</label><br />
                                                <input type="text" name="Address" value={selectedProfiles.Address} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, Address: e.target.value })} /><br />
                                                <label>Area</label><br />
                                                <input type="text" name="profession" value={selectedProfiles.Area} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, Area: e.target.value })} /><br />
                                            </div>
                                            <div className="right-side-form">


                                            </div>
                                        </form>
                                    </div>}
                                </div>
                                <div className="additional" onClick={() => setProfileStatus('additional')}>
                                    <div className="InfoTitle">
                                        <div className="titleHeading">
                                            <h3>Additional Info</h3>
                                        </div>
                                        <div className="edit">
                                            {isEditing ? (
                                                <Button onClick={() => setIsEditing(false)} >Cancel</Button>
                                            ) : (
                                                <Button onClick={handleEdit} >Edit</Button>
                                            )}

                                        </div>
                                    </div>
                                    {profileStatus === 'additional' && <div className="content">
                                        <form onSubmit={onSaveChanges}>
                                            <div className="left-side-form">
                                                <label>Relationship</label><br />
                                                <input type="text" name="name" value={selectedProfiles.RELATIONSHIP} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, RELATIONSHIP: e.target.value })} /><br />
                                                <label>Ammath</label><br />
                                                <input type="text" name="memberNo" value={selectedProfiles.AMMATH} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, AMMATH: e.target.value })} /><br />
                                                <label>Gramam</label><br />
                                                <input type="text" name="profession" value={selectedProfiles.GRAMAM} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, GRAMAM: e.target.value })} /><br />

                                            </div>
                                            <div className="right-side-form">
                                                <label>Vedam</label><br />
                                                <input type="text" name="mobile" value={selectedProfiles.VEDAM} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, VEDAM: e.target.value })} /><br />
                                                <label>Gothram</label><br />
                                                <input type="text" name="Education" value={selectedProfiles.GOTHRAM} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, GOTHRAM: e.target.value })} /><br />
                                                <label>Blood Group</label><br />
                                                <input type="text" name="Education" value={selectedProfiles.BloodGroup} onChange={(e) => setSelectedProfiles({ ...selectedProfiles, BloodGroup: e.target.value })} /><br />
                                            </div>
                                        </form>
                                    </div>}
                                </div>

                                <div className="buttonDiv">
                                    {isEditing && (
                                        <button onClick={onSaveChanges}>Save Changes</button>
                                    )}

                                    <button onClick={() => onDelete(selectedProfiles.UNIQUEID)} className="deleteButton">DELETE</button>
                                </div>

                            </div>
                        </Box>
                    </Fade>
                </Modal>

            </div>

            <div className="createUserDiv">
                {(isAdmin || (userMemberNo === memberNo)) && (
                    <button onClick={handleCreateOpen}>CREATE USER</button>
                )}
            </div>
            <Modal
                open={createOpen}
                onClose={handleCreateClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-box">
                    <h2>Create User</h2>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        await onCreate();
                    }}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label>Name</label></td>
                                    <td><input type="text" name="Name" value={formData.Name} onChange={handleCreateInputChange} /></td>
                                </tr>
                                <tr>
                                    <td><label>Illam</label></td>
                                    <td><input type="text" name="Illam" value={illam} /></td>
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
                                    <td><input type="text" name="RELATIONSHIP" value={formData.RELATIONSHIP} onChange={handleCreateInputChange} /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="buttonDiv">
                            <button type="submit">Create User</button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div >
    );
}
