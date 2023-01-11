import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//
import axios from "axios";
import environment from "../env";
import { USER_INFO, USER_TOKEN } from "../core/enums/auth-keys";

function Home() {
  //
  const Navigate = useNavigate();

  // states
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [pagePagination, setPagePagination] = useState(0);
  const [savedRepos, setSavedRepos] = useState(
    JSON.parse(localStorage.getItem(USER_INFO))?.savedRepos
  );

  //
  function saveRepo(repo) {
    axios
      .post(`${environment.API_URL}/repo/saveRepo`, repo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(USER_TOKEN)}`,
        },
      })
      .then((res) => {
        const {
          data: { data },
        } = res || {};

        setSavedRepos([...savedRepos, data?.id]);
        const userInfo = JSON.parse(localStorage.getItem(USER_INFO));
        localStorage.setItem(
          USER_INFO,
          JSON.stringify({ ...userInfo, savedRepos: [...savedRepos, data?.id] })
        );

      });
  }

  //
  function pageNumber(page) {
    getRepos(search?.trim()?.split(" ")?.join("").toLowerCase(), { page });
  }

  //
  function pagination(total) {
    //
    const pag = Math.ceil(total / 10);

    let pages = [];

    for (let i = 0; i < pag; i++) {
      pages.push(i + 1);
    }

    return pages;
  }

  //
  function Search(username) {
    if (username) {
      setRepos([]);
      setLoading(true);
      //
      const convert = username?.trim()?.split(" ")?.join("").toLowerCase();

      //
      getRepos(convert);
    }
  }

  function getRepos(username, params = {}) {
    axios
      .get(`${environment.API_URL}/repo/getRepo/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(USER_TOKEN)}`,
        },
        params: { ...params },
      })
      .then((res) => {
        //
        const {
          data: { data, page, results },
        } = res || {};

        setRepos(data || []);
        setTotalItem(results);
        setPagePagination(page);

        setLoading(false);
      })
      .catch((err) => {
        setRepos([]);
        setLoading(false);
        console.log(err);
      });
  }

  function logOut() {
    localStorage.clear();
    Navigate("/login");
  }

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/home" className="navbar-brand">
            <span>Github Api</span>
          </Link>
          <div
            className="collapse navbar-collapse justify-content-between"
            id="navbarSupportedContent"
          >
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onInput={(e) => setSearch(e.target.value)}
              />
              <button
                disabled={!search || loading}
                type="button"
                className="btn btn-outline-primary"
                onClick={() => Search(search)}
              >
                Search
              </button>
            </form>
            <ul className="navbar-nav mb-0 mb-lg-0">
              <li className="nav-item dropdown">
                <button
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  className="btn btn-outline-primary"
                  type="button"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <ul
                  className="dropdown-menu"
                  style={{ left: "auto", right: 0 }}
                  aria-labelledby="navbarDropdown"
                >
                  <li className="pointer">
                    <Link to="/localRepos" className="dropdown-item">
                      Local Repos
                    </Link>
                  </li>
                  <li className="pointer">
                    <span className="dropdown-item" onClick={() => logOut()}>
                      Logout
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="repos">
        <div className="container">
          <div className="row">
            {loading && (
              <div className="text-center">
                <h1>Loading...</h1>
              </div>
            )}

            {/* // */}
            {repos.map((repo, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3  d-flex align-items-stretch"
                key={index}
              >
                <div className="card text-center w-100">
                  <img
                    src={repo?.owner?.avatar_url}
                    className="card-img-top"
                    alt="user image"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{repo?.name}</h5>
                    <p className="card-text">{repo?.description}</p>
                    <a href={repo?.html_url} className="link" target="_blank">
                      Github Repo Url
                    </a>
                    {!savedRepos.includes(repo?.id) && (
                      <div className="mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => saveRepo(repo)}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/*  */}

            {repos?.length > 0 && (
              <div className="col-12 mt-5">
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center">
                    <li
                      className="page-item pointer"
                      onClick={() =>
                        pagePagination > 1 && pageNumber(pagePagination - 1)
                      }
                    >
                      <span className="page-link">Previous</span>
                    </li>
                    {pagination(totalItem).map((page, index) => (
                      <li
                        key={index}
                        onClick={() => pageNumber(page)}
                        className="page-item pointer"
                      >
                        <span className="page-link">{page}</span>
                      </li>
                    ))}
                    <li
                      className="page-item pointer"
                      onClick={() =>
                        pagination(totalItem)?.length > pagePagination &&
                        pageNumber(pagePagination + 1)
                      }
                    >
                      <span className="page-link">Next</span>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
