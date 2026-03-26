const express = require ('express');
const app = express();

const blogData = [
    {id: 1, title: 'First Blog Post', content: 'This is the content of the first blog post.', author: 'Jon'},
    {id: 2, title: 'Second Blog Post', content: 'This is the content of the second blog post.', author: 'Elon'},
    {id: 3, title: 'Third Blog Post', content: 'This is the content of the third blog post.', author: 'Bill'},
    {id: 4, title: 'Fourth Blog Post', content: 'This is the content of the fourth blog post.', author: 'Vinay'},
    {id: 5, title: 'Fifth Blog Post', content: 'This is the content of the fifth blog post.', author: 'Jon'}
]

//Query : Author
app.get('/blogs', (req, res) =>{
    if(req.query.author){
        const author = req.query.author
        const filteredBlogs = blogData.filter(blog => blog.author.toLowerCase() === author.toLocaleLowerCase())
        res.json(filteredBlogs)
    }
    
});

//Params :id
app.get('/blog/:id', (req, res) => {
     const blogId = parseInt(req.params.id)
     const blogPost = blogData.find(blog => blog.id === blogId) 

     if(blogData){
        res.json(blogPost)
     } else {
        res.status(404).json({message: 'Blog post not found'})
     }

})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})