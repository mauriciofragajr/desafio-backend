import Post from '../models/Post';
import Category from '../models/Category';

const PER_PAGE = 4;

export default {
    listAll: async (req, res) => {
        try {
            // Pegando elementos da uri
            let { q, page } = req.query;

            // Convertendo page para int se tiver 
            page = parseInt(page ? page : 1);
            // Importante para fazer a busca
            q = q ? q : "";

            // Categorias que tem o texto (q). Importante para ser mais um parâmetro na busca
            const categoriesId = await Category.find({ name: { "$regex": q, "$options": "i" } }).distinct('_id');

            // Construindo a query principal da rota
            const query = {
                $or: [
                    { title: { "$regex": q, "$options": "i" } },
                    { body: { "$regex": q, "$options": "i" } },
                    { slug: { "$regex": q, "$options": "i" } },
                    { categories: { $in: categoriesId } },
                ]
            };

            // Quantidade de todos os retornos possíveis da requisição. Importante para a paginação
            const total = await Post.find(query).count();

            // Calcular a última página
            const firstPage = 1;
            const lastPage = parseInt(total / PER_PAGE) + (total % PER_PAGE == 0 ? 0 : 1);

            // Evitar esforços, se a página da requisição não tem resultado, já retorna vazio
            if (page > lastPage) {
                return res.send({
                    posts: [],
                    result: 0,
                    total: total
                });
            }

            // Busca efetiva dos posts com a paginação e limite por página. 
            // Usando a query principal.
            const posts = await Post.find(query).populate({
                path: "categories"
            }).sort({ createdAt: 'desc' }).skip(PER_PAGE * page - PER_PAGE).limit(PER_PAGE);

            return res.send({
                posts,
                result: posts.length,
                page,
                total,
                q,
                nextPage: page == lastPage ? null : page + 1,
                prevPage: page == firstPage ? null : page - 1,
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

            // Se não tiver categoria com a slug da requisição
            if (!category) {
                return res.send({
                    posts: [],
                    result: 0,
                    total: 0
                });
            };

            // Pegando elementos da uri
            let { page } = req.query;

            // Convertendo page para int se tiver 
            page = parseInt(page ? page : 1);

            // Quantidade de todos os retornos possíveis da requisição. Importante para a paginação
            const total = await Post.find({ categories: category._id }).count();

            // Calcular a última página
            const firstPage = 1;
            const lastPage = parseInt(total / PER_PAGE) + (total % PER_PAGE == 0 ? 0 : 1);

            // Evitar esforços, se a página da requisição não tem resultado, já retorna vazio
            if (page > lastPage) {
                return res.send({
                    posts: [],
                    result: 0,
                    total: total
                });
            }

            // Busca efetiva dos posts com a paginação e limite por página.
            const posts = await Post.find({ categories: category._id }).populate({
                path: 'categories',
                select: 'name slug'
            }).skip(PER_PAGE * page - PER_PAGE).limit(PER_PAGE);

            console.log(req);

            return res.send({
                posts,
                result: posts.length,
                page,
                total,
                category: req.params.slug,
                nextPage: page == lastPage ? null : page + 1,
                prevPage: page == firstPage ? null : page - 1,
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