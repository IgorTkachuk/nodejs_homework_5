const News = require('../db/models/news');

exports.getNews = () => new Promise( async (resolve, reject) => {
    try{
        const news = await News.find().populate('user');
        resolve(news);
    } catch (err) {
        reject(err);
    }
});

exports.saveNews = ({theme, text, userId: user}) => new Promise( async (resolve, reject) => {
    try{
        const objNews = {
            theme,
            text,
            user
        };

        let newNews = new News(objNews);
        let result = await newNews.save();
        resolve(result);

    } catch (err) {
        reject(err);
    }
});

exports.updateNews = ({
    text,
    theme,
    userId,
    id
}) => new Promise ( async (resolve, reject) => {
    try{
        let foundedNews = await News.find({_id: id, user: userId}).countDocuments();

        if(!foundedNews) {
            resolve({
                success: false,
                message: 'news with this id is not found or it is not your news'
            });
            return;
        }

        let toChange = {};

        if (text) toChange.text = text;
        if (theme) toChange.theme = theme;
      
        console.log(toChange);

        const news = await News.findByIdAndUpdate(
            id,
            {
                $set: toChange
            },
            {new: true}
        );
        resolve(news);

    } catch (err) {
        reject(err);
    }
})

exports.deleteNews = ({id}) => new Promise( async (resolve, reject) => {
    try{
        const result = await News.deleteOne({_id: id});
        resolve(result);
    } catch (err) {
        reject(err);
    }
});