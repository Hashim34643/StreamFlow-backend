const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const mongoURI = require("../models/db");
const User = require("../models/create-user");

describe("GET /following/:userId", () => {
    let jwtToken1, jwtToken2, userId1, userId2;

  beforeAll(async () => {
    await mongoose.connect(mongoURI);
    await mongoose.connection.dropDatabase();

    const newUser = {
      username: "TestUser",
      firstName: "TestFirstName",
      lastName: "TestLastName",
      email: "TestEmail@gmail.com",
      password: "TestPassword",
      confirmPassword: "TestPassword"
    };
    await request(app).post("/create-user").send(newUser);

    const newUser2 = {
      username: "TestUser2",
      firstName: "TestFirstName2",
      lastName: "TestLastName2",
      email: "TestEmail2@gmail.com",
      password: "TestPassword",
      confirmPassword: "TestPassword"
    };
    await request(app).post("/create-user").send(newUser2);

    const response1 = await request(app).post("/login").send({
      email: "TestEmail@gmail.com",
      password: "TestPassword"
    });
    jwtToken1 = response1.body.token;
    userId1 = response1.body.user._id; 

    const response2 = await request(app).post("/login").send({
      email: "TestEmail2@gmail.com",
      password: "TestPassword"
    });
    jwtToken2 = response2.body.token;
    userId2 = response2.body.user._id; 
    await request(app).post(`/${userId1}/follow/${userId2}`).set("authorization", `BEARER ${jwtToken1}`);
  });
  
  test("Should respond with 200 and return a list of followers", async () => {
    const response = await request(app).get(`/following/${userId1}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.following)).toBe(true)
    expect(response.body.following.length).toBe(1);
  });
  test("Should respond with 404 and error message if user is nonexistent", async () => {
    const response = await request(app).get(`/following/65ef39708f50eb21c9eabe58`);
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  })

  afterAll( async () => {
    await mongoose.connection.close();
  })
})