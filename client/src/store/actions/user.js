import axios from "axios";
import firebase from "../../../config/config_firebase";

export const RegisterAction = params => {
  return function(dispatch) {
    dispatch({ type: "SET_LOADING", val: true });
    dispatch({ type: "SET_ERROR", val: {bool: false, message: ''} })
    firebase
      .auth()
      .createUserWithEmailAndPassword(params.email, params.password)
      .then(() => {
      })
      .catch((er) => {
        dispatch({ type: "SET_LOADING", val: false });
        dispatch({ type: "SET_ERROR", val: {bool: true, message: er.message} })
      })
  };
};

export const LoginEmailPassword = params => {
  return function(dispatch) {
    dispatch({ type: "SET_LOADING", val: true });
    dispatch({ type: "SET_ERROR", val: {bool: false, message: ''} })
    firebase
      .auth()
      .signInWithEmailAndPassword(params.email, params.password)
      .then((data) => {
      })
      .catch((er) => {
        dispatch({ type: "SET_LOADING", val: false });
        dispatch({ type: "SET_ERROR", val: {bool: true, message: er.message} })
      })
  };
};

export const Logout = () => {
  return function(dispatch) {
    try {
      dispatch({ type: "SET_CLEAR" });
      dispatch({ type: "CLEAR_ACTIVITY" });
      dispatch({ type: "SET_LOGIN", val: "logout" });
      dispatch({type: 'SET_USERDATA', val:{firstName: '', lastName: '', email: '', password: ''}})
      firebase.auth().signOut();
    } catch (e) {
    }
  };
};

export const ReadSelf = () => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      method: "GET",
      url: `${state().other.url}/users`,
      headers: {
        token: state().user.token
      }
    })
      .then(({ data }) => {
        dispatch({ type: "SET_BIODATA", val: data.user });
        dispatch({ type: "SET_LOADING", val: false });
      })
      .catch(err => {
      });
  };
};

export const UpdateProfile = props => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      method: "patch",
      url: `${state().other.url}/users`,
      headers: {
        token: state().user.token
      },
      data: props
    })
      .then(({ data }) => {
        dispatch({ type: "SET_BIODATA", val: data.user });
        dispatch({ type: "SET_LOADING", val: false });
      })
      .catch(err => {
      });
  };
};

export const FindFriend = props => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      url: `${state().other.url}/users/getByMostMatchingInterests?page=${props.page}&limit=10`,
      headers: {
        token: state().user.token
      },
      method: "POST",
      data: { tags: props.data.tags }
    })
      .then(({ data }) => {
        dispatch({ type: "SET_SUGGESTFRIEND", val: data.users });
        dispatch({ type: "SET_LOADING", val: false });
      })
      .catch(err => {
      });
  };
};
