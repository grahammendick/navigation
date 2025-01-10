import NavigationContext from "./NavigationContext.server";

const useNavigationEvent = () => NavigationContext.getCache().navigationEvent;

export default useNavigationEvent;
