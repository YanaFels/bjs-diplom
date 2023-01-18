"use strict"

const userForm = new UserForm();
userForm.loginFormCallback = data => ApiConnector.login(data, response => {
    if (!response.success) {
        return userForm.setLoginErrorMessage(response.error);
    }
    location.reload();
});

userForm.registerFormCallback = newData => ApiConnector.register(newData, response => {
    if (!response.success) {
        return userForm.setRegisterErrorMessage(response.error);
    }
    location.reload();
});