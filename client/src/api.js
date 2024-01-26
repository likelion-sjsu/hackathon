// export const SERVER_URL = "http://127.0.0.1:8000";
export const SERVER_URL =
  "https://vscode-adakm.run-us-west2.goorm.site/proxy/8000";

export async function getRoomData(roomId) {
  return (await fetch(`${SERVER_URL}/room/${roomId}`)).json();
}
