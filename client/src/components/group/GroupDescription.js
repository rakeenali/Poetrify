import React from "react";

export default function PrivacyPolicy(props) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>About</h2>
      </div>
      <div className="card-body">
        <p className="sidebar-right-text">{props.description}</p>
      </div>
    </div>
  );
}
