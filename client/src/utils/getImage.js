export default function getImage(image) {
  if (image) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      return `http://localhost:5000/${image}`;
    } else {
      return image;
    }
  }
}
