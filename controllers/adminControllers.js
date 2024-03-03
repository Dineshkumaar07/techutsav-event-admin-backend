const Event = require("../models/Event");
const User = require("../models/User");
const { BlobServiceClient } = require("@azure/storage-blob");
const emailjs = require('@emailjs/nodejs');

module.exports.createEvent_post = async (req, res) => {
  const { uniqueName } = req.body;
  try {
    Event.create({ uniqueName })
      .then((result) => {
        res.status(201).json({ msg: result._id });
      })
      .catch((err) => {
        res.status(400).json({ msg: "Error" });
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateEventDetails_put = async (req, res) => {
  const data = req.body;

  Object.keys(data).forEach(
    (element) => data[element] === "" && delete data[element]
  );

  await Event.updateOne({ uniqueName: data.uniqueName }, data)
    .then((result) => {
      res.status(200).json({ msg: "success" });
    })
    .catch((err) => {
      res.status(400).json({ msg: "Error" });
    });
};

module.exports.getEvents_get = (req, res) => {
  Event.find({})
    .then((result) => {
      result = result.map((element) => element.uniqueName);
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(400).json({ msg: "err" });
    });
};

module.exports.getEventData_post = (req, res) => {
  const { uniqueName } = req.body;
  Event.findOne({ uniqueName: uniqueName })
    .then((result) => {
      console.log(result);
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(400).json({ msg: "err" });
    });
};

module.exports.remove_delete = (req, res) => {
  const { uniqueName } = req.body;
  console.log(uniqueName);
  Event.deleteOne({ uniqueName: uniqueName })
    .then((result) => {
      console.log(result);
      res.status(200).json({ msg: "success" });
    })
    .catch((err) => {
      res.status(400).json({ msg: "err" });
    });
};

module.exports.getStudents_get = (req, res) => {
  User.find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ msg: "err" });
    });
};

const connectionString = process.env.CONNECTIONSTRING;
const containerName = process.env.CONTAINERNAME;

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

module.exports.uploadFile_post = async (req, res) => {
  const { uniqueName } = req.body;
  const file = req.file;

  const blockBlobClient = containerClient.getBlockBlobClient(
    uniqueName + ".jpg"
  );

  try {
    await blockBlobClient
      .upload(file.buffer, file.buffer.length)
      .then((result) => {
        // console.log(result);
        res.status(200).send({ msg: "success" });
      });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(400).send({ msg: "Error" });
  }
};

module.exports.updateUser_put = async (req, res) => {
  const { _id, paid, fullName, email, transactionNumber } = req.body;

  User.updateOne({ _id: _id }, { paid: paid, transactionNumber: transactionNumber })
    .then((result) => {
      var params = {
        to_name: fullName,
        to_mail: email,
        main_message: paid ? "Your Payment has been successfully Verified by the Administrator.\nOur Team is very Eager to meet you up in the event. Wish you have a safe journey.\nRegards, Team TechUtsav24." : "Your Payment transaction address is not matched. Please check the transaction id of your Payment and try once again.\n Thank you.\nRegards, Team TechUtsav24."
      };
      console.log(params);
      emailjs
        .send("service_1o6asp3", "template_30ahbql", params, {
          publicKey: "NuqZNK9_2HRsMPffr",
          privateKey: "1MLMSzsTl4VFlg5o4a_8k"
        })
        .then((result) => {
          console.log(result);
          console.log("Email Sent!");
        })
        .catch((err) => {
          console.log(err);
        });
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Error" });
    });
};
