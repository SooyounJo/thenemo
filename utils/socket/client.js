// Simple client-side socket helpers for each namespace
import { io } from "socket.io-client";

const SOCKET_PATH = "/api/socketio";

export function connectNamespace(namespace) {
  const nsp = namespace.startsWith("/") ? namespace : `/${namespace}`;
  const s = io(nsp, { path: SOCKET_PATH });
  try {
    s.on("connect", () => console.log(`[sock] connect ${nsp} id=${s.id}`));
    s.on("disconnect", (reason) => console.log(`[sock] disconnect ${nsp} reason=${reason}`));
    s.on("connect_error", (err) => console.log(`[sock] error ${nsp}`, err?.message || err));
  } catch {}
  return s;
}

export function useTvSocket(onImageSelected) {
  const socket = connectNamespace("/tv");
  socket.on("connect", () => {});
  if (onImageSelected) {
    socket.on("imageSelected", onImageSelected);
    // Also accept tvShow for direct TV display
    socket.on("tvShow", onImageSelected);
  }
  return socket;
}

export function useSbmSocket(onImageSelected) {
  const socket = connectNamespace("/sbm");
  socket.on("connect", () => {});
  if (onImageSelected) socket.on("imageSelected", onImageSelected);
  return socket;
}

export function useDesktopSocket() {
  return connectNamespace("/desktop");
}

export function useMobileSocket() {
  return connectNamespace("/mobile");
}


