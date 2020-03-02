const store = {
  login: false,
  token: false,
  loading: false,
  userData: {
    lastName: null,
    firstName: null,
    email: null,
    password: null
  },
  biodata: {
    firstName: "",
    lastName: "",
    gender: null,
    profilePicture: undefined
  },
  profilePictureDefault:
    "https://www.pngfind.com/pngs/m/110-1102775_download-empty-profile-hd-png-download.png",
  suggestFriend: [],
  invitation: [],
  interest: []
};

export default function user(state = store, action) {
  switch (action.type) {
    case "SET_INTEREST":
      return { ...state, interest: action.val };
    case "SET_LOGIN":
      return { ...state, login: action.val };
    case "SET_LOADING":
      return { ...state, loading: action.val };
    case "SET_USERDATA":
      return { ...state, userData: action.val };
    case "SET_TOKEN":
      return { ...state, token: action.val };
    case "SET_BIODATA":
      return { ...state, biodata: action.val };
    case "SET_SUGGESTFRIEND":
      return { ...state, suggestFriend: action.val };
    case "SET_INVITATION":
      return { ...state, invitation: action.val };
    case "SET_CLEAR":
      return {
        login: false,
        token: false,
        loading: false,
        userData: {
          lastName: null,
          firstName: null,
          email: null,
          password: null
        },
        biodata: {
          firstName: "",
          lastName: "",
          gender: null,
          profilePicture: undefined,
          interests: []
        },
        profilePictureDefault:
          "https://www.pngfind.com/pngs/m/110-1102775_download-empty-profile-hd-png-download.png",
        suggestFriend: [],
        invitation: [],
        interest: []
      };
    default:
      return state;
  }
}
