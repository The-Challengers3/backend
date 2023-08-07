/**
 * @swagger
 * components:
 *   schemas:
 *     activity:
 *       type: object
 *       required:
 *         - name
 *         - img
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The title of your book
 *         img:
 *           type: string
 *           description: The book explanation
 *         description:
 *           type: string
 *           description: Whether you have finished reading the book
 *
 */
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /activity:
 *   get:
 *     summary: Lists all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/models/activity/ativites-model.js'
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Books'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       500:
 *         description: Some server error
 * /book/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       404:
 *         description: The book was not found
 *   put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Books'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Books'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

const express = require("express");
const activityRouter = express.Router();

const { activity } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

activityRouter.get("/activity", bearerAuth, acl('readUser'), getactivity);
activityRouter.get("/activity/:id", bearerAuth, acl('readUser'), getOneactivity);
activityRouter.post("/activity", bearerAuth, acl('createOwner'), createactivity);
activityRouter.put("/activity/:id", bearerAuth, acl('updateOwner'), updateactivity);
activityRouter.delete("/activity/:id", bearerAuth, acl('delete'), deleteactivity);
activityRouter.get("/owneractivity/:id", bearerAuth, acl('readOwner'), getUseractivity);

async function getactivity(req, res) {
  let activityRecord = await activity.get();
  res.status(200).json(activityRecord);
}
async function getOneactivity(req, res) {
  let id = parseInt(req.params.id);
  let activityRecord = await activity.get(id);
  res.status(200).json(activityRecord);
}
async function createactivity(req, res) {
  let activityData = req.body;
  activityData.ownerId = req.user.id;

  let activityRecord = await activity.create(activityData);
  res.status(201).json(activityRecord);
}
async function updateactivity(req, res) {
  let id = parseInt(req.params.id);
  let activityData = req.body;
  let activitsyData = await activity.get(id)
  if (activitsyData.ownerId == req.user.id) {
    let activityRecord = await activity.update(id, activityData);
    res.status(201).json(activityRecord);
  }
  res.json("you can't update this activity")

}
async function deleteactivity(req, res) {
  let id = parseInt(req.params.id);
  // let activityData= await activity.get(id)
  // if(activityData.userId==req.user.id){
  let activityRecord = await activity.delete(id);
  res.status(204).json(activityRecord);
  // }
  // res.json("you can't delete this activity")

}

async function getUseractivity(req, res) {
  let id = parseInt(req.params.id);
  const favs = await userCollection.readHasMany(id, activity.model);
  res.status(200).json(favs);
}

module.exports = activityRouter;
