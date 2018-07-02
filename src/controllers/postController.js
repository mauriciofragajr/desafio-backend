import Post from '../models/Post';
import Category from '../models/Category';

const PER_PAGE = 10;

export default {
    listAll: async (req, res) => {
        try {

            let { q, page } = req.query;

            page = parseInt(page ? page : 1);
            q = q ? q : "";

            const total = await Post.find({
                $or: [
                    { title: { "$regex": q, "$options": "i" } }, { body: { "$regex": q, "$options": "i" } }
                ]
            }).count();

            // Calcular a última página
            if (total % PER_PAGE == 0) {
                lastPage = parseInt(total / PER_PAGE);
            } else {
                lastPage = parseInt((total / PER_PAGE) + 1);
            }

            // Evitar esforços
            if (page > lastPage) {
                return res.send({
                    posts: [],
                    result: 0
                });
            }

            const posts = await Post.find({
                $or: [
                    { title: { "$regex": q, "$options": "i" } }, { body: { "$regex": q, "$options": "i" } }
                ]
            }).populate({
                path: "categories"
            }).skip(PER_PAGE * page - PER_PAGE).limit(PER_PAGE);

            const firstPage = 1;
            let lastPage;


            return res.send({
                posts,
                result: posts.length,
                page,
                total,
                q,
                nextPage: page == lastPage ? null : page + 1,
                prevPage: page == firstPage ? null : page - 1
            });
        } catch (err) {
            return res.status(400).send({
                msg: 'Get failed',
                err
            });
        };
    },
    detail: async (req, res) => {
        try {
            const post = await Post.findOne({ slug: req.params.slug }).populate({
                path: 'categories',
                select: 'name slug'
            });

            return res.send({
                post,
            });

        } catch (err) {
            return res.status(400).send({
                msg: 'Get failed',
                err
            });
        };
    },
    listByCategory: async (req, res) => {
        try {
            const category = await Category.findOne({ slug: req.params.slug });

            if (!category) {
                return res.send({
                    posts: [],
                    result: 0
                });
            }

            const posts = await Post.find({ categories: category._id }).populate({
                path: 'categories',
                select: 'name slug'
            });

            return res.send({
                posts,
                result: posts.length
            });

        } catch (err) {
            return res.status(400).send({
                msg: 'Get failed',
                err
            });
        };
    },
    create: async (req, res) => {
        try {
            const post = await Post.create(req.body);
            return res.send({
                post
            });
        } catch (err) {
            return res.status(400).send({
                msg: 'Creation failed',
                err,
            });
        };
    },
    delete: async (req, res) => {
        try {
            const result = await Post.findOneAndDelete({ slug: req.params.slug });
            return res.send({
                result,
            });

        } catch (err) {
            return res.status(400).send({
                msg: 'Delete failed',
                err
            });
        };
    },
    update: async (req, res) => {
        try {
            const result = await Post.findOneAndUpdate({ slug: req.params.slug }, req.body);

            return res.send({
                result,
            });

        } catch (err) {
            return res.status(400).send({
                msg: 'Delete failed',
                err
            });
        };
    }
}