import "dotenv/config";
import request from "supertest";
import { app } from "../src/index.js";

describe("Reproduction of 500 errors", () => {
  it("should return 200 for GET /products", async () => {
    const response = await request(app).get("/products");
    console.log("Response body for /products:", JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
  });

  it("should return 200 for GET /locations/provinces/region/:regionCode", async () => {
    // We need a valid region code. From test-location-service.ts we know 150000000 is valid.
    const regionCode = "150000000";
    const response = await request(app).get(`/locations/provinces/region/${regionCode}`);
    console.log(`Response body for /locations/provinces/region/${regionCode}:`, JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
  });

  it("should return 200 for GET /products/:id", async () => {
    // First get a product to have a valid ID
    const productsRes = await request(app).get("/products");
    const productId = productsRes.body.products[0].id;
    
    const response = await request(app).get(`/products/${productId}`);
    console.log(`Response body for /products/${productId}:`, JSON.stringify(response.body, null, 2));
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
  });
});
