import { io } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, "") : "/")
const socket = io(SOCKET_URL, { autoConnect: true })
export default socket
