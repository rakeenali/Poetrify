import React from "react";
import moment from "moment";

export default function Bio(props) {
  const { profile } = props;

  return (
    <div className="col-lg-4 col-md-4 col-12">
      <div className="profile__info p-3">
        <h3>
          {profile.firstName} {profile.lastName}
        </h3>
        <span className="text-muted d-block pb-2 text-md">{`@${
          profile.handle
        }`}</span>
        <span className="text-muted d-block pb-2 text-md">
          {profile.country} {profile.city}
        </span>
        <span className="text-muted d-block pb-2 text-md">
          Born {moment.parseZone(profile.dateOfBirth).format("DD-MM-YYYY")}
        </span>
      </div>
    </div>
  );
}
