import { createContext } from "react";

export const INITIAL_STATE = {

    isFetching: false,
    error: false,

    user: null,

    // user: {
    //     "_id":  "6961f2e33a0d2d69c205f826",
    //     "username": "admin",
    //     "email": "admin@gmail.com",
    //     "password": "$2b$10$ABPUrWW0iAFrYyXHRLxIB.0HdZndhLttYaRcmxz8eNQMq/n1SIlY2",
    //     "profilePicture": "https://res.cloudinary.com/dshugtqo7/image/upload/v1764398799/samples/people/boy-snow-hoodie.jpg",
    //     "coverPicture": "",
    //     "isAdmin": false,
    //     "createdAt": {
    //         "$date": "2026-01-10T06:34:11.739Z"
    //     },
    //     "updatedAt": {
    //         "$date": "2026-01-21T08:50:02.209Z"
    //     },
    //     "__v": 0,
    //     "followings": [
           
    //     ],
    //     "followers": [],
    //     "city": "Accra"
    // }
}

export const AuthContext = createContext(INITIAL_STATE);