function forumApp() {
    return {
        posts: [],
        comments: {},
        selectedPostId: null,
        showCommentBoxStatus: {},
        newComment: {},
        showForm: false,
        newPost: { title: '', name: '', profession: '', description: '', link: '' },
        searchTerm: '',
        hour: '00',
        minute: '00',
        second: '00',
        amPm: 'AM',
        updateTime() {
            setInterval(() => {
                let dayTime12 = new Date();
                let hour = dayTime12.getHours();
                let minutes = dayTime12.getMinutes();
                let seconds = dayTime12.getSeconds();

                this.amPm = hour < 12 ? "AM" : "PM";
                hour = hour > 12 ? hour - 12 : hour;
                hour = hour === 0 ? 12 : hour;

                this.hour = hour < 10 ? "0" + hour : hour;
                this.minute = minutes < 10 ? "0" + minutes : minutes;
                this.second = seconds < 10 ? "0" + seconds : seconds;
            }, 1000);
        },
        
        async init() {
            this.posts = await this.fetchPosts();
            // console.log('posts', this.posts);
            
            for (let post of this.posts) {
                this.comments[post.id] = await this.fetchComments(post.id);
                this.showCommentBoxStatus[post.id] = false;
                this.newComment[post.id] = '';
                post.showFullDescription = false; 
                post.liked = false; 
                this.updateTime(); 
             }
        },

        async fetchPosts() {
            try {
                const response = await fetch('/api/forum/posts');
                if (!response.ok) throw new Error('Failed to fetch posts');
                return await response.json();
            } catch (error) {
                console.error('Error fetching posts:', error);
                return [];
            }
        },       
        async fetchComments(postId) {
            try {
                const response = await fetch(`/api/forum/comments/${postId}`);
                if (!response.ok) throw new Error('Failed to fetch comments');
                return await response.json();
            } catch (error) {
                console.error('Error fetching comments:', error);
                return [];
            }
        },
        
        searchPosts() {
            if (this.searchTerm === '') {
                return this.posts; // Return all posts if no search term
            }

            return this.posts.filter(post => {
                const regex = new RegExp(this.searchTerm, 'gi');
                post.title = post.title.replace(regex, `<span class="highlight">$&</span>`);
                post.description = post.description.replace(regex, `<span class="highlight">$&</span>`);
                
                return post.title.match(regex) || post.description.match(regex);
            });
        },

        async likePost(postId) {
            const post = this.posts.find(p => p.id === postId);
            post.liked = !post.liked;  // Toggle like status
        },

        toggleFullDescription(postId) {
            const post = this.posts.find(p => p.id === postId);
            post.showFullDescription = !post.showFullDescription;
        },

        toggleComments(postId) {
            this.selectedPostId = this.selectedPostId === postId ? null : postId;
        },

        showCommentBox(postId) {
            this.showCommentBoxStatus[postId] = true;
        },

        hideCommentBox(postId) {
            this.showCommentBoxStatus[postId] = false;
        },

        async saveComment(postId) {
            const comment = this.newComment[postId];
            if (comment.trim() === '') return; // Do not save empty comments

            try {
                const response = await fetch('/api/forum/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ post_id: postId, comment })
                });

                if (response.ok) {
                    const newComment = await response.json();
                    this.comments[postId].push({ id: newComment.id, comment });
                    this.newComment[postId] = '';
                    this.hideCommentBox(postId);
                } else {
                    console.error('Failed to save comment', await response.text());
                }
            } catch (error) {
                console.error('Error saving comment:', error);
            }
        },

        async deleteComment(postId, commentId) {
            try {
                const response = await fetch(`/api/forum/comments/${commentId}`, { method: 'DELETE' });
                if (response.ok) {
                    this.comments[postId] = this.comments[postId].filter(c => c.id !== commentId);
                } else {
                    console.error('Failed to delete comment', await response.text());
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        },

        async createPost() {
            try {
                console.log("New post data: ", this.newPost);  // Log the form data
                
                const response = await fetch('/api/forum/posts/new', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.newPost)
                });
        
                if (response.ok) {
                    const newPost = await response.json();
                    console.log("Response from API: ", newPost);  // Log the API response
                    
                    if (newPost.title && newPost.name && newPost.profession) {
                        this.posts.push(newPost);  // Add new post to posts array
                        this.newPost = { title: '', name: '', profession: '', description: '', link: '' };  
                        this.showForm = false;  // Hide form after submission
                    } else {
                        console.error('API response does not contain expected fields');
                    }
                } else {
                    console.error('Failed to create post', await response.text());
                }
            } catch (error) {
                console.error('Error creating post:', error);
            }
        },        

        // async deletePost(postId) {
        //     try {
        //         const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
        //         if (response.ok) {
        //             this.posts = this.posts.filter(post => post.id !== postId);
        //             if (this.selectedPostId === postId) this.selectedPostId = null; // Deselect post if it was selected
        //         } else {
        //             console.error('Failed to delete post', await response.text());
        //         }
        //     } catch (error) {
        //         console.error('Error deleting post:', error);
        //     }
        // },

        showCreatePostForm() {
            this.showForm = !this.showForm;
        }
    };
}
