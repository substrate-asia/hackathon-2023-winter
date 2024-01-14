// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZerkLawyerJuster
 * @dev A smart contract for managing legal cases, lawyers, and justers with donation functionality.
 * @author Soft-law Team.
 */
contract ZerkLawyerJuster {
    // Access levels for users
    enum AccessLevel {
        None,
        Juster,
        Lawyer,
        Owner
    }

    address public owner;
    mapping(address => AccessLevel) public s_accessLevels;
    mapping(uint => bool) public s_completedCases;

    struct Lawyer {
        uint licenseNumber;
        string name;
        string jurisdiction;
        string speciality;
        bool isValidated;
    }

    event LawyerCreated(address lawyer);
    event LawyerValidated(address lawyer);
    event LawyerAdded(address lawyer);
    event LawyerRemoved(address lawyer);

    mapping(address => Lawyer) public s_lawyers;

    struct Juster {
        string passportNumber;
        string name;
        string jurisdiction;
        bool isValidated;
    }

    event JusterRemoved(address juster);
    event JusterAdded(address juster);
    event JusterCreated(address juster);
    event JusterValidated(address juster);

    mapping(address => Juster) public s_justers;

    struct Case {
        uint caseNumber;
        string jurisdiction;
        uint price;
        string description;
        bool isValidated;
        uint totalDonations;
        address justerAddress;
        bool isFunded;
    }

    event CaseCreated(address juster, uint caseNumber);
    event CaseValidated(uint caseNumber);
    event DonationReceived(address donor, uint caseNumber, uint amount);

    mapping(uint => bool) public s_usedCaseNumbers;
    mapping(uint => Case) public s_cases;

    /**
     * @dev Contract constructor, sets the contract owner.
     */
    constructor() {
        owner = msg.sender;
        s_accessLevels[owner] = AccessLevel.Owner;
    }

    /**
     * @dev Modifier to restrict function access to the contract owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /**
     * @dev Modifier to restrict function access to lawyers only.
     */
    modifier onlyLawyer() {
        require(
            getAccessLevel(msg.sender) == AccessLevel.Lawyer,
            "Only lawyer"
        );
        _;
    }

    /**
     * @dev Modifier to restrict function access to justers only.
     */
    modifier onlyJuster() {
        require(
            getAccessLevel(msg.sender) == AccessLevel.Juster,
            "Only Juster"
        );
        _;
    }

    /**
     * @dev Gets the access level of an account.
     * @param account The address to query the access level.
     * @return The access level of the account.
     */
    function getAccessLevel(address account) public view returns (AccessLevel) {
        return s_accessLevels[account];
    }

    /**
     * @dev Checks if an address belongs to a lawyer.
     * @param _lawyerAddress The address to check.
     * @return A boolean indicating whether the address belongs to a lawyer.
     */
    function isLawyer(address _lawyerAddress) internal view returns (bool) {
        return s_accessLevels[_lawyerAddress] == AccessLevel.Lawyer;
    }

    /**
     * @dev Checks if an address belongs to a juster.
     * @param _justerAddress The address to check.
     * @return A boolean indicating whether the address belongs to a juster.
     */
    function isJuster(address _justerAddress) internal view returns (bool) {
        return s_accessLevels[_justerAddress] == AccessLevel.Juster;
    }

    /**
     * @dev Removes a lawyer from the system.
     * @param _lawyerAddress The address of the lawyer to be removed.
     */
    function delLawyer(address _lawyerAddress) public onlyOwner {
        s_accessLevels[_lawyerAddress] = AccessLevel.None;
        s_lawyers[_lawyerAddress].isValidated = false;
        emit LawyerRemoved(_lawyerAddress);
    }

    /**
     * @dev Adds a lawyer to the system.
     * @param _lawyerAddress The address of the lawyer to be added.
     */
    function addLawyer(address _lawyerAddress) public onlyOwner {
        s_accessLevels[_lawyerAddress] = AccessLevel.Lawyer;
        emit LawyerAdded(_lawyerAddress);
    }

    /**
     * @dev Creates a new lawyer in the system.
     * @param _licenseNumber The license number of the lawyer.
     * @param _name The name of the lawyer.
     * @param _jurisdiction The jurisdiction of the lawyer.
     * @param _speciality The speciality of the lawyer.
     */
    function createLawyer(
        uint _licenseNumber,
        string memory _name,
        string memory _jurisdiction,
        string memory _speciality
    ) public {
        require(!s_lawyers[msg.sender].isValidated, "Lawyer already exists");

        Lawyer memory newLawyer = Lawyer({
            licenseNumber: _licenseNumber,
            name: _name,
            jurisdiction: _jurisdiction,
            speciality: _speciality,
            isValidated: false
        });

        s_lawyers[msg.sender] = newLawyer;
        emit LawyerCreated(msg.sender);
    }

    /**
     * @dev Validates a lawyer, granting them access rights.
     * @param _lawyerAddress The address of the lawyer to be validated.
     */
    function validateLawyer(address _lawyerAddress) public onlyOwner {
        require(
            !s_lawyers[_lawyerAddress].isValidated,
            "Lawyer is already validated"
        );
        s_accessLevels[_lawyerAddress] = AccessLevel.Lawyer;
        s_lawyers[_lawyerAddress].isValidated = true;
        emit LawyerValidated(_lawyerAddress);
    }

    /**
     * @dev Creates a new juster in the system.
     * @param _passportNumber The passport number of the juster.
     * @param _name The name of the juster.
     * @param _jurisdiction The jurisdiction of the juster.
     */
    function createJuster(
        string memory _passportNumber,
        string memory _name,
        string memory _jurisdiction
    ) public {
        require(!s_justers[msg.sender].isValidated, "Juster already exists");

        Juster memory newJuster = Juster({
            passportNumber: _passportNumber,
            name: _name,
            jurisdiction: _jurisdiction,
            isValidated: false
        });

        s_justers[msg.sender] = newJuster;
        emit JusterCreated(msg.sender);
    }

    /**
     * @dev Validates a juster, granting them access rights.
     * @param _justerAddress The address of the juster to be validated.
     */
    function validateJuster(address _justerAddress) public onlyLawyer {
        require(
            !s_justers[_justerAddress].isValidated,
            "Juster is already validated"
        );

        s_justers[_justerAddress].isValidated = true;
        s_accessLevels[_justerAddress] = AccessLevel.Juster;
        emit JusterValidated(_justerAddress);
    }

    /**
     * @dev Creates a new legal case in the system.
     * @param _caseNumber The number of the legal case.
     * @param _jurisdiction The jurisdiction of the legal case.
     * @param _price The price of the legal case.
     * @param _description The description of the legal case.
     */
    function createCase(
        uint _caseNumber,
        string memory _jurisdiction,
        uint _price,
        string memory _description
    ) public onlyJuster {
        require(!s_usedCaseNumbers[_caseNumber], "Case number already used");

        Case memory newCase = Case({
            caseNumber: _caseNumber,
            jurisdiction: _jurisdiction,
            price: _price,
            description: _description,
            isValidated: false,
            totalDonations: 0,
            justerAddress: msg.sender,
            isFunded: false
        });

        s_cases[_caseNumber] = newCase;
        s_usedCaseNumbers[_caseNumber] = true;

        emit CaseCreated(msg.sender, _caseNumber);
    }

    /**
     * @dev Validates a legal case, granting it access rights.
     * @param _caseNumber The number of the legal case to be validated.
     */
    function validateCase(uint _caseNumber) public onlyLawyer {
        require(s_usedCaseNumbers[_caseNumber], "Case number does not exist");
        require(!s_cases[_caseNumber].isValidated, "Case is already validated");

        s_cases[_caseNumber].isValidated = true;
        emit CaseValidated(_caseNumber);
    }

    /**
     * @dev Allows a donor to contribute funds to a legal case.
     * @param _caseNumber The number of the legal case to receive the donation.
     */
    function donateToCase(uint _caseNumber) public payable returns (bool) {
        require(s_usedCaseNumbers[_caseNumber], "Case number does not exist");
        require(s_cases[_caseNumber].isValidated, "Case is not validated");

        uint remainingAmount = s_cases[_caseNumber].price -
            s_cases[_caseNumber].totalDonations;

        // Convert donation amount to ether
        uint donationAmountInWei = msg.value;
        uint donationAmountInEther = donationAmountInWei / 1 ether;

        require(
            donationAmountInEther > 0 &&
                donationAmountInEther <= remainingAmount,
            "Invalid donation amount"
        );
        emit DonationReceived(msg.sender, _caseNumber, donationAmountInEther);

        s_cases[_caseNumber].totalDonations += donationAmountInEther;

        if (s_cases[_caseNumber].totalDonations >= s_cases[_caseNumber].price) {
            // Mark the case as funded
            s_completedCases[_caseNumber] = true;
        }

        if (s_cases[_caseNumber].totalDonations >= s_cases[_caseNumber].price) {
            // Mark the case as funded inside case struct
            s_cases[_caseNumber].isFunded = true;
        }

        return true;
    }

    /**
     * @dev Allows the assigned juster to withdraw funds from a fully funded legal case.
     * @param _caseNumber The number of the legal case to withdraw funds from.
     */
    function withdrawFunds(uint _caseNumber) public onlyJuster returns (bool) {
        require(s_completedCases[_caseNumber], "Case is not fully funded");

        // Ensure the Juster's address is valid before transferring funds
        require(
            msg.sender == s_cases[_caseNumber].justerAddress,
            "Only assigned Juster can withdraw funds"
        );

        payable(s_cases[_caseNumber].justerAddress).transfer(
            s_cases[_caseNumber].totalDonations * 1 ether
        );

        // Remove the case from active cases
        s_usedCaseNumbers[_caseNumber] = false;

        // Return true indicating successful withdrawal
        return true;
    }

    /**
     * @dev Gets the completion status of a legal case.
     * @param _caseNumber The number of the legal case.
     * @return A boolean indicating whether the case is completed (fully funded).
     */
    function getCompletedCases(uint _caseNumber) public view returns (bool) {
        return s_completedCases[_caseNumber];
    }

    /**
     * @dev Get details of a lawyer.
     * @param _lawyerAddress The address of the lawyer.
     * @return licenseNumber The license number of the lawyer.
     * @return name The name of the lawyer.
     * @return jurisdiction The jurisdiction of the lawyer.
     * @return speciality The speciality of the lawyer.
     * @return isValidated A boolean indicating whether the lawyer is validated.
     */
    function getLawyer(
        address _lawyerAddress
    )
        public
        view
        returns (
            uint licenseNumber,
            string memory name,
            string memory jurisdiction,
            string memory speciality,
            bool isValidated
        )
    {
        Lawyer memory lawyer = s_lawyers[_lawyerAddress];
        return (
            lawyer.licenseNumber,
            lawyer.name,
            lawyer.jurisdiction,
            lawyer.speciality,
            lawyer.isValidated
        );
    }

    /**
     * @dev Get details of a juster.
     * @param _justerAddress The address of the juster.
     * @return passportNumber The passport number of the juster.
     * @return name The name of the juster.
     * @return jurisdiction The jurisdiction of the juster.
     * @return isValidated A boolean indicating whether the juster is validated.
     */
    function getJuster(
        address _justerAddress
    )
        public
        view
        returns (
            string memory passportNumber,
            string memory name,
            string memory jurisdiction,
            bool isValidated
        )
    {
        Juster memory juster = s_justers[_justerAddress];
        return (
            juster.passportNumber,
            juster.name,
            juster.jurisdiction,
            juster.isValidated
        );
    }

    /**
     * @dev Get the owner of the contract.
     * @return The address of the contract owner.
     */
    function getContractOwner() public view returns (address) {
        return owner;
    }

    /**
     * @dev Check if a case number is used.
     * @param _caseNumber The number of the legal case.
     * @return A boolean indicating whether the case number is used.
     */
    function isCaseUsed(uint _caseNumber) public view returns (bool) {
        return s_usedCaseNumbers[_caseNumber];
    }

    /**
     * @dev Get detailed information about a legal case.
     * @param _caseNumber The number of the legal case.
     * @return jurisdiction The jurisdiction of the legal case.
     * @return price The price of the legal case.
     * @return description The description of the legal case.
     * @return isValidated A boolean indicating whether the legal case is validated.
     * @return totalDonations The total donations received for the legal case.
     * @return justerAddress The address of the assigned juster for the legal case.
     * @return isFunded A boolean indicating whether the legal case is funded.
     */
    function getCaseDetails(
        uint _caseNumber
    )
        public
        view
        returns (
            string memory jurisdiction,
            uint price,
            string memory description,
            bool isValidated,
            uint totalDonations,
            address justerAddress,
            bool isFunded
        )
    {
        Case memory legalCase = s_cases[_caseNumber];
        return (
            legalCase.jurisdiction,
            legalCase.price,
            legalCase.description,
            legalCase.isValidated,
            legalCase.totalDonations,
            legalCase.justerAddress,
            legalCase.isFunded
        );
    }
}
