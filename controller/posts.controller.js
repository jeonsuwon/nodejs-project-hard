import { PostsService } from "../service/posts.service.js";

export class PostsController {
  postsService = new PostsService(); // 인스턴스화 ?
  //게시글 조회 API
  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postsService.findAllPosts();

      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  //게시글 상세조회 API
  getDetailPost = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { contentsId } = req.params;
      const posts = await this.postsService.findDetailPost(userId, contentsId);

      return res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  };

  //게시글 생성 API
  createPost = async (req, res, next) => {
    try {
      const { userId } = req.user;
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
  //게시물 변경
  updatePost = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { contentsId } = req.params;
      const { title, myinfo } = req.body;

      const updatePost = await this.postsService.updatePost(
        userId,
        contentsId,
        title,
        myinfo
      );
      return res.status(201).json({ data: updatePost });
    } catch (err) {
      next(err);
    }
  };
}
