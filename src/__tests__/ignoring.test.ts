import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for ignoring a digipet.
 *
 * It is intended to test two behaviours:
 *  1. ignoring a digipet reduces all stats
 */

describe("When a user ignores a digipet repeatedly, its stats decrease by 10 each time until it eventually bottoms out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 40,
      nutrition: 40,
      discipline: 40,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet/");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("discipline", 40);
    console.log("this is the body", response.body)
    expect(response.body.digipet).toHaveProperty("nutrition", 40);
    expect(response.body.digipet).toHaveProperty("happiness", 40);
  });

  test("1st GET /digipet/ignore informs them about the ignore and shows increase discipline for digipet", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 30);
    expect(response.body.digipet).toHaveProperty("nutrition", 30);
    expect(response.body.digipet).toHaveProperty("happiness", 30);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 20);
    expect(response.body.digipet).toHaveProperty("nutrition", 20);
    expect(response.body.digipet).toHaveProperty("happiness", 20);
  });

  test("3rd GET /digipet/ignore shows discipline hitting a ceiling of 100", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 10);
    expect(response.body.digipet).toHaveProperty("nutrition", 10);
    expect(response.body.digipet).toHaveProperty("happiness", 10);
  });

  test("4th GET /digipet/ignore shows no further increase in discipline", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("happiness", 0);
  });
});

