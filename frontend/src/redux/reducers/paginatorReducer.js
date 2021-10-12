const pages = {};


export default function paginatorReducer(state = pages, action){
  switch (action.type) {
    case 'REQUEST_PAGE':
      return {
        ...pages,
        [action.payload.page]: {
          ids: [],
          fetching: true
        }
      }
    case 'RECEIVE_PAGE':
      return {
        ...pages,
        [action.payload.page]: {
          ids: action.payload.results.filter(item => item.id),
          fetching: false
        }
      }
    default:
      return pages
  }
}


