let comments = module.exports = {}

// Dependencies
let _ = require('lodash')

let indent = 0;

let getParents = (commentArr) => {
  let parentComments = commentArr.filter(el => !el.comment_id)
  return _.sortBy(parentComments, 'createdAt').reverse()
}

let getNestedChildren = (arr, parent, indent=0) => {
  let children = []
  arr.forEach(comment => {
    if (comment.comment_id == parent._id) {
      let grandChildren = getNestedChildren(arr, comment)

      if (grandChildren.length) {
        comment.children = _.sortBy(grandChildren, 'createdAt').reverse()
      }
      children.push(comment)
    }
  })
  
  if (children.length) {
    parent.children = _.sortBy(children, 'createdAt').reverse()
  }

  return parent
}

let hasReplies = (commentArr) => {
  let replies = commentArr.filter(el => el.comment_id && el.comment_id !== null)
  if (replies.length > 0) {
    return true
  }
  return false
}

/**
 * recursively creates an array of comments and nested replies sorted by date created
 */
comments.flattenNested = (arr) => {
  if (!hasReplies(arr)) {
    return _.sortBy(arr, 'createdAt').reverse()
  }
  let parents = getParents(arr)
  return parents.map(comment => {
    return getNestedChildren(arr, comment)
  })
}
