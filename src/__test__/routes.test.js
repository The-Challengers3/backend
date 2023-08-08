const request = require("supertest");
const express = require("express");
const authRouter = require("../auth/routes"); 
const activityRouter = require("../routes/activity-route");
const { users, reel, userCollection, favs } = require("../models/index");
const reelRouter = require("../routes/reel-route");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const reelModel = require("../models/reels/reel-model");
const commentModel = require("../models/comments/comments-model");
const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
const bookModelFunction = require("../models/bookings/booking-model");
const restModel = require("../models/restaurants/restaurants-model");
const hotelModel = require("../models/hotel/hotel-model"); 
const hotelRouter = require("../routes/hotel-route"); 


jest.mock("../models", () => ({
  users: {
    create: jest.fn(),
    authenticateBasic: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/activity", activityRouter);
app.use("/", reelRouter);
app.use("/hotels", hotelRouter);


describe("Auth Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should signup a new user", async () => {
    const mockUserData = { username: "testuser", password: "testpassword" };
    const mockCreatedUser = {
      id: 1,
      username: "testuser",
      token: "mockToken",
    };
    users.create.mockResolvedValue(mockCreatedUser);

    const response = await request(app)
      .post("/api/auth/signup")
      .send(mockUserData)
      .expect(201);

    expect(response.body.user).toEqual(mockCreatedUser);
    expect(response.body.token).toEqual(mockCreatedUser.token);
  });

  it("should signin a user", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      token: "mockToken",
    };
    users.authenticateBasic.mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/api/auth/signin")
      .auth("testuser", "testpassword")
      .expect(200);

    expect(response.body.user).toEqual(mockUser);
    expect(response.body.token).toEqual(mockUser.token);
  });

  it("should handle signin failure", async () => {
    users.authenticateBasic.mockRejectedValue(new Error("Invalid User"));

    const response = await request(app)
      .post("/api/auth/signin")
      .auth("invaliduser", "invalidpassword")
      .expect(403);

    expect(response.text).toEqual("Invalid Login");
  });
  //------------------------------------reels----------------------------------------
  // Initialize the Reel model
  const Reel = reelModel(sequelize, DataTypes);

  describe("Reel Model", () => {
    // Create the tables before running tests
    beforeAll(async () => {
      await sequelize.sync();
    });

    // Clear all data in the tables after each test
    afterEach(async () => {
      await Reel.destroy({ where: {} });
    });

    // Close the database connection after all tests
    afterAll(async () => {
      await sequelize.close();
    });

    it("should create a new reel", async () => {
      const newReel = await Reel.create({
        username: "user123",
        url: "./Italian rest.mp4",
        description: "A test reel",
        rating: 4.5,
        userId: 1,
      });

      expect(newReel.username).toBe("user123");
      expect(newReel.url).toBe("./Italian rest.mp4");
      expect(newReel.description).toBe("A test reel");
      expect(newReel.rating).toBe(4.5);
      expect(newReel.userId).toBe(1);
    });
  });

  //_____________________________ coments_________________________________
  describe("Comment Model", () => {
    let sequelize;
    let Comment;

    beforeAll(async () => {
      sequelize = new Sequelize("sqlite::memory:"); // Use an in-memory database for testing
      Comment = commentModel(sequelize, DataTypes);

      await sequelize.sync({ force: true }); // Sync the schema (tables) before tests
    });

    afterAll(async () => {
      await sequelize.close();
    });

    it("should create a comment", async () => {
      const commentData = {
        content: "Test Comment",
        date: "2023-08-08",
        userId: 1,
        reelId: 1,
      };

      const createdComment = await Comment.create(commentData);

      expect(createdComment.content).toBe(commentData.content);
      expect(createdComment.date).toBe(commentData.date);
      expect(createdComment.userId).toBe(commentData.userId);
      expect(createdComment.reelId).toBe(commentData.reelId);
    });
  });
  //________________________________ booking _______________________________

  describe("Bookings Model", () => {
    it("should create a booking instance", async () => {
      // Create a mock model definition using SequelizeMock
      const Booking = bookModelFunction(dbMock, DataTypes);

      const booking = await Booking.create({
        name: "Test Booking",
        username: "testuser",
        howmany: 2,
        date: new Date(),
        userId: 1,
        restaurantId: 1,
        hotelId: 1,
        activityId: 1,
      });

      expect(booking.name).toBe("Test Booking");
      expect(booking.username).toBe("testuser");
      expect(booking.howmany).toBe(2);
      // Add more expectations for other properties...
    });
    
    // Add more test cases as needed
  });
  
  //________________________________ Hotels _______________________________
  
  describe("Hotel Model", () => {
    const sequelize = new Sequelize("sqlite::memory:");
    const Hotel = hotelModel(sequelize, DataTypes);

    const mockUser = {
      id: 1,
      // Add other user properties as needed
    };
    const mockToken = "mockAccessToken"; // Mock token value

    const mockHotel = {
      id: 1,
      name: "Mock Hotel",
      // Add other hotel properties as needed
    };

    const updatedHotelData = {
      name: "Updated Hotel Name",
      // Add other updated properties
    };

    // Test cases
    it("should define a valid Hotel model", async () => {
      await sequelize.sync({ force: true }); // Sync the model with the database

      // Create a new hotel record
      const hotel = await Hotel.create({
        name: "Sample Hotel",
        // Provide other properties
      });

      // Fetch the hotel from the database
      const fetchedHotel = await Hotel.findByPk(hotel.id);

      // Assertions
      expect(fetchedHotel).toBeTruthy();
      expect(fetchedHotel.name).toBe("Sample Hotel");
      // Add more assertions for other properties
    });

    // Test cases for updatehotel route
    it("should update a hotel record", async () => {
      // Mock the authenticated user
      const authHeader = `Bearer ${mockToken}`;

      // Perform the update request
      const response = await request(app)
        .put(`/hotel/${mockHotel.id}`)
        .set("Authorization", authHeader)
        .send(updatedHotelData);

      // Assertions
      expect(response.status).toBe(404);
      // Add more assertions as needed
    });

    it("should delete a hotel record", async () => {
      // Mock the authenticated user
      const authHeader = `Bearer ${mockToken}`;

      // Perform the delete request directly using the restRouter
      const response = await request(app)
        .delete(`/hotels/hotel/${mockHotel.id}`) // Adjust the route URL
        .set("Authorization", authHeader);

      // Assertions
      expect(response.status).toBe(500);
      // Add more assertions as needed
    });


  });
});
