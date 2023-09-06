const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");// 2.1 installing mapbox and mapbox sdk and then requiring in it
const mapBoxToken = process.env.MAPBOX_TOKEN; // 2.2 need to link with the mapbox token
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // 2.3 geocode with the access token of mapbox.
const { cloudinary } = require('../cloudinary');


module.exports.index = async (req, res) => {
     const campgrounds = await Campground.find({});
     res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
     res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
     const geoData = await geocoder.forwardGeocode({//
          // query: 'Yosemite, CA',//
          query: req.body.campground.location,//2.7
          limit: 1//
     }).send()//
     // console.log(geoData);//2.4 
     // console.log(geoData.body.features);// 2.5
     // res.send(geoData.body.features[0].geometry.coordinates);//2.6
     // res.send("OK!!");// 2.4

     const campground = new Campground(req.body.campground);
     campground.geometry = geoData.body.features[0].geometry;//3.1 
     campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
     campground.author = req.user._id;
     await campground.save();
     console.log(campground);
     req.flash('success', 'Successfully made a new campground!');
     res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
     const campground = await Campground.findById(req.params.id).populate({
          path: 'reviews',
          populate: {
               path: 'author'
          }
     }).populate('author');
     if (!campground) {
          req.flash('error', 'Can not find the campground');
          return res.redirect('/campgrounds');
     }
     res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
     const { id } = req.params;
     const campground = await Campground.findById(id)
     if (!campground) {
          req.flash('error', 'Can not find the campground');
          return res.redirect('/campgrounds');
     }
     res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
     const { id } = req.params;
     console.log(req.body);
     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
     campground.images.push(...imgs);
     await campground.save();
     if (req.body.deleteImages) {
          for (let filename of req.body.deleteImages) {
               await cloudinary.uploader.destroy(filename);
          }
          await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
     }
     req.flash('success', 'Successfully Updated the Campground!');
     res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
     const { id } = req.params;
     await Campground.findByIdAndDelete(id);
     req.flash('success', 'Successfully deleted campground!');
     res.redirect('/campgrounds');
}