export const SERVER_URL = "http://127.0.0.1:8000";

export async function getRoomData(roomId) {
  return (await fetch(`${SERVER_URL}/room/${roomId}`)).json();
}
