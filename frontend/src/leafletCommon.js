export const mapOption = {
  startZoom: "13",
  maxZoom: "18",
  minZoom: "5",
}

export const getCurrentPosition = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );