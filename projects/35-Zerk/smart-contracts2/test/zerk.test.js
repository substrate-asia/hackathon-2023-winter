const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("ZerkLawyerJuster", function () {
  let zerkLawyerJuster;
  let owner;
  let lawyer;
  let juster;
  let caseNumber;

  beforeEach(async function () {
    [owner, lawyer, juster] = await ethers.getSigners();

    const ZerkLawyerJuster = await ethers.getContractFactory(
      "ZerkLawyerJuster"
    );
    zerkLawyerJuster = await ZerkLawyerJuster.deploy();
  });

  it("should allow the owner to add a lawyer", async function () {
    await zerkLawyerJuster.connect(owner).addLawyer(lawyer.address);
    // Assert
    const accessLevel = await zerkLawyerJuster.s_accessLevels(lawyer.address);
    console.log("Access Level:", parseInt(accessLevel));
    expect(accessLevel).to.equal(2); // AccessLevel.Lawyer has a value of 2
    expect(await zerkLawyerJuster.s_lawyers(lawyer.address)).to.exist;
  });

  it("should allow the owner to remove a lawyer", async function () {
    // Add a lawyer
    await zerkLawyerJuster.connect(owner).addLawyer(lawyer.address);

    // Act
    const removeLawyerTx = await zerkLawyerJuster
      .connect(owner)
      .delLawyer(lawyer.address);

    // Assert
    const accessLevel = await zerkLawyerJuster.s_accessLevels(lawyer.address);
    console.log("Access Level:", parseInt(accessLevel));
    expect(parseInt(accessLevel)).to.equal(0); // AccessLevel.None has a value of 0

    const lawyerInfo = await zerkLawyerJuster.s_lawyers(lawyer.address);
    const isValidated = lawyerInfo.isValidated;
    console.log("IsValidated:", isValidated);
    expect(isValidated).to.be.false;
  });

  it("should create a new lawyer in the system", async function () {
    // Act - Create a new lawyer
    const licenseNumber = 123456;
    const name = "John Doe";
    const jurisdiction = "CityXYZ";
    const speciality = "Contract Law";

    await zerkLawyerJuster.createLawyer(
      licenseNumber,
      name,
      jurisdiction,
      speciality
    );

    // Assert
    const createdLawyer = await zerkLawyerJuster.s_lawyers(owner.address);

    console.log(
      "Created Lawyer License Number:",
      parseInt(createdLawyer.licenseNumber)
    );
    expect(parseInt(createdLawyer.licenseNumber)).to.equal(licenseNumber);

    console.log("Created Lawyer Name:", createdLawyer.name);
    expect(createdLawyer.name).to.equal(name);

    console.log("Created Lawyer Jurisdiction:", createdLawyer.jurisdiction);
    expect(createdLawyer.jurisdiction).to.equal(jurisdiction);

    console.log("Created Lawyer Speciality:", createdLawyer.speciality);
    expect(createdLawyer.speciality).to.equal(speciality);

    console.log("Created Lawyer isValidated:", createdLawyer.isValidated);
    expect(createdLawyer.isValidated).to.be.false; // isValidated should be false initially
  });

  it("should return the correct access level for an account", async function () {
    await zerkLawyerJuster.connect(owner).addLawyer(lawyer.address);
    // Act
    const accessLevelOwner = await zerkLawyerJuster.getAccessLevel(
      owner.address
    );
    const accessLevelLawyer = await zerkLawyerJuster.getAccessLevel(
      lawyer.address
    );
    const accessLevelJuster = await zerkLawyerJuster.getAccessLevel(
      juster.address
    );

    // Assert
    console.log("Access Level (Owner):", parseInt(accessLevelOwner));
    expect(parseInt(accessLevelOwner)).to.equal(3); // AccessLevel.Owner has a value of 3

    console.log("Access Level (Lawyer):", parseInt(accessLevelLawyer));
    expect(parseInt(accessLevelLawyer)).to.equal(2); // AccessLevel.Lawyer has a value of 0 because it has been added

    console.log("Access Level (Juster):", parseInt(accessLevelJuster));
    expect(parseInt(accessLevelJuster)).to.equal(0); // AccessLevel.Juster has a value of 0 because juster has not been created yet
  });

  it("should validate a lawyer and set access level to Lawyer", async function () {
    // Act - Owner validates the lawyer
    await zerkLawyerJuster.connect(owner).validateLawyer(lawyer.address);

    // Get the updated access level and validation status
    const updatedAccessLevel = await zerkLawyerJuster.getAccessLevel(
      lawyer.address
    );
    const isLawyerValidatedAfter = (
      await zerkLawyerJuster.s_lawyers(lawyer.address)
    ).isValidated;

    // Assert
    console.log("Updated Access Level:", parseInt(updatedAccessLevel));
    expect(parseInt(updatedAccessLevel)).to.equal(2); // AccessLevel.Lawyer has a value of 2 after validation

    console.log("Is Lawyer Validated After:", isLawyerValidatedAfter);
    expect(isLawyerValidatedAfter).to.be.true; // Lawyer should be validated after the validation
  });

  it("should create a new juster in the system", async function () {
    // Act - Create a new juster
    const passportNumber = "AB123456";
    const name = "Alice";
    const jurisdiction = "CityABC";

    await zerkLawyerJuster.createJuster(passportNumber, name, jurisdiction);

    // Assert
    const createdJuster = await zerkLawyerJuster.s_justers(owner.address);

    console.log(
      "Created Juster Passport Number:",
      createdJuster.passportNumber
    );
    expect(createdJuster.passportNumber).to.equal(passportNumber);

    console.log("Created Juster Name:", createdJuster.name);
    expect(createdJuster.name).to.equal(name);

    console.log("Created Juster Jurisdiction:", createdJuster.jurisdiction);
    expect(createdJuster.jurisdiction).to.equal(jurisdiction);

    console.log("Created Juster isValidated:", createdJuster.isValidated);
    expect(createdJuster.isValidated).to.be.false; // isValidated should be false initially
  });

  it("should allow a lawyer to validate a juster", async function () {
    //pending
  });
  it("should allow a juster to create a legal case", async function () {
    // Add test logic for creating a legal case
  });

  it("should allow a lawyer to validate a legal case", async function () {
    // Add test logic for validating a legal case
  });

  it("should allow a donor to contribute funds to a legal case", async function () {
    // Add test logic for donating to a legal case
  });

  it("should allow the assigned juster to withdraw funds from a fully funded legal case", async function () {
    // Add test logic for withdrawing funds from a fully funded legal case
  });

  it("should return the completion status of a legal case", async function () {
    // Add test logic for getting the completion status of a legal case
  });
});
