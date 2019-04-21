import React from "react";
import { Link } from "react-router-dom";

import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="wrapper">
      <div>404</div>
      <div className="txt">
        Not Found<span className="blink">...</span>
      </div>
      <div className="block">
        <Link to="/" className="btn btn-outline-danger btn-lg">
          Go To Hompage
        </Link>
      </div>
    </div>
  );
}
