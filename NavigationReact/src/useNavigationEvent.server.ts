import { getCache } from "./NavigationHandler.server";

const useNavigationEvent = () => getCache().navigationEvent;
export default useNavigationEvent;
