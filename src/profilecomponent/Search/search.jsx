import "./search.scss";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import Profile from "../Profile/profile2.jsx";
// import { FALSE } from "node-sass";
import ReactLoading from "react-loading";
import Cookies from 'js-cookie';


export default function Search() {



    const [name, setName] = useState('');
    const [search, setSearch] = useState([]);
    const [selectedMemberNo, setSelectedMemberNo] = useState(null);
    const [searchData, setSearchData] = useState(false);
    const [searchResults, setSearchResults] = useState(false);
    const [loading, setLoading] = useState(true)
    // const [isAdmin, setIsAdmin] = useState(false);

    const baseURL = process.env.REACT_APP_BASE_URL



    const [formData, setFormData] = useState({
        Name: '',
        Illam: '',
        Mobile: '',
        Area: '',
        DOB: '',
        Relationship: 'MEMBER',
        Subscription: ''
    });

    


    const nav = useNavigate();

    const handleFormSubmit = async (event) => {

        setLoading(true)
        event.preventDefault();
        if (name === '') {

            setLoading(false)
            return


        }
        const url = `${baseURL}/search?name=` + name;

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


    const handleUserDetailsClick = (memberNo) => {
        // Set the selectedMemberNo state to trigger the rendering of the Profile component
        setSelectedMemberNo(memberNo);
        nav(`/Profile/${memberNo}`);
        // <Profile memberNo = {memberNo}/>

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
        </div>
    );
}
