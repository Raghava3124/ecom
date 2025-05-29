import React from 'react';

export default function Creator() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ width: "22rem", borderRadius: "12px" }}>
        <img src="https://cdn-icons-png.flaticon.com/128/4440/4440953.png" className="card-img-top p-3" alt="Man Image" style={{ borderRadius: "10px" }} />
        <div className="card-body text-center">
          <h5 className="card-title fw-bold">INDANA RAGHAVA</h5>
          <p className="card-text text-muted">
            Passionate developer building innovative solutions with React and Flask.
          </p>
          <a href="https://www.linkedin.com/in/raghav-indana-343182290/" className="btn btn-primary btn-lg">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}