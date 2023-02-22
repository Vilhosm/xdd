import { toast } from "react-toastify";

export async function handleSignUp(firstName, lastName, email, password, confirmPassword, navigate) {
    try {
        const response = await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
            }),
        });
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
};

export async function handleSignIn(email, password) {
    try {
        const request = await fetch('http://localhost:4000/signin', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const data = await request.json();
        if (data.error_message) {
            toast.error(data.error_message);
        } else {
            // If SignIn succesful
            toast.success(data.message);
            // saves the email and id for identification
            localStorage.setItem('_id', data.data._id);
            localStorage.setItem('_myEmail', data.data._email);
        }
    } catch (err) {
        console.error(err);
    }
};

