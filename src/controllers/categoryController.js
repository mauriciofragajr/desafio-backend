import Category from '../models/Category';
import Post from '../models/Post';

export default {
    list: async (req, res) => {
        try {
            const categories = await Category.find();
            return res.send({
                categories,
                results: categories.length
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
            const category = await Category.create(req.body);
            return res.send({
                category
            });
        } catch (err) {
            // alterar tratamento depois, código de erro do mongoose
            if(err.code == 11000) {
                return res.status(409).send({
                    msg: 'Creation failed',
                    err: 'Slug duplicated',
                });
            }
            return res.status(400).send({
                msg: 'Creation failed',
                err,
            });
        };
    },
    delete: async (req, res) => {
        const category = await Category.findOne({ slug: req.params.slug });

        if (!category) {
            return res.send({
                result: null,
                message: "Not found"
            });
        }

        const posts = await Post.find({ categories: category._id });

        if (posts.length > 0) {
            return res.send({
                result: null,
                message: "Category is already in use"
            });
        }

        const result = await Category.findByIdAndDelete({
            _id: category._id
        });

        return res.send({
            result,
            message: "Category deleted"
        });
    }
}