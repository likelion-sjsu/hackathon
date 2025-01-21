// export const SERVER_URL = "http://127.0.0.1:8000";
export const SERVER_URL = "http://18.221.134.42";

export async function getRoomData(roomId) {
  return (await fetch(`${SERVER_URL}/room/${roomId}`)).json();
}

export async function getCategoryList() {
  return (await fetch(`${SERVER_URL}/category`)).json();
}

export async function getCategory(id) {
  return (await fetch(`${SERVER_URL}/category/${id}`)).json();
}

export async function getPicture(query) {
  return (
    await fetch(`https://api.pexels.com/v1/search?query=${query.replace(/ /g, "+")}&per_page=1`, {
      method: "GET",
      headers: {
        Authorization: "V7Og1p7nL4j4knPhwhEYJ9HazOt8JYlf1gnHSVqVYT124UDqdmHLZsan",
      },
    })
  ).json();
}
