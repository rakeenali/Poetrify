import React from "react";
import getImage from "../../utils/getImage";
import { Link } from "react-router-dom";

export default function ShowAdmins(props) {
  const { admins } = props;
  return admins.map(admin => (
    <div className="col-lg-6 col-md-6 col-12" key={admin._id}>
      <div className="card">
        <img
          className="card-img-top"
          src={getImage(admin.profile.profileImage)}
          alt="user  cap"
          style={{ height: "180px" }}
        />
        <div className="card-body">
          <div className="card-title mb-4">
            {" "}
            <h2 className="text-center">{admin.name}</h2>
          </div>
          <Link
            to={`/profile/${admin.profile.handle}`}
            className="btn btn-success btn-block btn-lg mt-3"
          >
            See Profile
          </Link>
        </div>
      </div>
    </div>
  ));
}
