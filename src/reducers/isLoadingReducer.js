const isLoadingReducer = (state = true, action) => {
    switch (action.type) {
        case 'isLoading': {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
export default isLoadingReducer;