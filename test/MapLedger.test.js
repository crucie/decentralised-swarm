import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("MapLedger", function () {

  async function deployFixture() {
    const [owner, agent1Signer, agent2Signer] = await hre.ethers.getSigners();
    const mapLedger = await hre.ethers.deployContract("MapLedger");
    return { mapLedger, owner, agent1Signer, agent2Signer };
  }

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      const { mapLedger } = await loadFixture(deployFixture);
      const address = await mapLedger.getAddress();
      expect(address).to.be.properAddress;
    });

    it("should start with zero points", async function () {
      const { mapLedger } = await loadFixture(deployFixture);
      const points = await mapLedger.getAllPoints();
      expect(points.length).to.equal(0);
    });
  });

  describe("addMapPoint", function () {
    it("should store a point and emit NewPointAdded event", async function () {
      const { mapLedger } = await loadFixture(deployFixture);

      await expect(mapLedger.addMapPoint("agent-alpha", 10, 15, 0))
        .to.emit(mapLedger, "NewPointAdded")
        .withArgs("agent-alpha", 10, 15, 0, () => true);

      const points = await mapLedger.getAllPoints();
      expect(points.length).to.equal(1);
      expect(points[0].agentId).to.equal("agent-alpha");
      expect(points[0].x).to.equal(10);
      expect(points[0].y).to.equal(15);
      expect(points[0].z).to.equal(0);
    });

    it("should store multiple points from the same agent", async function () {
      const { mapLedger } = await loadFixture(deployFixture);

      await mapLedger.addMapPoint("agent-alpha", 10, 10, 0);

      // Advance time by 10 seconds
      await time.increase(10);

      await mapLedger.addMapPoint("agent-alpha", 15, 10, 0);

      const points = await mapLedger.getAllPoints();
      expect(points.length).to.equal(2);
    });

    it("should support multiple agents independently", async function () {
      const { mapLedger, agent1Signer, agent2Signer } = await loadFixture(deployFixture);

      await mapLedger.connect(agent1Signer).addMapPoint("agent-alpha", 10, 10, 0);

      await time.increase(10);

      await mapLedger.connect(agent2Signer).addMapPoint("agent-beta", 50, 50, 0);

      const points = await mapLedger.getAllPoints();
      expect(points.length).to.equal(2);
      expect(points[0].agentId).to.equal("agent-alpha");
      expect(points[1].agentId).to.equal("agent-beta");
    });
  });

  describe("getAllPoints", function () {
    it("should return all stored points in order", async function () {
      const { mapLedger } = await loadFixture(deployFixture);

      await mapLedger.addMapPoint("agent-alpha", 1, 2, 3);
      await time.increase(10);
      await mapLedger.addMapPoint("agent-beta", 4, 5, 6);
      await time.increase(10);
      await mapLedger.addMapPoint("agent-alpha", 2, 3, 3);

      const points = await mapLedger.getAllPoints();
      expect(points.length).to.equal(3);
      expect(points[0].x).to.equal(1);
      expect(points[0].y).to.equal(2);
      expect(points[1].x).to.equal(4);
      expect(points[1].y).to.equal(5);
      expect(points[2].x).to.equal(2);
      expect(points[2].y).to.equal(3);
    });
  });

  describe("Velocity Validation", function () {
    it("should reject a point if the agent moves too fast", async function () {
      const { mapLedger } = await loadFixture(deployFixture);

      await mapLedger.addMapPoint("agent-alpha", 0, 0, 0);

      // Advance only 1 second, then try to move 100 units (MAX_SPEED = 5)
      await time.increase(1);

      await expect(
        mapLedger.addMapPoint("agent-alpha", 100, 0, 0)
      ).to.be.revertedWith("Velocity validation failed: Agent moving too fast");
    });

    it("should allow movement within speed limit", async function () {
      const { mapLedger } = await loadFixture(deployFixture);

      await mapLedger.addMapPoint("agent-alpha", 0, 0, 0);

      // Advance 10 seconds; MAX_SPEED=5 => max distance = 50
      await time.increase(10);

      await expect(
        mapLedger.addMapPoint("agent-alpha", 5, 0, 0)
      ).to.not.be.reverted;
    });

    it("should track velocity per agent independently", async function () {
      const { mapLedger } = await loadFixture(deployFixture);

      // Agent alpha starts at origin
      await mapLedger.addMapPoint("agent-alpha", 0, 0, 0);
      await time.increase(1);

      // Agent beta's first point at (100, 100) — no velocity check for a new agent
      await expect(
        mapLedger.addMapPoint("agent-beta", 100, 100, 0)
      ).to.not.be.reverted;
    });
  });

  describe("lastKnownPosition", function () {
    it("should update the last known position for an agent", async function () {
      const { mapLedger } = await loadFixture(deployFixture);

      await mapLedger.addMapPoint("agent-alpha", 10, 20, 0);

      const lastPos = await mapLedger.lastKnownPosition("agent-alpha");
      expect(lastPos.x).to.equal(10);
      expect(lastPos.y).to.equal(20);
    });
  });
});
