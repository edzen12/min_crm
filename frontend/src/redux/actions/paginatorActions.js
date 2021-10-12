const createPaginator = (endpoint, resultKey) {

  const requestPage = (page) => ({
    type: 'REQUEST_PAGE',
    
    payload: {
      page
    },

    meta: {
      endpoint,
      resultKey
    }
  })

  const receivePage = (page, results) => ({
    type: 'RECEIVE_PAGE',
    payload: {
      page,
      results
    }
  })

}