import {combineReducers} from "redux";

const initialState = {
  byId: {
      "1": {id: "1", name: 'Bell Halvorson', dateOfBirth: '01/01/1980', email: 'bell@navigation.com', phone: '555 0001'},
      "2": {id: "2", name: 'Aditya Larson', dateOfBirth: '01/02/1980', email: 'aditya@navigation.com', phone: '555 0002'},
      "3": {id: "3", name: 'Rashawn Schamberger', dateOfBirth: '01/03/1980', email: 'rashawn@navigation.com', phone: '555 0003'},
      "4": {id: "4", name: 'Rupert Grant', dateOfBirth: '01/04/1980', email: 'rupert@navigation.com', phone: '555 0004'},
      "5": {id: "5", name: 'Opal Carter', dateOfBirth: '01/05/1980', email: 'opal@navigation.com', phone: '555 0005'},
      "6": {id: "6", name: 'Candida Christiansen', dateOfBirth: '01/06/1980', email: 'candida@navigation.com', phone: '555 0006'},
      "7": {id: "7", name: 'Haven Stroman', dateOfBirth: '01/07/1980', email: 'haven@navigation.com', phone: '555 0007'},
      "8": {id: "8", name: 'Celine Leannon', dateOfBirth: '01/08/1980', email: 'celine@navigation.com', phone: '555 0008'},
      "9": {id: "9", name: 'Ryan Ruecker', dateOfBirth: '01/09/1980', email: 'ryan@navigation.com', phone: '555 0009'},
      "10": {id: "10", name: 'Kaci Hoppe', dateOfBirth: '01/10/1980', email: 'kaci@navigation.com', phone: '555 0010'},
      "11": {id: "11", name: 'Fernando Dietrich', dateOfBirth: '01/11/1980', email: 'fernando@navigation.com', phone: '555 0011'},
      "12": {id: "12", name: 'Emelie Lueilwitz', dateOfBirth: '01/12/1980', email: 'emelie@navigation.com', phone: '555 0012'}
  },
  allIds: ["1","2","3","4","5","6","7","8","9","10","11","12"]
};

const people = (state = initialState, action) => {
  switch (action.type) {
      case "EDIT":
          var {id, name} = action.payload; 
          return {
              ...state,
              byId: {
                ...state.byId,
                [id]: {
                  ...state.byId[id],
                  name
                }
              }
          };
      default:
          return state;
  }
}

const crumbs = (state = {current: 0, peek: 0}, action) => {
  switch (action.type) {
    case "NAVIGATE":
        var {crumb} = action.payload; 
        return {
          current: crumb,
          peek: crumb,
        };
    case "PEEK":
        var {crumb} = action.payload; 
        return {
          ...state,
          peek: crumb,
        };
    default:
        return state;
  }
}

export default combineReducers({people, crumbs})