export const updateCity = (token, userId, city) => {
    return fetch(`/api/city/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({name: city})
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateUserList = (token, userId, latitude, longitude, city) => {
    return fetch(`/api/user/updatelist/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({latitude, longitude, city})
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

