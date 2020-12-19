export const LOADING = 'LOADING';
export const FETCHED = 'FETCHED';
export const ERROR = 'ERROR';
export const CANCELLED = 'CANCELLED';

const fetchReducer = (state, action) => {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true, data: null, status: null, error: false, errorReason: null };
        case FETCHED:
            return { ...state, loading: false, data: action.payload.data, status: action.payload.status, error: false, errorReason: null };
        case ERROR:
            return { ...state, loading: false, data: null, error: true, errorReason: action.payload };
        case CANCELLED:
            return { ...state, loading: false, data: null, error: false, errorReason: null }
        default:
            return state;
    }
};

export default fetchReducer;