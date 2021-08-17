const userTokenReducer = (state = null, action) => {
    switch (action.type) {
        case 'user_token': {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
export default userTokenReducer;