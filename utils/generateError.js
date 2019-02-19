module.exports = (res, msg, status = 400) => {
  if (typeof msg == "string") {
    return res.status(status).json({ message: msg, error: true });
  }
  return res.status(status).json({ ...msg, error: true });
};
