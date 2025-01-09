import { getNavigationContext } from "./NavigationRSCContext";

const useNavigationEvent = () => getNavigationContext().navigationEvent;

export default useNavigationEvent;
