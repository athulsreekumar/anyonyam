import "./search.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { api } from "../../api/client";
import { useToast } from "../../components/Toast/ToastContext";

export default function Search() {
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const nav = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const { data } = await api.get("/search", { params: { name: trimmed } });
      setResults(data);
      setSearched(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setResults([]);
        setSearched(true);
      } else {
        showToast("The server is having trouble right now. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailsClick = (memberNo) => {
    nav(`/Profile/${memberNo}`);
  };

  return (
    <div className="search">
      <div className="searchDiv">
        <form onSubmit={handleFormSubmit}>
          <div className="searchbox">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              name="name"
              placeholder="SEARCH BY NAME"
            />
          </div>
          <div className="searchButton">
            <button type="submit" className="button-27" disabled={loading}>
              {loading ? <ReactLoading type="spin" color="#fff" height={18} width={18} /> : "GO"}
            </button>
          </div>
        </form>
      </div>
      <div className="searchResults">
        {searched && results.length === 0 && <p className="noResults">No members found.</p>}
        {results.map((user) => (
          <div
            className="userDetails"
            key={user.UNIQUEID}
            onClick={() => handleUserDetailsClick(user.MemberNo)}
          >
            <div className="userName">
              <p>Member No : {user.MemberNo}</p>
              <p>{user.Name}</p>
              <p>{user.Illam}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
