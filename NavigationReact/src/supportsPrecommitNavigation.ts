export default typeof window !== 'undefined' && window.NavigationPrecommitController
    && !!(window.navigator as any).userAgentData?.brands?.some(({brand}) => brand === 'Microsoft Edge');
