import React from "react";

import "./Loading.css";

export default function Loading({ message }) {
  return (
    <div id="main-area">
      <h1>{message}</h1>
      <div class="loading-wrapper">
        <svg class="load__main" x="0px" y="0px" viewBox="0 0 150 150">
          <circle class="load__main--inner" cx="75" cy="75" r="60" />
        </svg>
      </div>
    </div>
  );
}

Loading.defaultProps = {
  message: "loading"
};
