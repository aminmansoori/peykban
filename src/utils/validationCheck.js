const validationCheck = () => { }

export const validateemail = (email) => {
    var regexemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexemail.test(email);
}
export const validatephonenumber = (phonenumber) => {
    var regexphonenumber = /^09[0-9]{9}$/;
    return regexphonenumber.test(phonenumber);
}
export default validationCheck;