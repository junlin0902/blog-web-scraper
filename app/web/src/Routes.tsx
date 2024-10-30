// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="BlogContents" titleTo="blogContents" buttonLabel="New BlogContent" buttonTo="newBlogContent">
        <Route path="/blog-contents/new" page={BlogContentNewBlogContentPage} name="newBlogContent" />
        <Route path="/blog-contents/{id:Int}/edit" page={BlogContentEditBlogContentPage} name="editBlogContent" />
        <Route path="/blog-contents/{id:Int}" page={BlogContentBlogContentPage} name="blogContent" />
        <Route path="/blog-contents" page={BlogContentBlogContentsPage} name="blogContents" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Posts" titleTo="posts" buttonLabel="New Post" buttonTo="newPost">
        <Route path="/posts/new" page={PostNewPostPage} name="newPost" />
        <Route path="/posts/{id:Int}/edit" page={PostEditPostPage} name="editPost" />
        <Route path="/posts/{id:Int}" page={PostPostPage} name="post" />
        <Route path="/posts" page={PostPostsPage} name="posts" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
