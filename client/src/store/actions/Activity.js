import axios from "axios";
import db from "../../../config/config_firebase";

export const createActivity = activity => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      method: "post",
      url: `${state().other.url}/activities`,
      data: activity.data,
      headers: {
        token: activity.token,
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    })
      .then(response => {
        dispatch({ type: "SET_TRIGGER", val: response.data.activity._id });
        return db
          .firestore()
          .collection("chat")
          .doc(response.data.activity._id)
          .collection("arrMessage");
      })
      .then(data => {
        dispatch({ type: "SET_LOADING", val: false })
      })
      .catch(error => {
        dispatch({ type: "SET_LOADING", val: false });
      });
  };
};

export const getActivities = () => {
  return function(dispatch, state) {
    dispatch({
      type: "FETCH_ACTIVITIES_START"
    });
    return axios({
      method: "get",
      url: `${state().other.url}/activities?limit=10000`,
      headers: {
        token: state().user.token
      }
    })
      .then(response => {
        let activities = [];
        let invitation = [];
        let listGroup = [];

        if (response.data.activities.length > 0) {
          activities = response.data.activities.filter(activity => {
            return activity.owner._id == state().user.login;
          });
          invitation = response.data.activities.filter(activity => {
            return activity.pendingInvites.includes(state().user.login);
          });
          listGroup = response.data.activities.filter(activity => {
            return activity.members.includes(state().user.login);
          });
        }

        dispatch({
          type: "FETCH_ACTIVITIES_JOIN",
          payload: listGroup
        });
        dispatch({
          type: "FETCH_ACTIVITIES",
          payload: activities
        });
        dispatch({
          type: "SET_INVITATION",
          val: invitation
        });
      })
      .catch(error => {
        dispatch({ type: "SET_LOADING", val: false });
      });
  };
};

export const editActivity = activity => {
  return function(dispatch, state) {
    return axios({
      method: "patch",
      url: `${state().other.url}/activities/${activity.id}`,
      data: activity.data,
      headers: {
        token: activity.token
      }
    })
      .then(response => {
        dispatch({ type: "SET_TRIGGER", val: response.data });
      })
      .catch(error => {
        dispatch({ type: "SET_LOADING", val: false });
      });
  };
};

export const FetchCategory = props => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      url: `${state().other.url}/activities/interest/` + props,
      method: "GET",
      headers: {
        token: state().user.token
      }
    })
    .then(({ data }) => {
      dispatch({ type: "SET_CATEGORY", val: data.activities });
      dispatch({ type: "SET_LOADING", val: false });
    })
    .catch((err) => {
      dispatch({ type: "SET_LOADING", val: false });
    })
  };
};

export const InviteFriend = props => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      url: `${state().other.url}/activities/invite/` + props.postId,
      method: "post",
      headers: {
        token: state().user.token
      },
      data: {
        targetId: props.userId,
        pushToken: props.pushToken
      }
    })
      .then(({ data }) => {
        dispatch({ type: "SET_LOADING", val: false });
      })
      .catch(err => {
        dispatch({ type: "SET_LOADING", val: false });
      });
  };
};

export const AcceptInvite = props => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      url: `${state().other.url}/activities/inviteAccept/` + props,
      method: "post",
      headers: {
        token: state().user.token
      }
    })
      .then(({ data }) => {
        dispatch({ type: "SET_LOADING", val: false });
        dispatch({ type: "SET_TRIGGER", val: `${state().other.url}/activities/inviteAccept/` + props });
      })
      .catch(err => {
        dispatch({ type: "SET_LOADING", val: false });
      });
  };
};

export const DeclineInvite = props => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      url: `${state().other.url}/activities/inviteReject/` + props,
      method: "post",
      headers: {
        token: state().user.token
      }
    })
      .then(({ data }) => {
        dispatch({ type: "SET_LOADING", val: false });
        dispatch({ type: "SET_TRIGGER", val: `${state().other.url}/activities/inviteReject/` + props });
      })
      .catch(err => {
        dispatch({ type: "SET_LOADING", val: false });
      });
  };
};

export const cancelActivity = data => {
  return function(dispatch, state) {
    const pushTokens = data.members.map(member => member.pushToken)
    return axios({
      method: "patch",
      url: `${state().other.url}/activities/cancel/` + data.id,
      headers: {
        token: state().user.token,
        pushTokens
      }
    })
      .then(response => {
        dispatch({ type: "SET_TRIGGER", val: response.data });
      })
      .catch(error => {
        dispatch({ type: "SET_LOADING", val: false });
      });
  };
};

