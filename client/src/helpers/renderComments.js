// Dependencies
let _ = require('lodash')
let momentFromNow = require('./momentFromNow') 

let indent = 0;

let renderComment = (comment, indent) => {
  let { user, createdAt, text, children, _id, thread_id } = comment
  let replies = children ? `Replies: ${children.length}` : 'discuss'
  let parentComment = `
    <div class="indent-${indent}" data-id="${_id}" data-thread-id="${thread_id}">
      <p class="fs-11 gray">${user.email} ${momentFromNow(createdAt)} days ago</p>
      <p class="fs-13">${text}</p>
      <p>${replies}</p>
      <p class="comment-delete fs-11">
        <a href="/commentsDelete/{{../id}}/{{comment._id}}" class="red">Delete</a>
      </p>
    </div>
  `
  let childComment = children ? renderComments(children, indent += 1) : ''

  return parentComment + childComment
}

let renderComments = (commentArr, indent = 0) => {
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
let flattenNested = (arr) => {
  if (!hasReplies(arr)) {
    return arr
  }
  let parents = getParents(arr)
  return parents.map(comment => {
    return getNestedChildren(arr, comment)
  })
}

module.exports = (arr) => {
  let flattened = flattenNested(arr)
  return renderComments(flattened)
}
