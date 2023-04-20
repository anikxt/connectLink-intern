import { Post, Recipe } from '../models/index.js';

const postController = () => {
  return {
    async index(req, res) {
      const listOfPosts = await Post.find({});
      const listOfRecipes = await Recipe.find({});
      res.render('home', {
        listOfPosts: listOfPosts,
        listOfRecipes: listOfRecipes,
      });
    },
    createPost(req, res) {
      res.render('post/createPost');
    },
    async postPost(req, res) {
      const { title, description, hashtags } = req.body;

      // Validate post
      if (!title || !description || !hashtags) {
        req.flash('error', 'All fields are required');
        return res.redirect('/createpost');
      }

      const hashtagsArray = hashtags
        .split(',')
        .map((hashtag) => {
          hashtag = hashtag.trim();
          if (hashtag.startsWith('#')) {
            return hashtag;
          }
        })
        .filter(Boolean);

      const post = new Post({
        title,
        description,
        hashtag: hashtagsArray,
        username: req.user.name,
      });

      await post
        .save()
        .then(() => {
          res.redirect('/');
        })
        .catch((err) => {
          req.flash('error', 'Unable to create post');
          return res.redirect('/createpost');
        });
    },
    createRecipe(req, res) {
      res.render('post/postRecipe');
    },
    async postRecipe(req, res) {
      const {
        recipeName,
        description,
        cookTime,
        servings,
        ingredients,
        instructions,
      } = req.body;

      // Validate post
      if (
        !recipeName ||
        !description ||
        !cookTime ||
        !servings ||
        !ingredients ||
        !instructions
      ) {
        req.flash('error', 'All fields are required');
        return res.redirect('/postrecipe');
      }

      const ingredientsArray = ingredients.split(',');

      const post = new Recipe({
        recipeName,
        description,
        cookTime,
        servings,
        ingredients: ingredientsArray,
        instructions,
        username: req.user.name,
      });

      await post
        .save()
        .then(() => {
          res.redirect('/');
        })
        .catch((err) => {
          req.flash('error', 'Unable to create recipe');
          return res.redirect('/postrecipe');
        });
    },

    async recipe(req, res) {
      const recipeId = req.query.recipeId;
      var recipe = {
        recipeName: 'Pepperoni Pizza',
        description:
          'Classic pepperoni pizza recipe with crispy crust and gooey cheese.',
        cookTime: '15:00',
        servings: 4,
        ingredients:
          'Pizza dough: 1 pound, Tomato sauce: 1 cup, Mozzarella cheese: 2 cups, Pepperoni: 1/2 cup, Olive oil: 1 tablespoon.',
        instructions:
          'Preheat the oven to 450°F (230°C). Roll out the pizza dough on a floured surface to desired thickness. Spread tomato sauce over the dough, leaving a small border for the crust. Sprinkle shredded mozzarella cheese evenly over the sauce. Arrange pepperoni slices on top of the cheese. Drizzle olive oil over the pizza. Bake for 12-15 minutes or until the crust is golden brown and the cheese is melted and bubbly.',
        username: 'Aniket Kanere',
      };
      if (recipeId != 'pizza123') {
        recipe = await Recipe.findById(recipeId);
      }
      res.render('post/requestRecipe', {
        recipe: recipe,
      });
    },
    async requestRecipe(req, res) {
      const recipeId = req.body.recipeId;
      res.redirect(`/recipe?recipeId=${recipeId}`);
    },
  };
};

export default postController;
