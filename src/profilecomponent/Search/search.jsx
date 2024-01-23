import "./search.scss";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import Profile from "../Profile/profile2.jsx";
// import { FALSE } from "node-sass";
import ReactLoading from "react-loading";


export default function Search() {



    const [name, setName] = useState('');
    const [search, setSearch] = useState([]);
    const [selectedMemberNo, setSelectedMemberNo] = useState(null);
    const [searchData, setSearchData] = useState(false);
    const [searchResults, setSearchResults] = useState(false);
    const [isCreateFormVisible, setCreateFormVisible] = useState(false);
    const [loading, setLoading] = useState(true)


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


    const nav = useNavigate();

    const handleFormSubmit = async (event) => {

        setLoading(true)
        event.preventDefault();
        if (name === '') {

            setLoading(false)
            return


        }
        const url = "https://anyonyam.onrender.com/search?name=" + name;

        try {
            const res = await axios.get(url, {
                withCredentials: true
            });
            setSearch(res.data);
            // console.log(name)
            // setSearchData(false)
            // setSearchResults(false)

            if (res.status === 200) {
                setSearchResults(true)
                setSearchData(true)
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }


        } catch (err) {
            setLoading(true)

            setTimeout(() => {
                setLoading(false);
            }, 2000);



            if (err.response.status === 404) {
                setLoading(true)

                setTimeout(() => {
                    setLoading(false);
                }, 2000);
                setSearchResults(false)
                setSearchData(true)
                // console.log(res.status)
            }

            if (err.response.status === 500 || err.response.status === 521) {
                window.alert("The server is facing some issues. Please Wait")
                console.log(err);
            }


        }
    };

    const onCreateNew = async () => {
        try {
            const response = await axios.post(`https://anyonyam.onrender.com/newmember`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    withCredentials: true
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

    const handleUserDetailsClick = (memberNo) => {
        // Set the selectedMemberNo state to trigger the rendering of the Profile component
        setSelectedMemberNo(memberNo);
        nav(`/Profile/${memberNo}`);
        // <Profile memberNo = {memberNo}/>

    };

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

    return (
        <div className="search">
            <div className="wrapper">
                <div className="searchbar">
                    <form onSubmit={handleFormSubmit}>

                        <div className="formContent">
                            <input type="text" value={name} onChange={(event) => setName(event.target.value)} name="name" placeholder="SEARCH BY NAME" />
                            <button type="submit" class="button-27" role="button">GO</button>
                        </div>

                        {/* <button class="button-27" role="button">ADD MEMBER</button> */}
                        {/* <input type="submit" className="button-27" /> */}
                    </form>
                </div>
                <div className="addmembersbutton">
                    <button class="button-27" role="button" onClick={toggleCreateFormVisibility}>ADD MEMBER</button>
                </div>
            </div>
            {searchResults && searchData && (
                <div className="searchResults">
                    {search.map((user) => (
                        // <Link to={`/profile/${user.MemberNo}`} key={user.UNIQUEID}>
                        <div className="userDetails" key={user.UNIQUEID} onClick={() => handleUserDetailsClick(user.MemberNo)}>
                            <div className="userName">

                                <p>Member No : {user.MemberNo}</p>
                                <p>{user.Name}</p>
                                <p>{user.Illam}</p>


                            </div>

                        </div>

                    ))}
                </div>
            )}
            {loading && (
                <div className="App-loading">
                    <div className="overlay"></div>
                    <div className="loading-content">
                        <ReactLoading type="bars" color="white" height={30} width={30} />
                    </div>
                </div>
            )}
            {(!searchData && !searchResults) && (

                <div className="imageContainer">
                    <img src="/assets/searching.svg" alt="image" />
                </div>

            )}
            {(!searchResults && searchData) && (

                <div className="imageContainer">
                    <div className="imageClass">
                        <img src="/assets/notFound.svg" alt="image" />
                    </div>
                    <div>
                        <h1>Data Not Found :/</h1>
                    </div>
                </div>

            )}
            {isCreateFormVisible && (
                <div className="popupContainer">
                    <div className="popupBackground" onClick={toggleCreateFormVisibility}></div>
                    <div className="popupForm">
                        <h2>Add New Member</h2>
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
                            <div className="buttonclass">
                                <button type="submit">ADD MEMBER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
