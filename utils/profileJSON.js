module.exports = (profile, host) => {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    handle: profile.handle,
    dateOfBirth: profile.dateOfBirth,
    country: profile.country,
    city: profile.city,
    profileImage: `http://${host}/${profile.profileImage}`,
    profileId: profile._id,
    user: {
      userId: profile.user._id,
      name: profile.user.name,
      email: profile.user.email,
      poems: profile.user.poems,
      followedBy: profile.user.followedBy,
      following: profile.user.following
    }
  };
};
