let comments = module.exports = {}

// Dependencies
let _ = require('lodash')

let indent = 0;

let renderComment = (comment, indent) => {
  let {user_id, days_ago, text, children, id, thread_id} = comment
  let replies = children ? `Replies: ${children.length}` : 'discuss'
  let parentComment = `
    <div class="indent-${indent}" data-id="${id}" data-thread-id="${thread_id}">
      <p>${user_id} ${days_ago} days ago</p>
      <p>${text}</p>
      <p>${replies}</p>
    </div>
  `
  let childComment = children ? renderComments(children, indent+=1) : ''

  return parentComment + childComment
}

let renderComments = (commentArr, indent=0) => {
  return commentArr.map(comment => renderComment(comment, indent)).join(' ')
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

/**
 * recursively creates an array of comments and nested replies sorted by date created
 */
comments.flattenNested = (arr) => {
  let parents = getParents(arr)
  return parents.map(comment => {
    return getNestedChildren(arr, comment)
  })
}

comments.parse = (arr) => {
  let flattened = comments.flattenNested(arr)
  return renderComments(flattened)
}
