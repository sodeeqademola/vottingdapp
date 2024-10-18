import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";

describe("Votiing", function () {
  const votingFixture = async () => {
    const [owner, candidate1, candidate2, voter1, voter2, voter3, user] =
      await ethers.getSigners();

    const voting = await ethers.deployContract("Voting");

    const candidateData = {
      candidateId: 1,
      age: "20",
      name: "sodeeq",
      image:
        "https://dailypost.ng/wp-content/uploads/2022/07/Dumebi-Kachikwu.jpg",
      ipfs: "https://dailypost.ng/wp-content/uploads/2022/07/Dumebi-Kachikwu.jpg",
    };

    const voterData = {
      voterId: 1,
      name: "sodeeq",
      image:
        "https://dailypost.ng/wp-content/uploads/2022/07/Dumebi-Kachikwu.jpg",
      ipfs: "https://dailypost.ng/wp-content/uploads/2022/07/Dumebi-Kachikwu.jpg",
    };
    return {
      voting,
      owner,
      candidate1,
      candidate2,
      voter1,
      voter2,
      voter3,
      candidateData,
      voterData,
      user,
    };
  };

  describe("Deployment", () => {
    it("Voting Organizer sgould be the owner of the contract", async () => {
      const { owner, voting } = await loadFixture(votingFixture);

      expect(await voting.voteOrganizer()).to.be.equal(owner.address);
    });
  });

  describe("Set Candidate", () => {
    it("voteOrganizer alone should be able to set candidates", async () => {
      const { owner, voting, candidateData, candidate1, user } =
        await loadFixture(votingFixture);
      await expect(
        voting
          .connect(user)
          .setCandidate(
            candidate1.address,
            candidateData.age,
            candidateData.image,
            candidateData.name,
            candidateData.ipfs
          )
      ).to.be.revertedWith("sorry you are not the organizer");
    });
    it("set and get actual data", async () => {
      const { owner, voting, candidateData, candidate1, user } =
        await loadFixture(votingFixture);

      await voting.setCandidate(
        candidate1.address,
        candidateData.age,
        candidateData.image,
        candidateData.name,
        candidateData.ipfs
      );

      const candidate = await voting.getCandidateData(candidate1.address);
      expect(candidate[0]).to.be.equal(1);
      expect(candidate[2]).to.be.equal("sodeeq");
    });
    it("should get candidate address array", async () => {
      const { owner, voting, candidateData, candidate1, candidate2, user } =
        await loadFixture(votingFixture);
      expect(
        await voting.setCandidate(
          candidate1.address,
          candidateData.age,
          candidateData.image,
          candidateData.name,
          candidateData.ipfs
        )
      );
      expect(
        await voting.setCandidate(
          candidate2.address,
          candidateData.age,
          candidateData.image,
          candidateData.name,
          candidateData.ipfs
        )
      );
      const getCandidateAddress = await voting.getCandidatesAddress();
      // console.log(getCandidateAddress);
      expect(getCandidateAddress).to.contain(candidate1.address);
      expect(getCandidateAddress).to.contain(candidate2.address);
    });
    it("should emiit an event", async () => {
      const { candidate1, owner, candidateData, user, voting } =
        await loadFixture(votingFixture);

      await expect(
        voting.setCandidate(
          candidate1.address,
          candidateData.age,
          candidateData.image,
          candidateData.name,
          candidateData.ipfs
        )
      )
        .to.emit(voting, "CandidateCreate")
        .withArgs(
          candidateData.candidateId,
          candidateData.age,
          candidateData.name,
          candidateData.image,
          0,
          candidate1.address,
          candidateData.ipfs
        );
    });
  });
  describe("get Candidate Address", () => {
    it("should get candidates array", async () => {
      const { owner, voting, candidateData, candidate1, user, candidate2 } =
        await loadFixture(votingFixture);

      await voting.setCandidate(
        candidate1.address,
        candidateData.age,
        candidateData.image,
        candidateData.name,
        candidateData.ipfs
      );

      await voting.setCandidate(
        candidate2.address,
        candidateData.age,
        candidateData.image,
        candidateData.name,
        candidateData.ipfs
      );
      const candidateAddress = await voting.getCandidatesAddress();
      // console.log(candidateAddress);
      expect(candidateAddress).to.include(candidate1.address);
      expect(candidateAddress).to.include(candidate2.address);
    });
  });
  describe("get Candidate length", () => {
    it("should give candidate length", async () => {
      const { owner, voting, candidateData, candidate1, user, candidate2 } =
        await loadFixture(votingFixture);

      await voting.setCandidate(
        candidate1.address,
        candidateData.age,
        candidateData.image,
        candidateData.name,
        candidateData.ipfs
      );

      await voting.setCandidate(
        candidate2.address,
        candidateData.age,
        candidateData.image,
        candidateData.name,
        candidateData.ipfs
      );
      const candidateAddressLength = await voting.getCandidateLength();
      // console.log(typeof candidateAddressLength);
      expect(candidateAddressLength).to.equal(2);
    });
  });
  describe("getCandidateData", () => {
    it("get Candidate Data", async () => {
      const { owner, voting, candidateData, candidate1, user, candidate2 } =
        await loadFixture(votingFixture);

      await voting.setCandidate(
        candidate1.address,
        candidateData.age,
        candidateData.image,
        candidateData.name,
        candidateData.ipfs
      );

      const candidateDatum = await voting.getCandidateData(candidate1.address);
      // console.log(candidateDatum);
      expect(candidateDatum[0]).to.equal(1);
      expect(candidateDatum[2]).to.be.equal("sodeeq");
    });
  });
  describe("create voters", () => {
    it("create should revert if not organizer", async () => {
      const { owner, user, voter1, candidate1, candidate2, voterData, voting } =
        await loadFixture(votingFixture);
      await expect(
        voting
          .connect(user)
          .createVoters(
            voter1.address,
            voterData.name,
            voterData.image,
            voterData.ipfs
          )
      ).to.be.revertedWith("sorry you are not the organizer");
    });
    it("should not revert if the organizer", async () => {
      const { owner, user, voter1, candidate1, candidate2, voterData, voting } =
        await loadFixture(votingFixture);
      await expect(
        voting.createVoters(
          voter1.address,
          voterData.name,
          voterData.image,
          voterData.ipfs
        )
      ).to.not.reverted;
    });
    it("voters to vote must be allowed === 0", async () => {
      const { owner, user, voter1, candidate1, candidate2, voterData, voting } =
        await loadFixture(votingFixture);
      await expect(
        voting.createVoters(
          voter1.address,
          voterData.name,
          voterData.image,
          voterData.ipfs
        )
      ).to.not.revertedWith("you are not allowed to vote");
      const voterAllowed = await voting.getVoterData(voter1.address);
      expect(voterAllowed[4]).to.be.equal(1);
    });
    it("voters address should be inside the the voters arrays", async () => {
      const { owner, user, voter1, candidate1, candidate2, voterData, voting } =
        await loadFixture(votingFixture);
      expect(
        await voting.createVoters(
          voter1.address,
          voterData.name,
          voterData.image,
          voterData.ipfs
        )
      );
      const getVotersAddress = await voting.getVotersList();
      // console.log(getVotersAddress);
      expect(getVotersAddress).to.include(voter1.address);
    });
    it("should emit event when voter is registered", async () => {
      const { owner, user, voter1, candidate1, candidate2, voterData, voting } =
        await loadFixture(votingFixture);
      expect(
        await voting.createVoters(
          voter1.address,
          voterData.name,
          voterData.image,
          voterData.ipfs
        )
      )
        .to.emit(voting, "voterCreated")
        .withArgs(
          voterData.voterId,
          voterData.name,
          voterData.image,
          voter1.address,
          1,
          false,
          1000,
          voterData.ipfs
        );
    });
  });
  describe("vote", () => {
    it("should reject if voter is not alllowed to vote", async () => {
      const {
        owner,
        user,
        voter1,
        voter2,
        candidate1,
        candidate2,
        voterData,
        voting,
        candidateData,
      } = await loadFixture(votingFixture);

      await voting.setCandidate(
        candidate1.address,
        candidateData.age,
        candidateData.image,
        candidateData.name,
        candidateData.ipfs
      );
      await voting.createVoters(
        voter1.address,
        voterData.name,
        voterData.image,
        voterData.ipfs
      );
      await voting.createVoters(
        voter2.address,
        voterData.name,
        voterData.image,
        voterData.ipfs
      );

      await expect(
        voting
          .connect(voter1)
          .vote(candidate1.address, candidateData.candidateId)
      ).to.not.revertedWith("You are not allowed to vote");

      await expect(
        voting
          .connect(voter1)
          .vote(candidate1.address, candidateData.candidateId)
      ).to.be.revertedWith("You have already voted");
      await expect(
        voting
          .connect(voter2)
          .vote(candidate1.address, candidateData.candidateId)
      ).to.not.revertedWith("You are not allowed to vote");

      await expect(
        voting
          .connect(voter2)
          .vote(candidate1.address, candidateData.candidateId)
      ).to.be.revertedWith("You have already voted");
      // const voterAllowed = await voting.getVoterData(voter1.address);
      // console.log(voterAllowed);
      const votedVotersList = await voting.getVotedVotersList();
      expect(votedVotersList).to.include(voter1.address);
      const candidate = await voting.getCandidateData(candidate1.address);
      // console.log(candidate);
    });
  });
});
