let comments = module.exports = {}
// Dependencies
let _ = require('lodash')

let renderComment = (comment, indent) => {
  let {user_id, days_ago, text} = comment
  return `
  <div class="indent-${indent}">
    <p>${user_id} ${days_ago} days ago</p>
    <p>${text}</p>
  </div>
  `
}

let renderComments = (commentArr) => {
  return commentArr.map(comment => renderComment(comment)).join(' ')
}

let getParents = (commentArr) => {
  let parentComments = commentArr.filter(el => !el.comment_id)
  return _.sortBy(parentComments, 'created_at').reverse()
}


let getNestedChildren = (arr, parent) => {
  let children = []

  arr.forEach(comment => {
    if (comment.comment_id == parent.id) {
      let grandChildren = getNestedChildren(arr, comment)

      if (grandChildren.length) {
        comment.children = _.sortBy(grandChildren, 'created_at')
      }
      children.push(comment)
    }
  })
  
  if (children.length) {
    parent.children = children  
  }

  return parent
}

comments.flattenNested = (arr) => {
  let parents = getParents(arr)
  return parents.map(comment => {
    return getNestedChildren(arr, comment)
  })
}

