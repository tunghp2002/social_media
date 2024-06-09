export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_FILE_PREVIEW = "getFilePreview",

  //  SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",

  // COMMENTS KEYS
  GET_COMMENTS_BY_POST_ID = "getCommentsByPostId",
  DELETE_COMMENT = "deleteComment",

  // CHAT KEYS
  GET_CHATS = "getChats",

  // MESSAGES KEYS
  GET_MESSAGES_BY_CHAT_ID = "getMessagesByChatId",
}
