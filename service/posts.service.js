import { PostsRepository } from "../repositories/posts.repository.js";

export class PostsService {
  postsRepository = new PostsRepository();
  //게시물 전체조회
  findAllPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();
    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return posts.map((post) => {
      return {
        contentsId: post.contentsId,
        userId: post.UserId,
        title: post.title,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };
  //게시물 상세조회
  findDetailPost = async (userId, contentsId) => {
    const posts = await this.postsRepository.findDetailPost(userId, contentsId);
    const post = {
      userId: posts.UserId,
      contentsId: posts.contentsId,
      title: posts.title,
      myinfo: posts.myinfo,
      status: posts.status,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    };
    return post;
  };
  //게시물 생성
  createPost = async (userId, title, myinfo, status) => {
    const createPost = await this.postsRepository.createPost(
      userId,
      title,
      myinfo,
      status
    );
    return {
      userId: createPost.UserId,
      title: createPost.title,
      myinfo: createPost.myinfo,
      status: createPost.status,
      createdAt: createPost.createdAt,
      updatedAt: createPost.updatedAt,
    };
  };
  //게시물변경
  updatePost = async (userId, contentsId, title, myinfo) => {
    const createPost = await this.postsRepository.updatePost(
      userId,
      contentsId,
      title,
      myinfo
    );
    return {
      userId: createPost.UserId,
      contentsId: createPost.contentsId,
      title: createPost.title,
      myinfo: createPost.myinfo,
      status: createPost.status,
      createdAt: createPost.createdAt,
      updatedAt: createPost.updatedAt,
    };
  };
}
