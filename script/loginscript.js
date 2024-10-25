function passwordvalidate(form) {
    let password1 = form.password.value;
    let password2 = form.confirmpassword.value;
    if (password1 != password2) {
        alert("Password and Confirm Password are not same");
        return false;
    }
    else {
        return true;
    }
}