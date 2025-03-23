export const isEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
export const isPhone = (phone) => {
    // Ensure the input is a string and exactly 10 digits long
    if (typeof phone !== 'string' || phone.length !== 10) {
        return false;
    }

    // Correct regex to match exactly 10 digits (Indian phone number format)
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};


export const isPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const isUrl = (url) => {
    const regex = /^(http|https):\/\/[a-zA-Z0-9.-]+$/
    return regex.test(url);
};

