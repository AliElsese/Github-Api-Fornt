import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//
import axios from "axios";
import environment from "../env";
import { USER_INFO, USER_TOKEN } from "../core/enums/auth-keys";

function LocalRepos() {
  //
  const Navigate = useNavigate();

  // states
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [pagePagination, setPagePagination] = useState(0);

  useEffect(() => {
    getRepos();
  }, []);

  // useEffect(()=>{}, [repos])

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

  function deleteRepo(repo) {
    axios
      .delete(`${environment.API_URL}/repo/removeRepo/${repo?._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(USER_TOKEN)}`,
        },
      })
      .then((res) => {
        setRepos(repos.filter((rp) => rp?.repoid != repo?.repoid));
        let { user, savedRepos } = JSON.parse(localStorage.getItem(USER_INFO));
        savedRepos = savedRepos.filter((id) => id != repo?.repoid);
        localStorage.setItem(
          USER_INFO,
          JSON.stringify({ user, savedRepos })
        );
      });
  }

  function pageNumber(page) {
    getRepos({ page });
  }

  function getRepos(params = {}) {
    axios
      .get(`${environment.API_URL}/repo/getAllSavedRepo`, {
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
                    <Link to="/home" className="dropdown-item">
                      Home
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
                    src={repo?.img}
                    className="card-img-top"
                    alt="user image"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{repo?.reponame}</h5>
                    <p className="card-text">{repo?.description}</p>
                    <a href={repo?.repourl} className="link" target="_blank">
                      Github Repo Url
                    </a>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => deleteRepo(repo)}
                      >
                        Delete
                      </button>
                    </div>
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

export default LocalRepos;
