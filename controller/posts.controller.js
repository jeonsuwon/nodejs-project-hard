import { PostsService } from "../service/posts.service.js";

export class PostsController {
  postsService = new PostsService(); // 인스턴스화 ?
  //게시글 생성 API
  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();

      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  createPost = async (req, res, next) => {
    try {
      const { userId } = req.user;
      console.log("controller:" + userId);
      const { title, myinfo, status = "APPLY" } = req.body;

      const createPost = await this.postsService.createPost(
        userId,
        title,
        myinfo,
        status
      );
      return res.status(201).json({ data: createPost });
    } catch (err) {
      next(err);
    }
  };
}
