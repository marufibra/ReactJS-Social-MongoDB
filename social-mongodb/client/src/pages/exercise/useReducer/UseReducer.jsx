import { useReducer } from "react";

const INITIAL_STATE = {
    loading: false,
    error: false,
    userData: null
}

const Reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START': return { ...state, loading: true, error: false };
        case 'LOGIN_SUCCESS': return { ...state, loading: false, error: false, userData: action.payload };
        case 'LOGIN_FAILURE': return { ...state, loading: false, error: true, userData: action.payload };
        default: return state;
    }

}

const Login = () => {
    const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

    const clickLogin = () => {
        dispatch({ type: "LOGIN_START" })
        //type and dispatch is being defined in useReducer(Reducer, INITIAL_STATE)
        //so the names must match
        try {
            //connect to api; code below would run on success
            dispatch({ type: "LOGIN_SUCCESS", payload: "The data" })
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err })
        }
    }
    return (
        <>
            <button onClick={clickLogin}>LOGIN</button>
            {state.loading && <p>Loading...</p>}
            {state.userData && <p>Welcome {state.userData}</p>}
            {state.error && <p>{state.error}</p>}

        </>

    )

}

export default Login