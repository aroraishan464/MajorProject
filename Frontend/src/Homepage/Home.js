import React from 'react'
import { useEffect, useState } from 'react';
import { usePosition } from './usePosition';
import { isAuthenticated } from '../Auth/Api';
import { updateCity, updateUserList } from './Api';

function Home() {
    const {
        latitude,
        longitude,
    } = usePosition(true, {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0,
    });

    // const [userList, setUserList] = useState([])
    const [cityVal, setCityVal] = useState(1);
    const [city, setCity] = useState('');

    useEffect(() => {
        if (latitude === undefined || longitude === undefined) { }
        else {
            console.log(latitude, longitude);
            const { token, user } = isAuthenticated();

            if (cityVal) {
                setCityVal(0);
                //TODO:
                //get city from latitude and longitude given above
                const cityName = 'Jaipur'
                setCity('Jaipur');
                updateCity(token, user._id, cityName)
                    .then(data => {
                        if (data.error) {
                            console.log(data.error);
                        }
                        else {
                            console.log(data);
                            updateUserList(token, user._id, latitude, longitude, cityName)
                                .then(data => {
                                    if (data.error) {
                                        console.log(data.error);
                                    }
                                    else {
                                        console.log(data);
                                        //TODO:
                                        //emit update message on socket server(content {city})
                                    }
                                });
                        }
                    });
            }
            if (city != '') {
                updateUserList(token, user._id, latitude, longitude, city)
                    .then(data => {
                        if (data.error) {
                            console.log(data.error);
                        }
                        else {
                            console.log(data);
                            //TODO:
                            //emit update message on socket server(content {city})
                        }
                    });
            }
        };
    }, [longitude, latitude]);


    //TODO:
    //configure socket
    //on update (get users list and store in the userList state)


    return (
        <div>
            <h1>HomePage</h1>
        </div>
    )
}

export default Home
