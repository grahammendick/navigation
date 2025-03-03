import { getCache } from "./NavigationHandler.server.js";

const useNavigationEvent = () => getCache().navigationEvent;
export default useNavigationEvent;
