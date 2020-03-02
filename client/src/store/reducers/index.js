import {combineReducers} from 'redux'
import user from './user'
import other from './other'
import activity from './Activity'

export default combineReducers({user, other, activity})
