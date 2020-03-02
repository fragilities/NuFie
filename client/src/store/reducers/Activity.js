const initializeState = {
  data: [],
  error: null,
  category: [],
  listJoin: [],
  listByExplore: [],
  listByInterest: []
};

export default function activityReducer(state = initializeState, action) {
  switch (action.type) {
    case "FETCH_ACTIVITIES_START":
      return {
        ...state,
        loading: true
      };
    case "FETCH_ACTIVITIES":
      return {
        ...state,
        data: action.payload,
        loading: false
      };
    case "SET_MYPOST":
      return { ...state, data: action.val };
    case "SET_CATEGORY":
      return { ...state, category: action.val };
    case "FETCH_ACTIVITIES_JOIN":
      return { ...state, listJoin: action.payload };
    case 'SET_DETAILMEMBER':
        return {...state, detailMember: action.val}
    case "FETCH_ACTIVITIES_EXPLORE":
      return { ...state, listByExplore: action.payload };
    case "CLEAR_LIST_EXPLORE":
      return { ...state, listByExplore: [] };
    case "CLEAR_ACTIVITY":
      return {
        data: [],
        error: null,
        category: [],
        listJoin: [],  
        listByExplore: [],
        listByInterest: []
      };
    case "FETCH_ACTIVITIES_INTEREST":
      return {
        ...state,
        listByInterest: action.payload
      };
    default:
      return state;
  }
}
