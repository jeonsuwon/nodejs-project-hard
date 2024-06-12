import { PostsRepository } from "../repositories/posts.repository.js";

export class PostsService {
  postsRepository = new PostsRepository();
  findAllPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();
    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return posts.map((post) => {
      return {
        contentsId: post.contentsId,
        userId: post.UserId,
        title: post.tilte,
        myinfo: post.myinfo,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  createPost = async (userId, title, myinfo, status) => {
    console.log("service:" + userId);
    const createPost = await this.postsRepository.createPost(
      userId,
      title,
      myinfo,
      status
    );
    return {
      userId: createPost.userId,
      title: createPost.title,
      myinfo: createPost.myinfo,
      status: createPost.status,
      createdAt: createPost.createdAt,
      updatedAt: createPost.updatedAt,
    };
  };
}
