import React from "react";
import moment from "moment";

export default function Bio(props) {
  const { profile } = props;

  const years = moment.parseZone(profile.dateOfBirth).format("YYYY-MM-DD");
  return (
    <div className="showcase">
      <div className="card">
        <div className="card-header">
          <h4>
            {profile.firstName} {profile.lastName}
          </h4>
          <div className="showcase-age">
            <strong>Age:</strong> {moment().diff(years, "years")}
          </div>
        </div>
        <div className="card-body">
          <p className="card-text u-small-para">{`@${profile.handle}`}</p>
          <p className="card-text u-small-para">
            {profile.country}, {profile.city}
          </p>
        </div>
      </div>
    </div>
  );
}
