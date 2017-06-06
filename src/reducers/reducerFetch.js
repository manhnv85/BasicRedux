import {FETCH_FAIL, FETCH_OK, FETCHING} from '../actions/actionTypes';

const DEFAULT_STATE = {
    data: [],
    isFetching: false,
    dataFetched: false,
    error: false
}

export default (state = DEFAULT_STATE, action) => {
    switch(action.type){
        case FETCHING:
            return{
                isFetching: true,
                data: [],
                ...state
            }
        case FETCH_OK:
            return{
                ...state,
                data:action.payload,
                isFetching: false
            }
        case FETCH_FAIL:
            return{
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return state;
    }
}