import React, { useEffect, useState } from "react";
import "./profile2.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";


export default function Profile() {

    const { memberNo } = useParams();
    const [profile, setProfile] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userMemberNo, setUserMemberNo] = useState(null);
    const [isFormVisible, setFormVisibility] = useState(false);
    const [isCreateFormVisible, setCreateFormVisible] = useState(false);
    const [isUserSelected, setUserSelected] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedProfiles, setSelectedProfiles] = useState({});
    const [tempState, setTempState] = useState({});
    const [illam, setIllam] = useState(null)
    const [loading, setLoading] = useState(true)



    const [formData, setFormData] = useState({
        Name: '',
        Mobile: '',
        Area: '',
        Illam: ``,
        DOB: '',
        RELATIONSHIP: '',
        MemberNo: `${memberNo}`
    });


    console.log(memberNo)

    const toggleFormVisibility = (userId) => {
        setFormVisibility(!isFormVisible);
        setSelectedUserId(userId);
        setTempState(selectedProfiles);
    };

    const toggleCreateFormVisibility = (userId) => {
        setCreateFormVisible(!isCreateFormVisible);
        setSelectedUserId(userId);
        setTempState(selectedProfiles);
        // console.log(selectedProfiles.RELATIONSHIP);
        // setRelation(selectedProfiles.RELATIONSHIP)
    };


    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setTempState((prevtempState) => ({
            ...prevtempState,
            [field]: value,
        }));
    };

    const onSaveChanges = async () => {
        try {
            const response = await axios.put('https://anyonyam.onrender.com/member', tempState, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            console.log('API response:', response.data);
            toggleFormVisibility();
            window.location.reload();
            if (response.status === 200) {
                window.alert('Profile updated successfully!');
            } else {
                window.alert('Failed to update profile.');
            }
            if (response.status >= 500) {
                window.alert("The Server is facing some issues. Please try again later")
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    const onDelete = async (UNIQUEID) => {

        var answer = window.confirm("Delete User?");

        if (answer) {
            try {
                const response = await axios.delete(`https://anyonyam.onrender.com/member?UNIQUEID=${UNIQUEID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('API response:', response.data);
                // toggleFormVisibility();
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

        // console.log('Before setFormData:', formData);
        setFormData((prevData) => ({
            ...prevData,
            Illam: illam,
        }));
        // console.log('After setFormData:', formData);


        try {

            console.log(illam)



            console.log(formData)

            const response = await axios.post(`https://anyonyam.onrender.com/member`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('API response:', response.data);
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

        setLoading(true)
        setTimeout(() => setLoading(false), 500)
        setSelectedProfiles(profile[index]);
        // setIllam(profile[index].Illam)
        console.log(illam)
        setUserSelected(true);
    };


    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            Illam: illam
        }));
    };

    // const memberNo = 103

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`https://anyonyam.onrender.com/profile?MemberNo=${memberNo}`, {
                    withCredentials: true
                });
                setUserSelected(false);
                setProfile(res.data.data);
                setIsAdmin(res.data.isAdmin);
                const { Illam } = res.data.data[0];
                setIllam(Illam);
                setUserMemberNo(localStorage.getItem("memberNo"));
                // setIsLoading(false);

            } catch (err) {
                window.alert("Server is facing some issues, Please Wait")
                console.log(err);

            }
        };
        console.log(illam)
        fetchProfile();
    }, [memberNo]);

    useEffect(() => {
        console.log(selectedProfiles);
    }, [selectedProfiles]);

    useEffect(() => {
        console.log(tempState);
    }, [tempState]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
    }, [])


    // if (loading) {
    //     return (
    //         <div className="App-loading">
    //             <div className="overlay"></div>
    //             <div className="loading-content">
    //                 <ReactLoading type="bars" color="white" height={30} width={30} />
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="profile">
            <div className="leftDiv">
                <div className="side-bar">

                    <ul>
                        {profile.map((user, index) => (

                            <li key={user.UNIQUEID} onClick={() => handleProfileClick(index)}>{user.Name}</li>
                        ))}
                    </ul>

                    {isAdmin || userMemberNo === memberNo && (
                        <button onClick={() => toggleCreateFormVisibility(memberNo)}>CREATE USER</button>
                    )}
                </div>
            </div>
            <div className="rightDiv">
                {loading && (
                    <div className="App-loading">
                        <div className="overlay"></div>
                        <div className="loading-content">
                            <ReactLoading type="bars" color="white" height={30} width={30} />
                        </div>
                    </div>
                )}
                {isUserSelected && (
                    <div className="form">
                        <div className="profileDeck">
                            {/* <p>{selectedProfiles.Name}</p>
                            <p>{selectedProfiles.Illam}</p>
                            {selectedProfiles.Mobile !== "" && (<p>{selectedProfiles.Mobile}</p>)}
                            <p>{selectedProfiles.Area}</p> */}

                            <div className="beautiful-table-container">
                                <table className="beautiful-table">
                                    <tbody>
                                        <tr>
                                            <th>MEMBER NO</th>
                                            <td>{selectedProfiles.MemberNo}</td>
                                        </tr>
                                        <tr>
                                            <th>NAME</th>
                                            <td>{selectedProfiles.Name}</td>
                                        </tr>
                                        <tr>
                                            <th>ILLAM</th>
                                            <td>{selectedProfiles.Illam}</td>
                                        </tr>
                                        <tr>
                                            <th>PHONE</th>
                                            <td>{selectedProfiles.Mobile}</td>
                                        </tr>
                                        <tr>
                                            <th>AREA</th>
                                            <td>{selectedProfiles.Area}</td>
                                        </tr>
                                        <tr>
                                            <th>RELATIONSHIP WITH MEMBER</th>
                                            <td>{selectedProfiles.RELATIONSHIP}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {isAdmin || userMemberNo === memberNo && (<div className="buttonDiv">
                            <button onClick={() => toggleFormVisibility(selectedProfiles.UNIQUEID)}>EDIT</button>
                            <button onClick={() => onDelete(selectedProfiles.UNIQUEID)} className="deleteButton">DELETE</button>
                            {selectedProfiles.RELATIONSHIP === "Member" && (
                                <button disabled={true} className="paymentButton" >PAYMENT</button>
                            )}

                        </div>)}
                        {isFormVisible && selectedUserId === selectedProfiles.UNIQUEID && (
                            // <div className="popupContainer">
                            //     <div className="popupBackground" onClick={toggleFormVisibility}></div>
                            //     <div className="popupForm">
                            //         <h2>Edit Details</h2>
                            //         <form onSubmit={async (e) => {
                            //             e.preventDefault();
                            //             await onSaveChanges();
                            //         }}>
                            //             <label><p>Name</p></label>
                            //             <input type="text" value={tempState.Name} />
                            //             <p>Illam</p>
                            //             <input type="text" value={tempState.Illam} onChange={(e) => setTempState({ ...tempState, Illam: e.target.value })} />
                            //             <p>Phone</p>
                            //             <input type="text" value={tempState.Mobile} />
                            //             <p>Area</p>
                            //             <input type="text" value={tempState.Area} />
                            //             <div className="buttonclass">
                            //                 <button type="submit">Save Changes</button>
                            //             </div>
                            //         </form>
                            //     </div>
                            // </div>
                            <div className="popupContainer">
                                <div className="popupBackground" onClick={toggleFormVisibility}></div>
                                <div className="popupForm">
                                    <h2>Edit Details</h2>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        await onSaveChanges();
                                    }}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><label>Name</label></td>
                                                    <td><input type="text" value={tempState.Name} /></td>
                                                </tr>
                                                <tr>
                                                    <td><label>Illam</label></td>
                                                    <td><input type="text" value={tempState.Illam} /></td>
                                                </tr>
                                                <tr>
                                                    <td><label>Phone</label></td>
                                                    <td><input type="text" value={tempState.Mobile} onChange={(e) => setTempState({ ...tempState, Mobile: e.target.value })} /></td>
                                                </tr>
                                                <tr>
                                                    <td><label>Area</label></td>
                                                    <td><input type="text" value={tempState.Area} /></td>
                                                </tr>
                                                <tr>
                                                    <td><label>Relationship With Member</label></td>
                                                    <td><input type="text" value={tempState.RELATIONSHIP} /></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="buttonclass">
                                            <button type="submit">Save Changes</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}



                    </div>
                )}
                {isCreateFormVisible && (
                    // <div className="popupContainer">
                    //     <div className="popupBackground" onClick={toggleCreateFormVisibility}></div>
                    //     <div className="popupForm">
                    //         <h2>Create User</h2>
                    //         <form onSubmit={async (e) => {
                    //             e.preventDefault();
                    //             await onCreate();
                    //         }}>
                    //             <label><p>Name</p></label>
                    //             <input type="text" name="Name" value={formData.Name} onChange={handleCreateInputChange} />
                    //             <p>Illam</p>
                    //             <input type="text" value={illam} readOnly />
                    //             <p>Phone</p>
                    //             <input type="text" name="Mobile" value={formData.Mobile} onChange={handleCreateInputChange} />
                    //             <p>Area</p>
                    //             <input type="text" name="Area" value={formData.Area} onChange={handleCreateInputChange} />
                    //             <p>Date of Birth</p>
                    //             <input type="text" name="DOB" value={formData.DOB} onChange={handleCreateInputChange} />
                    //             <p>Relationship with Member</p>
                    //             <input type="text" name="Relationship" value={formData.Relationship} onChange={handleCreateInputChange} />
                    //             <div className="buttonclass">
                    //                 <button type="submit">Create User</button>
                    //             </div>
                    //         </form>
                    //     </div>
                    // </div>
                    <div className="popupContainer">
                        <div className="popupBackground" onClick={toggleCreateFormVisibility}></div>
                        <div className="popupForm">
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
                                <div className="buttonclass">
                                    <button type="submit">Create User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {!isUserSelected && (
                    <div className="imageContainer">
                        <img src="/assets/profile.svg" alt="image" />
                    </div>
                )}
            </div>
        </div>
    );
}
