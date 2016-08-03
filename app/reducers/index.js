import { combineReducers } from 'redux'
import tunnels from './tunnels'
import connection from "./connection";

const combinedReducer = combineReducers({
  tunnels,
  connection
})

export default combinedReducer