const useActionScene = (action: (...args: any) => any) => (
    action.bind(null, () => 'testing action scene')
)
export default useActionScene;
