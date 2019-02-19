import React from "react";
import { Link } from "react-router-dom";

import "./NotFound.css";

export default function NotFound() {
  return (
    <div class="wrapper">
      <div>404</div>
      <div class="txt">
        Not Found<span class="blink">...</span>
      </div>
      <div class="block">
        <Link to="/" class="btn btn-outline-danger btn-lg">
          Go To Hompage
        </Link>
      </div>
    </div>
  );
}
