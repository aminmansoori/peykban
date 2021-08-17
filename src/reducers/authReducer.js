const InitialState = {
    name: '',
    loading: false,
    forgetPasswordCodeStatus: false,
    verifyCodeStatus: false,
}
export default (state = InitialState, action) => {
    switch (action.type) {

        case 'forget_password_code_status':
            return { ...state, forgetPasswordCodeStatus: action.payload };

        case 'signup_code_status':
            return { ...state, signupCodeStatus: action.payload };

        case 'verify_code_status':
            return { ...state, verifyCodeStatus: action.payload };

        case 'spinner':
            return { ...state, spinner: action.payload };

        case 'add_error':
            return { ...state, errorMessage: action.payload };

        case 'clear_error_message':
            return { ...state, errorMessage: '' };

        default:
            return state;
    }
}