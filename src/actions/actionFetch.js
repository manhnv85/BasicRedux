import {FETCH_FAIL, FETCH_OK, FETCHING} from './actionTypes';
import api from '../api/api';

export function getData(){
    return {
        type: FETCHING
    }
}

export function getDataSccess(data) {
    return {
        type: FETCH_OK,
        payload: data
    }
}

export function getDataFail() {
    return {
        type: FETCH_FAIL
    }
}

export function fetchData(){
    return (dispatch) => {
        dispatch(getData());
        api().then((data) => {
            dispatch(getDataSccess(data))
        })
        .catch(dispatch(getDataFail()))
    }
}