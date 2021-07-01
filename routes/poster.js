const express = require("express");
const posterRouter = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

const crypto = require("crypto");

mongoose.Promise = require("bluebird");
const Poster = require("../models/Poster");

const url = process.env.MONGO_URI;
// create storage engine

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({storage});

const connect = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/*
        POST: Upload a single image/file to Image collection
    */

/**
 * @swagger
 * /api/poster:
 *  post:
 *    tags:
 *     - Poster
 *    description: Uploads a Poster
 *    consumes:
 *     - multipart/form-data
 *    parameters:
 *     - in: formData
 *       name: file
 *       type: file
 *       description: Image to Upload
 *     - in: body
 *       name: imageData
 *       description: Title
 *       schema:
 *        type: object
 *        required:
 *         - title
 *        properties:
 *         title:
 *          type: string
 *    responses:
 *      '201':
 *        description: User created
 *      '409':
 *        description: User already exists
 *      '400':
 *        description: Bad request
 *  get:
 *   tags:
 *    - Poster
 *   description: Get All Posters in the collection
 *   responses:
 *    '200':
 *      description: A successful response
 */
posterRouter
  .route("/")
  .post(upload.single("file"), (req, res, next) => {
    // check for existing images
    Poster.findOne({ title: req.body.title })
      .then((image) => {
        if (image) {
          return res.status(200).json({
            success: false,
            message: "Image already exists"
          });
        }

        let newImage = new Poster({
          title: req.body.title,
          type: req.body.type,
          filename: req.file.filename,
        });

        newImage
          .save()
          .then((image) => {
            res.status(200).json({
              success: true,
              image
            });
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  });

posterRouter
  .route("/multiple")
  .post(upload.array("file", 3), (req, res, next) => {
    res.status(200).json({
      success: true,
      message: `${req.files.length} files uploaded successfully`
    });
  });

/**
 * @swagger
 * /api/poster/files:
 *  get:
 *    tags:
 *     - Poster
 *    description: Get all images from Gridfs
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not Found
 */

/*
        GET: Fetches all the files in the uploads collection
    */
posterRouter.route("/files").get((req, res, next) => {
  
  Poster.find({}, (err, files) => {
    if (!files || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available"
      });
    }
    let mFiles = JSON.parse(JSON.stringify(files));

    mFiles.map((file) => {
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png" ||
        file.contentType === "image/svg"
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }
      file.filepath = process.env.APP_URL+'/uploads/'+file.filename;
      return file;
    });

    res.status(200).json({
      success: true,
      files: mFiles
    });
  });
});

/**
 * @swagger
 * /api/poster/image/{filename}:
 *  get:
 *    tags:
 *     - Poster
 *    description: Get a Image by filename
 *    parameters:
 *     - in: path
 *       name: filename
 *       schema:
 *         type: string
 *       required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not Found
 */
/*
        GET: Fetches a particular image and render on browser
    */
posterRouter.route("/image/:filename").get((req, res, next) => {
  Poster.find({ filename: req.params.filename },(err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available"
      });
    }

    if (
      files[0].contentType === "image/jpeg" ||
      files[0].contentType === "image/jpg" ||
      files[0].contentType === "image/png" ||
      files[0].contentType === "image/svg+xml"
    ) {
      console.log("files", files);
      var readstream = gfs.createReadStream({
        filename: files[0].filename
      });
      res.set("Content-Type", files[0].contentType);
      return readstream.pipe(res);
      // render image to browser
      // res.content_type = files[0].contentType;
      // gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
  // var readstream = gfs.createReadStream({
  //   filename: req.params.filename
  // });
  // res.pipe(readstream);
});

/**
 * @swagger
 * /api/poster/file/del/{id}:
 *  delete:
 *    tags:
 *     - Poster
 *    description: Delete Image by Id
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: ObjectId
 *       required: true
 *       description: Mongoose Object ID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not Found
 */

/*
        DELETE: Delete a particular file by an ID
    */
posterRouter.route("/file/del/:id").post((req, res, next) => {
  console.log(req.params.id);
  
  Poster.deleteOne({"_id": new mongoose.Types.ObjectId(req.params.id)}, (err, data) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.status(200).json({
      success: true,
      message: `File with ID ${req.params.id} is deleted`
    });
  });
});

/**
 * @swagger
 * /api/poster/delete/{id}:
 *  delete:
 *    tags:
 *     - Poster
 *    description: Delete Image by Id in the collection
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: ObjectId
 *       required: true
 *       description: Mongoose Object ID
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not Found
 */

/*
        GET: Delete an image from the collection
    */
posterRouter.route("/delete/:id").get((req, res, next) => {
  Poster.findOne({ _id: req.params.id })
    .then((image) => {
      if (image) {
        Poster.deleteOne({ _id: req.params.id })
          .then(() => {
            return res.status(200).json({
              success: true,
              message: `File with ID: ${req.params.id} deleted`
            });
          })
          .catch((err) => {
            return res.status(500).json(err);
          });
      } else {
        res.status(200).json({
          success: false,
          message: `File with ID: ${req.params.id} not found`
        });
      }
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = posterRouter;