export const leaveActivity = id => {
  return function(dispatch, state) {
    return axios({
      method: "post",
      url: `${state().other.url}/activities/leave/${id}`,
      headers: {
        token: state().user.token
      }
    })
      .then(response => {
        dispatch({ type: "SET_TRIGGER", val: response.data });
      })
      .catch(error => {
        dispatch({ type: "SET_LOADING", val: false });
      });
  };
};

export const exploreInterest = (interest) => {
  return function(dispatch, state) {
    return axios({
      method: 'get',
      url: `${state().other.url}/activities/interest/${interest}`,
      headers: {
        token: state().user.token
      }
    })
    .then(response => {
      const activities = response.data.activities;
      dispatch({
        type: 'FETCH_ACTIVITIES_EXPLORE',
        payload: activities
      })
    })
    .catch(error => {
      dispatch({ type: "SET_LOADING", val: false });
    })
  }
}

export const ActivityDetail = (props) => {
  return function(dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      method: "get",
      url: `${state().other.url}/activities/${props}`,
      headers: {
        token: state().user.token
      }
    })
    .then(({data}) => {
      dispatch({ type: "SET_LOADING", val: false });
      dispatch({type: 'SET_DETAILMEMBER', val: data.activity.members})
    })
    .catch((er) => {
      dispatch({ type: "SET_LOADING", val: false });
      dispatch({ type: "SET_ERROR", val: {bool: true, message: er.message} })
    })
  }
} 

export const getByInterest = () => {
  return function(dispatch, state) {
    return axios({
      method: 'get',
      url: `${state().other.url}/activities/getRecommendedActivities`,
      headers: {
        token: state().user.token
      }
    })
    .then(response => {
      const interestActivities = response.data.activities;
      dispatch({
        type: 'FETCH_ACTIVITIES_INTEREST',
        payload: interestActivities
      })
    })
    .catch(error => {
      dispatch({ type: "SET_LOADING", val: false });
    })
  }
}

export const joinActivities = (id) => {
  return function (dispatch, state) {
    return axios({
      method: 'post',
      url: `${state().other.url}/activities/join/${id}`,
      headers: {
        token: state().user.token
      }
    })
    .then(response => {
      dispatch({ type: "SET_TRIGGER", val: "join_group" });
    })
    .catch(error => {
      dispatch({ type: "SET_LOADING", val: false });
    })
  }
}

export const AcceptRequestJoin = (props) => {
  return function (dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      method: "post",
      url: `${state().other.url}/activities/joinAccept/${props.activityId}`,
      headers: {
        token: state().user.token,
        pushToken: props.pushToken
      },
      data: {
        targetId: props.targetId
      }
    })
    .then(({data}) => {
      dispatch({ type: "SET_LOADING", val: false });
      dispatch({ type: "SET_TRIGGER", val: props.targetId });
    })
    .catch((er) => {
      dispatch({ type: "SET_LOADING", val: false });
      dispatch({ type: "SET_ERROR", val: {bool: true, message: er.message} })
    })
  }
} 

export const DeclineRequestJoin = (props) => {
  return function (dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      method: "post",
      url: `${state().other.url}/activities/joinReject/${props.activityId}`,
      headers: {
        token: state().user.token,
        pushToken: props.pushToken
      },
      data: {
        targetId: props.targetId
      }
    })
    .then(({data}) => {
      dispatch({ type: "SET_LOADING", val: false });
      dispatch({ type: "SET_TRIGGER", val: props.targetId });
    })
    .catch((er) => {
      dispatch({ type: "SET_LOADING", val: false });
      dispatch({ type: "SET_ERROR", val: {bool: true, message: er.message} })
    })
  }
}

export const KickMember = (props) => {
  return function (dispatch, state) {
    dispatch({ type: "SET_LOADING", val: true });
    return axios({
      method: "post",
      url: `${state().other.url}/activities/kick/${props.activityId}`,
      headers: {
        token: state().user.token
      },
      data: {
        targetId: props.targetId,
        pushToken: props.pushToken
      }
    })
    .then(({data}) => {
      dispatch({ type: "SET_LOADING", val: false });
      dispatch({ type: "SET_TRIGGER", val: props.targetId });
    })
    .catch((er) => {
      dispatch({ type: "SET_LOADING", val: false });
      dispatch({ type: "SET_ERROR", val: {bool: true, message: er.message} })
    })
  }
}
