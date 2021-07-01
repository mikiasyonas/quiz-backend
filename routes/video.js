const express = require("express");
const videoRouter = express.Router();
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const Video = require("../models/Video");

const url = process.env.MONGO_URI;
// create storage engine

const storage = new GridFsStorage({
  url,
  file: (req, file) => {
    console.log("File", file);
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "videos"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

let gfs;
connect.once("open", () => {
  // initialize stream
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "posters"
  });
});

/*
        POST: Upload a single image/file to Image collection
    */

videoRouter
  .route("/")
  .post(upload.single("file"), (req, res, next) => {
    // check for existing images
    Video.findOne({ title: req.body.title })
      .then((video) => {
        console.log(video);
        if (video) {
          return res.status(200).json({
            success: false,
            message: "video already exists"
          });
        }

        let newVideo = new Video({
          title: req.body.title,
          filename: req.file.filename,
          fileId: req.file.id
        });

        newVideo
          .save()
          .then((video) => {
            res.status(200).json({
              success: true,
              video
            });
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  })
  .get((req, res, next) => {
    Video.find({})
      .then((videos) => {
        res.status(200).json({
          success: true,
          videos
        });
      })
      .catch((err) => res.status(500).json(err));
  });

/*
        GET: Delete an video from the collection
    */
videoRouter.route("/delete/:id").get((req, res, next) => {
  Video.findOne({ _id: req.params.id })
    .then((video) => {
      if (video) {
        Video.deleteOne({ _id: req.params.id })
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

videoRouter
  .route("/multiple")
  .post(upload.array("file", 3), (req, res, next) => {
    res.status(200).json({
      success: true,
      message: `${req.files.length} files uploaded successfully`
    });
  });

/*
        GET: Fetches all the files in the video
    */
videoRouter.route("/files").get((req, res, next) => {
  gfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available"
      });
    }

    files.map((file) => {
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png" ||
        file.contentType === "image/svg"
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }
    });

    res.status(200).json({
      success: true,
      files
    });
  });
});

/*
        GET: Fetches a particular file by filename
    */
videoRouter.route("/file/:filename").get((req, res, next) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available"
      });
    }

    res.status(200).json({
      success: true,
      file: files[0]
    });
  });
});
/*
        DELETE: Delete a particular file by an ID
    */
videoRouter.route("/file/del/:id").post((req, res, next) => {
  console.log(req.params.id);
  gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.status(200).json({
      success: true,
      message: `File with ID ${req.params.id} is deleted`
    });
  });
});

module.exports = videoRouter;
